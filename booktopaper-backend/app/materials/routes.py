"""
app/materials/routes.py — Materials endpoints (/api/v1/materials/*)
"""
import os
from flask import Blueprint, request, jsonify, g
from app.auth.middleware import require_auth
from app.shared.errors import AppError, invalid_file_type, file_too_large
from app.materials.service import (
    create_material_record,
    upload_material_file,
    process_material,
    get_material_with_topics,
    delete_material,
    list_materials,
    extract_topics_ai,
)
from app.extensions import get_supabase

materials_bp = Blueprint("materials", __name__)

ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg"}
MAX_SIZE = int(os.getenv("MAX_UPLOAD_SIZE_MB", "50")) * 1024 * 1024


def _allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@materials_bp.get("/")
@require_auth
def list_materials_route():
    materials = list_materials(g.user_id)
    return jsonify(materials), 200


@materials_bp.post("/upload")
@require_auth
def upload_material():
    if "file" not in request.files:
        return jsonify({"error": "No file provided", "code": "MISSING_FILE", "details": {}}), 422

    file = request.files["file"]
    filename = file.filename or "upload"

    if not _allowed_file(filename):
        raise invalid_file_type()

    file_bytes = file.read()
    if len(file_bytes) > MAX_SIZE:
        raise file_too_large(MAX_SIZE // (1024 * 1024))

    ext = filename.rsplit(".", 1)[1].lower()

    # Create DB record (gets storage_path)
    material = create_material_record(g.user_id, filename, ext)

    # Upload to Supabase Storage
    upload_material_file(file_bytes, material["storage_path"])

    # Process synchronously (Phase 1) — OCR + topic extraction
    try:
        process_material(material["id"])
    except Exception as e:
        # Non-fatal: record is already created; client can reprocess
        import traceback
        from flask import current_app
        current_app.logger.error(
            f"[process_material] Failed for material {material['id']}: {e}\n"
            + traceback.format_exc()
        )

    # Re-fetch with updated status
    sb = get_supabase()
    updated = sb.table("materials").select("*").eq("id", material["id"]).single().execute()
    return jsonify(updated.data), 201


@materials_bp.get("/<material_id>")
@require_auth
def get_material(material_id: str):
    material = get_material_with_topics(material_id, g.user_id)
    return jsonify(material), 200


@materials_bp.delete("/<material_id>")
@require_auth
def delete_material_route(material_id: str):
    delete_material(material_id, g.user_id)
    return jsonify({"message": "Material deleted."}), 200


@materials_bp.get("/<material_id>/topics")
@require_auth
def get_topics(material_id: str):
    sb = get_supabase()
    # Verify ownership
    mat_res = sb.table("materials").select("id").eq("id", material_id).eq("user_id", g.user_id).single().execute()
    if not mat_res.data:
        raise AppError("Material not found", "MATERIAL_NOT_FOUND", 404)

    topics_res = sb.table("topics").select("*").eq("material_id", material_id).execute()
    return jsonify(topics_res.data or []), 200


@materials_bp.post("/<material_id>/reprocess")
@require_auth
def reprocess_material(material_id: str):
    """Re-run OCR + topic extraction for an existing material."""
    sb = get_supabase()
    mat_res = sb.table("materials").select("*").eq("id", material_id).eq("user_id", g.user_id).single().execute()
    if not mat_res.data:
        raise AppError("Material not found", "MATERIAL_NOT_FOUND", 404)

    # Delete old topics
    sb.table("topics").delete().eq("material_id", material_id).execute()

    # Re-process
    process_material(material_id)

    updated = sb.table("materials").select("*").eq("id", material_id).single().execute()
    return jsonify(updated.data), 200
