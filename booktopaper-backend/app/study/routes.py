"""
app/study/routes.py — Study endpoints (/api/v1/study/*)
"""
from flask import Blueprint, request, jsonify, g
from app.auth.middleware import require_auth
from app.study.service import (
    get_all_topics, get_topic,
    start_session, update_session,
    get_flashcards, generate_flashcards,
    get_weak_areas, generate_practice_questions,
)

study_bp = Blueprint("study", __name__)


@study_bp.get("/topics")
@require_auth
def list_topics():
    topics = get_all_topics(g.user_id)
    return jsonify(topics), 200


@study_bp.get("/topics/<topic_id>")
@require_auth
def get_topic_route(topic_id: str):
    topic = get_topic(topic_id)
    return jsonify(topic), 200


@study_bp.post("/topics/<topic_id>/session")
@require_auth
def start_session_route(topic_id: str):
    session = start_session(topic_id, g.user_id)
    return jsonify(session), 200


@study_bp.patch("/sessions/<session_id>")
@require_auth
def update_session_route(session_id: str):
    data = request.get_json()
    result = update_session(session_id, g.user_id, data)
    return jsonify(result), 200


@study_bp.get("/topics/<topic_id>/flashcards")
@require_auth
def get_flashcards_route(topic_id: str):
    cards = get_flashcards(topic_id)
    return jsonify(cards), 200


@study_bp.post("/topics/<topic_id>/flashcards/generate")
@require_auth
def generate_flashcards_route(topic_id: str):
    data = request.get_json() or {}
    count = min(data.get("count", 10), 20)  # cap at 20
    cards = generate_flashcards(topic_id, count)
    return jsonify(cards), 201


@study_bp.get("/weak-areas")
@require_auth
def weak_areas_route():
    weak = get_weak_areas(g.user_id)
    return jsonify(weak), 200


@study_bp.post("/weak-areas/<topic_name>/practice")
@require_auth
def practice_route(topic_name: str):
    import urllib.parse
    decoded_topic = urllib.parse.unquote(topic_name)
    questions = generate_practice_questions(decoded_topic)
    return jsonify(questions), 200
