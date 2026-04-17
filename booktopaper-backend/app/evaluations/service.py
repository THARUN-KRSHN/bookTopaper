"""
app/evaluations/service.py — AI-powered answer evaluation
"""
import uuid
from app.extensions import get_supabase
from app.shared.ai_client import chat_completion, parse_json_response
from app.shared.errors import AppError, ai_failed


def evaluate_exam(exam_id: str, user_id: str) -> dict:
    """
    Full evaluation pipeline:
    1. Fetch exam answers + paper questions
    2. Score each Q+A pair via AI
    3. Aggregate by topic
    4. Calculate grade
    5. Store evaluation record
    6. Return full breakdown
    """
    sb = get_supabase()

    # Fetch exam
    exam_res = sb.table("exams").select("*").eq("id", exam_id).eq("user_id", user_id).single().execute()
    if not exam_res.data:
        raise AppError("Exam not found", "NOT_FOUND", 404)

    exam = exam_res.data
    answers = exam.get("answers", []) or []

    # Fetch paper + questions
    paper_res = sb.table("papers").select("*").eq("id", exam["paper_id"]).single().execute()
    if not paper_res.data:
        raise AppError("Paper not found", "NOT_FOUND", 404)

    paper = paper_res.data
    total_marks = paper.get("total_marks", 100)

    # Build question index
    all_questions = {}
    for section in paper.get("sections", []):
        for q in section.get("questions", []):
            all_questions[q["id"]] = q

    # Score each answer
    breakdown = []
    total_scored = 0.0
    topic_accumulator: dict[str, dict] = {}

    for answer in answers:
        q_id = answer.get("question_id")
        answer_text = answer.get("answer_text", "")
        q = all_questions.get(q_id)

        if not q:
            continue

        max_marks = q.get("marks", 0)
        topic = q.get("topic", "General")

        try:
            score_result = score_answer_ai(
                question=q.get("text") or q.get("question", ""),
                max_marks=max_marks,
                answer=answer_text,
            )
        except Exception as e:
            score_result = {
                "marks_awarded": 0,
                "feedback": "Could not evaluate this answer automatically.",
                "correct_answer_hint": "",
            }

        marks_awarded = float(score_result.get("marks_awarded", 0))
        marks_awarded = max(0, min(marks_awarded, max_marks))  # clamp
        total_scored += marks_awarded

        breakdown.append({
            "question_id": q_id,
            "question_text": q.get("text") or q.get("question", ""),
            "user_answer": answer_text,
            "ai_feedback": score_result.get("feedback", ""),
            "correct_hint": score_result.get("correct_answer_hint", ""),
            "marks_awarded": marks_awarded,
            "max_marks": max_marks,
            "topic": topic,
        })

        # Accumulate topic scores
        if topic not in topic_accumulator:
            topic_accumulator[topic] = {"scored": 0, "max": 0}
        topic_accumulator[topic]["scored"] += marks_awarded
        topic_accumulator[topic]["max"] += max_marks

    # Build topic_scores list
    topic_scores = [
        {"topic": topic, "score": data["scored"], "max": data["max"]}
        for topic, data in topic_accumulator.items()
    ]

    percentage = (total_scored / total_marks * 100) if total_marks > 0 else 0
    grade = _calculate_grade(percentage)

    eval_id = str(uuid.uuid4())
    evaluation = {
        "id": eval_id,
        "exam_id": exam_id,
        "user_id": user_id,
        "total_marks": total_marks,
        "scored_marks": round(total_scored, 2),
        "grade": grade,
        "breakdown": breakdown,
        "topic_scores": topic_scores,
    }

    sb.table("evaluations").insert(evaluation).execute()
    return evaluation


def score_answer_ai(question: str, max_marks: int, answer: str) -> dict:
    """Call OpenRouter to score a single answer."""
    prompt = f"""You are a strict but fair university exam evaluator.

Question: {question}
Maximum marks: {max_marks}
Student answer: {answer}

Evaluate the student's answer. Consider:
- Correctness of concepts
- Completeness relative to mark weightage
- Clarity of explanation

Return ONLY valid JSON (no markdown), in exactly this format:
{{
  "marks_awarded": <float between 0 and {max_marks}>,
  "feedback": "<2-3 sentence feedback>",
  "correct_answer_hint": "<brief correct answer hint>"
}}

Be strict but reward correct concepts even with incomplete phrasing."""

    messages = [{"role": "user", "content": prompt}]
    try:
        raw = chat_completion(messages, max_tokens=500)
        return parse_json_response(raw)
    except Exception as e:
        raise ai_failed(f"Scoring error: {e}")


def _calculate_grade(percentage: float) -> str:
    if percentage >= 90:
        return "S"
    elif percentage >= 80:
        return "A"
    elif percentage >= 70:
        return "B"
    elif percentage >= 60:
        return "C"
    elif percentage >= 50:
        return "D"
    elif percentage >= 40:
        return "E"
    else:
        return "F"


def get_evaluation(eval_id: str, user_id: str) -> dict:
    sb = get_supabase()
    result = sb.table("evaluations").select("*").eq("id", eval_id).eq("user_id", user_id).single().execute()
    if not result.data:
        raise AppError("Evaluation not found", "NOT_FOUND", 404)
    return result.data


def list_evaluations(user_id: str) -> list:
    sb = get_supabase()
    result = sb.table("evaluations").select("id, exam_id, total_marks, scored_marks, grade, created_at").eq("user_id", user_id).order("created_at", desc=True).execute()
    return result.data or []
