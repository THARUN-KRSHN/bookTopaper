"""
app/planner/service.py — Revision plan generation
"""
import uuid
from datetime import datetime, date, timedelta
from app.extensions import get_supabase
from app.shared.errors import AppError
from app.study.service import get_weak_areas


INTENSITY_CONFIG = {
    "light":     {"topics_per_day": 1, "rest_every": 5, "hours_per_day": 1.0},
    "moderate":  {"topics_per_day": 2, "rest_every": 7, "hours_per_day": 2.0},
    "intensive": {"topics_per_day": 3, "rest_every": 7, "hours_per_day": 3.0},
}


def generate_plan(config: dict, user_id: str) -> dict:
    """
    Build a day-by-day revision plan:
    1. Count days until exam
    2. Fetch all topics; prioritise weak areas
    3. Assign topics to days by intensity
    4. Insert rest days
    5. Add final revision week
    """
    sb = get_supabase()

    exam_name = config.get("exam_name", "Upcoming Exam")
    exam_date_str = config.get("exam_date")
    intensity = config.get("intensity", "moderate").lower()
    material_ids = config.get("material_ids", [])

    if not exam_date_str:
        raise AppError("exam_date is required", "VALIDATION_ERROR", 422)

    try:
        exam_dt = datetime.strptime(exam_date_str, "%Y-%m-%d").date()
    except ValueError:
        raise AppError("exam_date must be YYYY-MM-DD", "VALIDATION_ERROR", 422)

    today = date.today()
    days_remaining = (exam_dt - today).days
    if days_remaining <= 0:
        raise AppError("exam_date must be in the future", "VALIDATION_ERROR", 422)

    cfg = INTENSITY_CONFIG.get(intensity, INTENSITY_CONFIG["moderate"])
    topics_per_day = cfg["topics_per_day"]
    rest_every = cfg["rest_every"]
    duration_str = f"{cfg['hours_per_day']:.0f}h"

    # Fetch topics
    all_topics = []
    if material_ids:
        for mid in material_ids:
            res = sb.table("topics").select("name").eq("material_id", mid).execute()
            all_topics.extend([t["name"] for t in (res.data or [])])
    else:
        mat_res = sb.table("materials").select("id").eq("user_id", user_id).execute()
        for mat in (mat_res.data or []):
            res = sb.table("topics").select("name").eq("material_id", mat["id"]).execute()
            all_topics.extend([t["name"] for t in (res.data or [])])

    # Deduplicate topics
    seen = set()
    unique_topics = []
    for t in all_topics:
        if t not in seen:
            seen.add(t)
            unique_topics.append(t)

    # Prioritise weak topics — put them first
    try:
        weak = get_weak_areas(user_id)
        weak_names = [w["topic_name"] for w in weak]
        priority = [t for t in unique_topics if t in weak_names]
        rest_topics = [t for t in unique_topics if t not in weak_names]
        ordered_topics = priority + rest_topics
    except Exception:
        ordered_topics = unique_topics

    if not ordered_topics:
        ordered_topics = ["General Revision"]

    # Build plan
    plan_days = []
    topic_idx = 0
    study_day_count = 0

    # Reserve last 7 days (or 20% of remaining) for revision
    revision_start_offset = max(1, min(7, days_remaining // 5))
    study_days_count = days_remaining - revision_start_offset

    for day_offset in range(days_remaining):
        current_date = today + timedelta(days=day_offset)
        date_str = current_date.isoformat()

        # Rest day
        if study_day_count > 0 and study_day_count % rest_every == 0:
            plan_days.append({
                "date": date_str,
                "topics": [],
                "duration": "0h",
                "type": "rest",
            })
            study_day_count += 1
            continue

        # Revision week — revisit weak topics
        if day_offset >= study_days_count:
            weak_for_revision = ordered_topics[:topics_per_day] if ordered_topics else ["Review all topics"]
            plan_days.append({
                "date": date_str,
                "topics": weak_for_revision,
                "duration": duration_str,
                "type": "revision",
            })
            study_day_count += 1
            continue

        # Normal study day
        day_topics = []
        for _ in range(topics_per_day):
            if topic_idx < len(ordered_topics):
                day_topics.append(ordered_topics[topic_idx])
                topic_idx += 1
            else:
                # Cycle back through topics
                topic_idx = 0
                if ordered_topics:
                    day_topics.append(ordered_topics[topic_idx])
                    topic_idx += 1

        plan_days.append({
            "date": date_str,
            "topics": day_topics,
            "duration": duration_str,
            "type": "study",
        })
        study_day_count += 1

    plan_id = str(uuid.uuid4())
    plan = {
        "id": plan_id,
        "user_id": user_id,
        "exam_name": exam_name,
        "exam_date": exam_date_str,
        "intensity": intensity,
        "plan": plan_days,
    }

    sb.table("revision_plans").insert(plan).execute()
    return plan


def get_active_plan(user_id: str) -> dict | None:
    sb = get_supabase()
    result = (
        sb.table("revision_plans")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    return result.data[0] if result.data else None


def update_plan(plan_id: str, user_id: str, updates: dict) -> dict:
    sb = get_supabase()
    allowed = {"plan", "exam_name", "exam_date", "intensity"}
    clean = {k: v for k, v in updates.items() if k in allowed}
    sb.table("revision_plans").update(clean).eq("id", plan_id).eq("user_id", user_id).execute()
    result = sb.table("revision_plans").select("*").eq("id", plan_id).single().execute()
    return result.data or {}


def delete_plan(plan_id: str, user_id: str) -> None:
    sb = get_supabase()
    sb.table("revision_plans").delete().eq("id", plan_id).eq("user_id", user_id).execute()
