"""
app/exams/routes.py — Exam endpoints (/api/v1/exams/*)
"""
from flask import Blueprint, request, jsonify, g
from app.auth.middleware import require_auth
from app.exams.service import (
    create_exam, get_exam, save_answer, submit_exam, list_exams,
)

exams_bp = Blueprint("exams", __name__)


@exams_bp.post("/")
@require_auth
def create_exam_route():
    data = request.get_json()
    paper_id = data.get("paper_id")
    if not paper_id:
        return jsonify({"error": "paper_id is required", "code": "VALIDATION_ERROR", "details": {}}), 422

    practice_mode = data.get("practice_mode", False)
    exam = create_exam(paper_id, g.user_id, practice_mode)
    return jsonify(exam), 201


@exams_bp.get("/")
@require_auth
def list_exams_route():
    exams = list_exams(g.user_id)
    return jsonify(exams), 200


@exams_bp.get("/<exam_id>")
@require_auth
def get_exam_route(exam_id: str):
    exam = get_exam(exam_id, g.user_id)
    return jsonify(exam), 200


@exams_bp.patch("/<exam_id>/answer")
@require_auth
def save_answer_route(exam_id: str):
    data = request.get_json()
    question_id = data.get("question_id")
    answer_text = data.get("answer_text", "")

    if not question_id:
        return jsonify({"error": "question_id is required", "code": "VALIDATION_ERROR", "details": {}}), 422

    result = save_answer(exam_id, g.user_id, question_id, answer_text)
    return jsonify(result), 200


@exams_bp.post("/<exam_id>/submit")
@require_auth
def submit_exam_route(exam_id: str):
    result = submit_exam(exam_id, g.user_id)
    return jsonify(result), 200
