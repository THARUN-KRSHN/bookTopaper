"""
app/materials/service.py — Material processing logic
"""
import uuid
import os
from app.extensions import get_supabase
from app.shared.ai_client import chat_completion, parse_json_response
from app.shared.storage import upload_to_storage, delete_from_storage, download_from_storage
from app.shared.errors import AppError, ai_failed
from app.materials.ocr import extract_text_from_pdf, extract_text_from_image

BUCKET = os.getenv("SUPABASE_BUCKET_MATERIALS", "materials")


def create_material_record(user_id: str, filename: str, file_type: str) -> dict:
    """Insert a new materials row and return it."""
    sb = get_supabase()
    material_id = str(uuid.uuid4())
    storage_path = f"{user_id}/{material_id}/{filename}"

    result = sb.table("materials").insert({
        "id": material_id,
        "user_id": user_id,
        "filename": filename,
        "storage_path": storage_path,
        "file_type": file_type,
        "status": "uploaded",
    }).execute()

    return result.data[0]


def upload_material_file(file_bytes: bytes, storage_path: str) -> str:
    """Upload file to Supabase Storage. Returns public URL."""
    return upload_to_storage(file_bytes, storage_path, BUCKET)


def process_material(material_id: str) -> None:
    """
    Full processing pipeline:
    1. Download file from storage
    2. Run OCR appropriate to file type
    3. Extract topics via AI
    4. Insert topics into DB
    5. Mark material as 'ready'
    """
    sb = get_supabase()

    # 1. Fetch material record
    mat_res = sb.table("materials").select("*").eq("id", material_id).single().execute()
    material = mat_res.data
    if not material:
        raise AppError("Material not found", "NOT_FOUND", 404)

    # Update status to processing
    sb.table("materials").update({"status": "processing"}).eq("id", material_id).execute()

    try:
        # 2. Download file
        file_bytes = download_from_storage(material["storage_path"], BUCKET)

        # 3. OCR
        file_type = material["file_type"].lower()
        if file_type in ("pdf",):
            raw_text = extract_text_from_pdf(file_bytes)
        else:
            mime_map = {"png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg"}
            mime = mime_map.get(file_type, "image/jpeg")
            raw_text = extract_text_from_image(file_bytes, mime)

        # 4. Extract topics
        topics = extract_topics_ai(raw_text)

        # 5. Insert topics
        if topics:
            topic_rows = [
                {
                    "material_id": material_id,
                    "name": t.get("name", "Unknown Topic"),
                    "subtopics": t.get("subtopics", []),
                    "difficulty": t.get("difficulty", "medium"),
                    "content": t.get("summary", ""),
                }
                for t in topics
            ]
            sb.table("topics").insert(topic_rows).execute()

        # 6. Mark as ready
        sb.table("materials").update({
            "status": "ready",
            "raw_text": raw_text[:50000],  # cap stored text at 50k chars
            "topic_count": len(topics),
        }).eq("id", material_id).execute()

    except Exception as e:
        sb.table("materials").update({
            "status": "error",
        }).eq("id", material_id).execute()
        raise AppError(f"Processing failed: {e}", "PROCESSING_FAILED", 502)


def extract_topics_ai(text: str) -> list:
    """Call OpenRouter to extract topics from educational text."""
    # Truncate if too long (context limits)
    truncated = text[:30000] if len(text) > 30000 else text

    prompt = f"""You are an educational AI. Given the following study text, extract a structured list of topics and subtopics.

For each topic, provide:
- name: short topic name
- subtopics: list of 3-6 subtopic strings
- difficulty: one of "easy", "medium", "hard"
- summary: 1-2 sentence summary of the topic

Return a valid JSON array only, no other text.
Format: [{{"name": "...", "subtopics": ["...", "..."], "difficulty": "medium", "summary": "..."}}]

TEXT:
{truncated}"""

    messages = [{"role": "user", "content": prompt}]
    try:
        raw = chat_completion(messages, max_tokens=3000)
        return parse_json_response(raw)
    except Exception as e:
        raise ai_failed(str(e))


def get_material_with_topics(material_id: str, user_id: str) -> dict:
    """Fetch a material and its topics."""
    sb = get_supabase()
    mat_res = sb.table("materials").select("*").eq("id", material_id).eq("user_id", user_id).single().execute()
    if not mat_res.data:
        raise AppError("Material not found", "MATERIAL_NOT_FOUND", 404)

    material = mat_res.data
    topics_res = sb.table("topics").select("*").eq("material_id", material_id).execute()
    material["topics"] = topics_res.data or []
    return material


def delete_material(material_id: str, user_id: str) -> None:
    """Delete a material record and its storage file."""
    sb = get_supabase()
    mat_res = sb.table("materials").select("*").eq("id", material_id).eq("user_id", user_id).single().execute()
    if not mat_res.data:
        raise AppError("Material not found", "MATERIAL_NOT_FOUND", 404)

    storage_path = mat_res.data["storage_path"]
    sb.table("materials").delete().eq("id", material_id).execute()

    try:
        delete_from_storage(storage_path, BUCKET)
    except Exception:
        pass  # File might not exist; silently ignore


def list_materials(user_id: str) -> list:
    """List all materials for a user."""
    sb = get_supabase()
    result = sb.table("materials").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return result.data or []
