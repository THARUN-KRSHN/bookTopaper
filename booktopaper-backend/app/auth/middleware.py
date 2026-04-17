"""
app/auth/middleware.py — JWT authentication decorator
"""
from functools import wraps
from flask import request, jsonify, g
from app.extensions import get_supabase


def require_auth(f):
    """
    Decorator that validates the Supabase JWT from the Authorization header.
    Sets g.user_id for use in downstream route handlers.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Unauthorised", "code": "UNAUTHORISED", "details": {}}), 401

        token = auth_header.replace("Bearer ", "", 1).strip()
        if not token:
            return jsonify({"error": "Unauthorised", "code": "UNAUTHORISED", "details": {}}), 401

        try:
            sb = get_supabase()
            user_response = sb.auth.get_user(token)
            g.user_id = user_response.user.id
            g.user_email = user_response.user.email
        except Exception as e:
            return jsonify({
                "error": "Invalid or expired token",
                "code": "UNAUTHORISED",
                "details": {},
            }), 401

        return f(*args, **kwargs)
    return decorated
