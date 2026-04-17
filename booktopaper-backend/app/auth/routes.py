"""
app/auth/routes.py — Auth endpoints (/api/v1/auth/*)
"""
from flask import Blueprint, request, jsonify, g
from app.extensions import get_supabase
from app.auth.middleware import require_auth

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    """Register with email + password. Creates Supabase auth user + profiles row."""
    data = request.get_json()
    email = data.get("email", "").strip()
    password = data.get("password", "")
    full_name = data.get("full_name", "").strip()

    if not email or not password:
        return jsonify({"error": "email and password are required", "code": "VALIDATION_ERROR", "details": {}}), 422

    sb = get_supabase()
    try:
        result = sb.auth.sign_up({"email": email, "password": password})
    except Exception as e:
        return jsonify({"error": str(e), "code": "REGISTER_FAILED", "details": {}}), 400

    user = result.user
    if not user:
        return jsonify({"error": "Registration failed", "code": "REGISTER_FAILED", "details": {}}), 400

    # Create profile row
    sb.table("profiles").insert({
        "id": user.id,
        "full_name": full_name or email.split("@")[0],
    }).execute()

    return jsonify({
        "message": "Registration successful. Please verify your email.",
        "user_id": user.id,
        "email": user.email,
    }), 201


@auth_bp.post("/login")
def login():
    """Login with email + password. Returns JWT + user profile."""
    data = request.get_json()
    email = data.get("email", "").strip()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "email and password are required", "code": "VALIDATION_ERROR", "details": {}}), 422

    sb = get_supabase()
    try:
        result = sb.auth.sign_in_with_password({"email": email, "password": password})
    except Exception as e:
        return jsonify({"error": "Invalid credentials", "code": "INVALID_CREDENTIALS", "details": {}}), 401

    user = result.user
    session = result.session

    # Fetch profile
    profile_res = sb.table("profiles").select("*").eq("id", user.id).single().execute()
    profile = profile_res.data if profile_res.data else {}

    return jsonify({
        "access_token": session.access_token,
        "refresh_token": session.refresh_token,
        "expires_in": session.expires_in,
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": profile.get("full_name"),
            "avatar_url": profile.get("avatar_url"),
            "default_format": profile.get("default_format", "ktu"),
        },
    }), 200


@auth_bp.post("/logout")
@require_auth
def logout():
    """Invalidate the current session."""
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "", 1).strip()
    sb = get_supabase()
    try:
        sb.auth.sign_out()
    except Exception:
        pass
    return jsonify({"message": "Logged out successfully."}), 200


@auth_bp.get("/me")
@require_auth
def get_me():
    """Return current user profile."""
    sb = get_supabase()
    profile_res = sb.table("profiles").select("*").eq("id", g.user_id).single().execute()
    profile = profile_res.data or {}
    return jsonify({
        "id": g.user_id,
        "email": g.user_email,
        **profile,
    }), 200


@auth_bp.patch("/me")
@require_auth
def update_me():
    """Update profile (name, avatar_url, preferences)."""
    data = request.get_json()
    allowed_fields = {"full_name", "avatar_url", "default_format", "default_marks"}
    updates = {k: v for k, v in data.items() if k in allowed_fields}

    if not updates:
        return jsonify({"error": "No valid fields to update", "code": "VALIDATION_ERROR", "details": {}}), 422

    sb = get_supabase()
    result = sb.table("profiles").update(updates).eq("id", g.user_id).execute()
    return jsonify(result.data[0] if result.data else {}), 200


@auth_bp.post("/refresh")
def refresh_token():
    """Refresh JWT using the refresh token."""
    data = request.get_json()
    refresh_token = data.get("refresh_token", "")
    if not refresh_token:
        return jsonify({"error": "refresh_token is required", "code": "VALIDATION_ERROR", "details": {}}), 422

    sb = get_supabase()
    try:
        result = sb.auth.refresh_session(refresh_token)
    except Exception as e:
        return jsonify({"error": "Token refresh failed", "code": "REFRESH_FAILED", "details": {}}), 401

    session = result.session
    return jsonify({
        "access_token": session.access_token,
        "refresh_token": session.refresh_token,
        "expires_in": session.expires_in,
    }), 200
