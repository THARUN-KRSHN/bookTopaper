"""
app/planner/routes.py — Planner endpoints (/api/v1/planner/*)
"""
from flask import Blueprint, request, jsonify, g
from app.auth.middleware import require_auth
from app.planner.service import generate_plan, get_active_plan, update_plan, delete_plan

planner_bp = Blueprint("planner", __name__)


@planner_bp.get("/")
@require_auth
def get_plan_route():
    plan = get_active_plan(g.user_id)
    if not plan:
        return jsonify(None), 200
    return jsonify(plan), 200


@planner_bp.post("/generate")
@require_auth
def generate_plan_route():
    config = request.get_json()
    if not config or not config.get("exam_date"):
        return jsonify({"error": "exam_date is required", "code": "VALIDATION_ERROR", "details": {}}), 422

    plan = generate_plan(config, g.user_id)
    return jsonify(plan), 201


@planner_bp.patch("/<plan_id>")
@require_auth
def update_plan_route(plan_id: str):
    data = request.get_json()
    result = update_plan(plan_id, g.user_id, data)
    return jsonify(result), 200


@planner_bp.delete("/<plan_id>")
@require_auth
def delete_plan_route(plan_id: str):
    delete_plan(plan_id, g.user_id)
    return jsonify({"message": "Plan deleted."}), 200
