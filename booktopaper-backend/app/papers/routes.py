"""
app/papers/routes.py — Paper endpoints (/api/v1/papers/*)
"""
import os
from flask import Blueprint, request, jsonify, g, send_file
import io
from app.auth.middleware import require_auth
from app.papers.service import (
    generate_paper, list_papers, get_paper, delete_paper,
    update_question,
)
from app.papers.pdf_export import generate_pdf
from app.shared.storage import download_from_storage

BUCKET = os.getenv("SUPABASE_BUCKET_PAPERS", "papers")
papers_bp = Blueprint("papers", __name__)


@papers_bp.get("/")
@require_auth
def list_papers_route():
    papers = list_papers(g.user_id)
    return jsonify(papers), 200


@papers_bp.post("/generate")
@require_auth
def generate_paper_route():
    config = request.get_json()
    if not config or not config.get("material_ids"):
        return jsonify({"error": "material_ids is required", "code": "VALIDATION_ERROR", "details": {}}), 422

    paper = generate_paper(config, g.user_id)
    return jsonify(paper), 201


@papers_bp.get("/<paper_id>")
@require_auth
def get_paper_route(paper_id: str):
    paper = get_paper(paper_id, g.user_id)
    return jsonify(paper), 200


@papers_bp.delete("/<paper_id>")
@require_auth
def delete_paper_route(paper_id: str):
    delete_paper(paper_id, g.user_id)
    return jsonify({"message": "Paper deleted."}), 200


@papers_bp.get("/<paper_id>/download")
@require_auth
def download_paper(paper_id: str):
    """Return the PDF file for a paper."""
    paper = get_paper(paper_id, g.user_id)
    pdf_path = paper.get("pdf_path")

    if pdf_path:
        try:
            pdf_bytes = download_from_storage(pdf_path, BUCKET)
        except Exception:
            pdf_bytes = None
    else:
        pdf_bytes = None

    # Re-generate PDF on the fly if not stored
    if not pdf_bytes:
        pdf_bytes = generate_pdf(paper)

    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        as_attachment=True,
        download_name=f"{paper.get('title', 'paper')}.pdf",
    )


@papers_bp.patch("/<paper_id>/questions/<question_id>")
@require_auth
def edit_question(paper_id: str, question_id: str):
    data = request.get_json()
    allowed = {"text", "question", "marks"}
    updates = {k: v for k, v in data.items() if k in allowed}
    result = update_question(paper_id, question_id, g.user_id, updates)
    return jsonify(result), 200


@papers_bp.post("/<paper_id>/regenerate")
@require_auth
def regenerate_paper(paper_id: str):
    """Regenerate questions for an existing paper using its original config."""
    paper = get_paper(paper_id, g.user_id)
    config = {
        "material_ids": paper.get("material_ids", []),
        "format": paper.get("format", "ktu"),
        "title": paper.get("title", "Question Paper"),
        "total_marks": paper.get("total_marks", 100),
        "duration_mins": paper.get("duration_mins", 180),
        "difficulty": paper.get("difficulty", {"easy": 30, "medium": 50, "hard": 20}),
    }
    new_paper = generate_paper(config, g.user_id)
    return jsonify(new_paper), 201
