"""
app/evaluations/routes.py — Evaluation endpoints (/api/v1/evaluations/*)
"""
from flask import Blueprint, request, jsonify, g
from app.auth.middleware import require_auth
from app.evaluations.service import evaluate_exam, get_evaluation, list_evaluations

evaluations_bp = Blueprint("evaluations", __name__)


@evaluations_bp.get("/")
@require_auth
def list_evaluations_route():
    evaluations = list_evaluations(g.user_id)
    return jsonify(evaluations), 200


@evaluations_bp.get("/<eval_id>")
@require_auth
def get_evaluation_route(eval_id: str):
    evaluation = get_evaluation(eval_id, g.user_id)
    return jsonify(evaluation), 200


@evaluations_bp.post("/")
@require_auth
def create_evaluation_route():
    """Trigger evaluation for a submitted exam."""
    data = request.get_json()
    exam_id = data.get("exam_id")
    if not exam_id:
        return jsonify({"error": "exam_id is required", "code": "VALIDATION_ERROR", "details": {}}), 422

    evaluation = evaluate_exam(exam_id, g.user_id)
    return jsonify(evaluation), 201
