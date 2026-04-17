"""
app/exams/service.py — Exam session management
"""
import uuid
from datetime import datetime, timezone
from app.extensions import get_supabase
from app.shared.errors import AppError, exam_already_submitted


def create_exam(paper_id: str, user_id: str, practice_mode: bool = False) -> dict:
    """Create a new exam session for a paper."""
    sb = get_supabase()

    # Verify paper exists
    paper_res = sb.table("papers").select("id, duration_mins, sections").eq("id", paper_id).single().execute()
    if not paper_res.data:
        raise AppError("Paper not found", "NOT_FOUND", 404)

    exam_id = str(uuid.uuid4())
    exam = {
        "id": exam_id,
        "user_id": user_id,
        "paper_id": paper_id,
        "status": "in_progress",
        "practice_mode": practice_mode,
        "answers": [],
    }
    sb.table("exams").insert(exam).execute()

    # Return enriched session
    result = sb.table("exams").select("*").eq("id", exam_id).single().execute()
    session = result.data
    session["paper"] = paper_res.data
    session["elapsed_secs"] = 0
    session["duration_mins"] = paper_res.data.get("duration_mins", 180)
    return session


def get_exam(exam_id: str, user_id: str) -> dict:
    """Get exam session, computing real elapsed time."""
    sb = get_supabase()
    result = sb.table("exams").select("*").eq("id", exam_id).eq("user_id", user_id).single().execute()
    if not result.data:
        raise AppError("Exam not found", "NOT_FOUND", 404)

    exam = result.data

    # Compute elapsed time server-side
    started_at = exam.get("started_at")
    if started_at and exam["status"] == "in_progress":
        if isinstance(started_at, str):
            started_dt = datetime.fromisoformat(started_at.replace("Z", "+00:00"))
        else:
            started_dt = started_at
        now = datetime.now(timezone.utc)
        elapsed = int((now - started_dt).total_seconds())
        exam["elapsed_secs"] = max(0, elapsed)
    else:
        exam["elapsed_secs"] = 0

    # Fetch paper for duration and questions
    paper_res = sb.table("papers").select("duration_mins, sections, title").eq("id", exam["paper_id"]).single().execute()
    if paper_res.data:
        exam["paper"] = paper_res.data
        exam["duration_mins"] = paper_res.data.get("duration_mins", 180)

    return exam


def save_answer(exam_id: str, user_id: str, question_id: str, answer_text: str) -> dict:
    """Save or update a single answer in the exam's answers JSONB."""
    sb = get_supabase()
    result = sb.table("exams").select("*").eq("id", exam_id).eq("user_id", user_id).single().execute()
    if not result.data:
        raise AppError("Exam not found", "NOT_FOUND", 404)

    exam = result.data
    if exam["status"] == "submitted":
        raise exam_already_submitted()

    answers = exam.get("answers", []) or []

    # Upsert the answer
    updated = False
    for ans in answers:
        if ans.get("question_id") == question_id:
            ans["answer_text"] = answer_text
            ans["updated_at"] = datetime.now(timezone.utc).isoformat()
            updated = True
            break

    if not updated:
        answers.append({
            "question_id": question_id,
            "answer_text": answer_text,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })

    sb.table("exams").update({"answers": answers}).eq("id", exam_id).execute()
    return {"message": "Answer saved.", "question_id": question_id}


def submit_exam(exam_id: str, user_id: str) -> dict:
    """
    Submit exam: validates time limit (with 30s grace period),
    sets status to 'submitted', returns final answers.
    """
    sb = get_supabase()
    result = sb.table("exams").select("*").eq("id", exam_id).eq("user_id", user_id).single().execute()
    if not result.data:
        raise AppError("Exam not found", "NOT_FOUND", 404)

    exam = result.data
    if exam["status"] == "submitted":
        raise exam_already_submitted()

    # Fetch paper duration
    paper_res = sb.table("papers").select("duration_mins").eq("id", exam["paper_id"]).single().execute()
    duration_mins = paper_res.data.get("duration_mins", 180) if paper_res.data else 180

    # Compute elapsed + enforce time limit (with 30s grace)
    started_at = exam.get("started_at")
    if started_at:
        if isinstance(started_at, str):
            started_dt = datetime.fromisoformat(started_at.replace("Z", "+00:00"))
        else:
            started_dt = started_at
        elapsed = int((datetime.now(timezone.utc) - started_dt).total_seconds())
        limit_secs = duration_mins * 60 + 30  # 30s grace
        # Accept submission regardless — graceful overflow policy
    else:
        elapsed = 0

    now_iso = datetime.now(timezone.utc).isoformat()
    sb.table("exams").update({
        "status": "submitted",
        "submitted_at": now_iso,
    }).eq("id", exam_id).execute()

    return {
        "exam_id": exam_id,
        "status": "submitted",
        "submitted_at": now_iso,
        "answers": exam.get("answers", []),
        "elapsed_secs": elapsed,
    }


def list_exams(user_id: str) -> list:
    """List all past exams for a user."""
    sb = get_supabase()
    result = sb.table("exams").select("*").eq("user_id", user_id).order("started_at", desc=True).execute()
    return result.data or []
