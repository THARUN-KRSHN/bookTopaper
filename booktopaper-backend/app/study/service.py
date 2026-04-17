"""
app/study/service.py — Flashcards, weak areas, study sessions, planner
"""
import uuid
from app.extensions import get_supabase
from app.shared.ai_client import chat_completion, parse_json_response
from app.shared.errors import AppError, ai_failed


# ── Topics ────────────────────────────────────────────────────────────────────

def get_all_topics(user_id: str) -> list:
    """Return all topics from all of this user's materials."""
    sb = get_supabase()
    # Get all material IDs for this user
    mat_res = sb.table("materials").select("id").eq("user_id", user_id).execute()
    mat_ids = [m["id"] for m in (mat_res.data or [])]

    if not mat_ids:
        return []

    result = sb.table("topics").select("*").in_("material_id", mat_ids).execute()
    return result.data or []


def get_topic(topic_id: str) -> dict:
    sb = get_supabase()
    result = sb.table("topics").select("*").eq("id", topic_id).single().execute()
    if not result.data:
        raise AppError("Topic not found", "NOT_FOUND", 404)

    topic = result.data
    # Generate summary on the fly if not stored
    if not topic.get("content") and topic.get("name"):
        try:
            topic["content"] = _generate_topic_summary(topic["name"], topic.get("subtopics", []))
        except Exception:
            topic["content"] = ""
    return topic


def _generate_topic_summary(name: str, subtopics: list) -> str:
    subtopic_str = ", ".join(subtopics) if subtopics else "general concepts"
    messages = [{
        "role": "user",
        "content": (
            f"Write a 2-3 paragraph educational summary for the topic '{name}' "
            f"covering: {subtopic_str}. Use clear, student-friendly language."
        ),
    }]
    return chat_completion(messages, max_tokens=600)


# ── Study Sessions ────────────────────────────────────────────────────────────

def start_session(topic_id: str, user_id: str) -> dict:
    """Start or resume a study session for a topic."""
    sb = get_supabase()
    # Check for existing in-progress session
    existing = (
        sb.table("study_sessions")
        .select("*")
        .eq("user_id", user_id)
        .eq("topic_id", topic_id)
        .eq("completed", False)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    if existing.data:
        return existing.data[0]

    session_id = str(uuid.uuid4())
    session = {
        "id": session_id,
        "user_id": user_id,
        "topic_id": topic_id,
        "phase": "learn",
        "completed": False,
        "score": None,
    }
    sb.table("study_sessions").insert(session).execute()
    return session


def update_session(session_id: str, user_id: str, updates: dict) -> dict:
    """Update phase / completion / score of a study session."""
    sb = get_supabase()
    allowed = {"phase", "completed", "score"}
    clean_updates = {k: v for k, v in updates.items() if k in allowed}

    sb.table("study_sessions").update(clean_updates).eq("id", session_id).eq("user_id", user_id).execute()
    result = sb.table("study_sessions").select("*").eq("id", session_id).single().execute()
    return result.data or {}


# ── Flashcards ────────────────────────────────────────────────────────────────

def get_flashcards(topic_id: str) -> list:
    sb = get_supabase()
    result = sb.table("flashcards").select("*").eq("topic_id", topic_id).execute()
    return result.data or []


def generate_flashcards(topic_id: str, count: int = 10) -> list:
    """AI-generate flashcards for a topic and store them in DB."""
    sb = get_supabase()
    topic_res = sb.table("topics").select("*").eq("id", topic_id).single().execute()
    if not topic_res.data:
        raise AppError("Topic not found", "NOT_FOUND", 404)

    topic = topic_res.data
    subtopics = topic.get("subtopics", [])
    content = topic.get("content", "")

    prompt = f"""Generate {count} flashcards for the topic: "{topic['name']}".
Subtopics: {', '.join(subtopics) if subtopics else 'general'}
Content context: {content[:2000] if content else 'Use general knowledge'}

Return ONLY a valid JSON array (no markdown), each item:
{{"front": "concise term or question (max 15 words)", "back": "clear definition or answer"}}

Generate exactly {count} flashcards covering different aspects of the topic."""

    messages = [{"role": "user", "content": prompt}]
    try:
        raw = chat_completion(messages, max_tokens=2000)
        cards = parse_json_response(raw)
    except Exception as e:
        raise ai_failed(f"Flashcard generation failed: {e}")

    # Store in DB
    rows = [
        {
            "topic_id": topic_id,
            "front": c.get("front", ""),
            "back": c.get("back", ""),
        }
        for c in cards if c.get("front") and c.get("back")
    ]
    sb.table("flashcards").insert(rows).execute()

    # Return freshly created flashcards
    return get_flashcards(topic_id)


# ── Weak Areas ────────────────────────────────────────────────────────────────

def get_weak_areas(user_id: str) -> list:
    """
    Aggregate topic scores across all evaluations.
    Weak = topics where scored/max < 0.5.
    """
    sb = get_supabase()
    eval_res = sb.table("evaluations").select("topic_scores").eq("user_id", user_id).execute()
    evaluations = eval_res.data or []

    topic_totals: dict[str, dict] = {}
    for ev in evaluations:
        for ts in (ev.get("topic_scores") or []):
            topic = ts.get("topic", "")
            if not topic:
                continue
            if topic not in topic_totals:
                topic_totals[topic] = {"scored": 0, "max": 0}
            topic_totals[topic]["scored"] += ts.get("score", 0)
            topic_totals[topic]["max"] += ts.get("max", 0)

    weak = []
    for topic, data in topic_totals.items():
        if data["max"] == 0:
            continue
        ratio = data["scored"] / data["max"]
        if ratio < 0.5:
            weak.append({
                "topic_name": topic,
                "average_score": round(ratio * 100, 1),
                "scored": data["scored"],
                "max": data["max"],
            })

    # Sort worst first
    weak.sort(key=lambda x: x["average_score"])
    return weak


def generate_practice_questions(topic_name: str) -> list:
    """Generate 5 targeted practice questions for a weak topic."""
    prompt = f"""Generate 5 targeted practice questions for students who are weak in: "{topic_name}".

Focus on: fundamental concepts, common misconceptions, application problems.
Mix difficulty: 2 easy, 2 medium, 1 hard.

Return ONLY a valid JSON array (no markdown):
[{{"question": "...", "difficulty": "easy|medium|hard", "marks": 5}}]"""

    messages = [{"role": "user", "content": prompt}]
    try:
        raw = chat_completion(messages, max_tokens=1500)
        return parse_json_response(raw)
    except Exception as e:
        raise ai_failed(f"Practice question generation failed: {e}")
