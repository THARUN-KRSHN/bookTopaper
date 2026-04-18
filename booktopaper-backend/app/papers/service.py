"""
app/papers/service.py — Question paper generation logic
"""
import uuid
import os
import random
from app.extensions import get_supabase
from app.shared.ai_client import chat_completion, parse_json_response
from app.shared.storage import upload_to_storage
from app.shared.errors import AppError, ai_failed
from app.papers.templates import get_template, get_style_prompt
from app.papers.pdf_export import generate_pdf

BUCKET = os.getenv("SUPABASE_BUCKET_PAPERS", "papers")


def generate_paper(config: dict, user_id: str) -> dict:
    """
    Full paper generation pipeline:
    1. Fetch topics from selected materials
    2. Generate questions section by section via AI
    3. Build paper dict
    4. Generate PDF → upload to storage
    5. Save paper to DB
    6. Return full paper
    """
    sb = get_supabase()
    material_ids = config.get("material_ids", [])
    format_code = config.get("format", "ktu").lower()
    title = config.get("title", "Question Paper")
    total_marks = config.get("total_marks", 100)
    duration_mins = config.get("duration_mins", 180)
    difficulty_dist = config.get("difficulty", {"easy": 30, "medium": 50, "hard": 20})
    section_configs = config.get("sections", [])

    # 1. Fetch topics from selected materials
    all_topics = []
    for material_id in material_ids:
        topics_res = sb.table("topics").select("*").eq("material_id", material_id).execute()
        all_topics.extend(topics_res.data or [])

    if not all_topics:
        raise AppError(
            "No topics found. Upload and process materials first.",
            "NO_TOPICS", 422,
        )

    # 2. Get template
    template = get_template(format_code)

    # Use section configs from request, fall back to template defaults
    if not section_configs and template.sections:
        section_configs = [
            {
                "name": s.name,
                "mark_per_q": s.default_mark_per_q,
                "count": s.default_count,
                "style": s.style,
                "instruction": s.instruction,
            }
            for s in template.sections
        ]

    # 3. Generate questions per section
    built_sections = []
    q_number = 1
    for sec_cfg in section_configs:
        questions = generate_questions_ai(
            section_config=sec_cfg,
            topics=all_topics,
            format_name=template.name,
            difficulty_dist=difficulty_dist,
        )
        # Number questions sequentially
        for q in questions:
            q["number"] = q_number
            q_number += 1

        built_sections.append({
            "name": sec_cfg.get("name", "Section"),
            "rules": sec_cfg.get("instruction", sec_cfg.get("rules", "")),
            "questions": questions,
        })

    # 4. Build full paper dict
    paper_id = str(uuid.uuid4())
    paper = {
        "id": paper_id,
        "user_id": user_id,
        "title": title,
        "material_ids": material_ids,
        "format": format_code.upper(),
        "total_marks": total_marks,
        "duration_mins": duration_mins,
        "difficulty": difficulty_dist,
        "sections": built_sections,
        "general_instructions": template.general_instructions,
    }

    # 5. Generate PDF
    try:
        pdf_bytes = generate_pdf(paper)
        pdf_path = f"{user_id}/{paper_id}.pdf"
        pdf_url = upload_to_storage(pdf_bytes, pdf_path, BUCKET)
        paper["pdf_path"] = pdf_path
        paper["pdf_url"] = pdf_url
    except Exception as e:
        paper["pdf_path"] = None
        paper["pdf_url"] = None

    # 6. Save to DB
    db_row = {
        "id": paper_id,
        "user_id": user_id,
        "title": title,
        "material_ids": material_ids,
        "format": format_code,
        "total_marks": total_marks,
        "duration_mins": duration_mins,
        "difficulty": difficulty_dist,
        "sections": built_sections,
        "general_instructions": paper.get("general_instructions"),
        "pdf_path": paper.get("pdf_path"),
    }
    result = sb.table("papers").insert(db_row).execute()

    return result.data[0]


def generate_questions_ai(
    section_config: dict,
    topics: list,
    format_name: str,
    difficulty_dist: dict,
) -> list:
    """Call OpenRouter to generate questions for a single section."""
    count = section_config.get("count", 5)
    marks = section_config.get("mark_per_q", 5)
    section_name = section_config.get("name", "Section")
    style = section_config.get("style", "short_answer")

    # Pick a representative difficulty based on marks
    if marks <= 2:
        difficulty = "easy"
    elif marks <= 5:
        difficulty = "medium"
    else:
        difficulty = "hard"

    # Build topic summary for the prompt
    topic_list = [
        f"- {t['name']}: {', '.join(t.get('subtopics', [])[:4])}"
        for t in topics[:10]  # cap at 10 topics for prompt size
    ]
    topic_str = "\n".join(topic_list)
    style_desc = get_style_prompt(style)

    prompt = f"""You are an expert exam question writer for university-level students.

Generate exactly {count} {difficulty} questions for a "{section_name}" section.
Each question is worth {marks} marks.
Exam format: {format_name}
Question style: {style_desc}

Topics to draw from:
{topic_str}

Return ONLY a valid JSON array in this exact format (no markdown, no explanation):
[
  {{
    "id": "q_unique_id",
    "question": "Full question text here",
    "text": "Full question text here",
    "marks": {marks},
    "topic": "Topic name this question belongs to",
    "difficulty": "{difficulty}",
    "part": "{section_name}"
  }}
]

Generate exactly {count} questions."""

    messages = [{"role": "user", "content": prompt}]
    try:
        raw = chat_completion(messages, max_tokens=3000)
        questions = parse_json_response(raw)
        if not isinstance(questions, list):
            raise ValueError("Expected a JSON array")
        # Ensure IDs are unique
        for i, q in enumerate(questions):
            if not q.get("id"):
                q["id"] = f"q_{uuid.uuid4().hex[:8]}"
        return questions[:count]
    except Exception as e:
        raise ai_failed(f"Question generation error: {e}")


def get_paper(paper_id: str, user_id: str) -> dict:
    sb = get_supabase()
    result = sb.table("papers").select("*").eq("id", paper_id).eq("user_id", user_id).single().execute()
    if not result.data:
        raise AppError("Paper not found", "NOT_FOUND", 404)
    return result.data


def list_papers(user_id: str) -> list:
    sb = get_supabase()
    result = sb.table("papers").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return result.data or []


def delete_paper(paper_id: str, user_id: str) -> None:
    sb = get_supabase()
    paper_res = sb.table("papers").select("*").eq("id", paper_id).eq("user_id", user_id).single().execute()
    if not paper_res.data:
        raise AppError("Paper not found", "NOT_FOUND", 404)

    pdf_path = paper_res.data.get("pdf_path")
    sb.table("papers").delete().eq("id", paper_id).execute()

    if pdf_path:
        try:
            from app.shared.storage import delete_from_storage
            delete_from_storage(pdf_path, BUCKET)
        except Exception:
            pass


def update_question(paper_id: str, question_id: str, user_id: str, updates: dict) -> dict:
    """Edit a specific question's text within the paper's sections JSONB."""
    sb = get_supabase()
    paper_res = sb.table("papers").select("*").eq("id", paper_id).eq("user_id", user_id).single().execute()
    if not paper_res.data:
        raise AppError("Paper not found", "NOT_FOUND", 404)

    sections = paper_res.data.get("sections", [])
    found = False
    for section in sections:
        for q in section.get("questions", []):
            if q.get("id") == question_id:
                q.update(updates)
                found = True
                break

    if not found:
        raise AppError("Question not found", "NOT_FOUND", 404)

    sb.table("papers").update({"sections": sections}).eq("id", paper_id).execute()
    return {"message": "Question updated.", "question_id": question_id}
