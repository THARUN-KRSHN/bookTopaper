"""
app/shared/errors.py — Centralised error handling
"""
from flask import Flask, jsonify


class AppError(Exception):
    """Application-level exception with machine-readable code."""

    def __init__(
        self,
        message: str,
        code: str = "INTERNAL_ERROR",
        status_code: int = 400,
        details: dict | None = None,
    ):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or {}

    def to_response(self):
        return jsonify({
            "error": self.message,
            "code": self.code,
            "details": self.details,
        }), self.status_code


# ── Convenience constructors ─────────────────────────────────────────────────

def not_found(resource: str = "Resource"):
    return AppError(f"{resource} not found", "NOT_FOUND", 404)

def unauthorised(msg: str = "Unauthorised"):
    return AppError(msg, "UNAUTHORISED", 401)

def invalid_file_type():
    return AppError(
        "Invalid file type. Allowed: pdf, png, jpg, jpeg.",
        "INVALID_FILE_TYPE", 422,
    )

def file_too_large(max_mb: int = 50):
    return AppError(
        f"File exceeds maximum size of {max_mb} MB.",
        "FILE_TOO_LARGE", 422,
    )

def ai_failed(detail: str = ""):
    return AppError(
        "AI generation failed. Please try again.",
        "AI_GENERATION_FAILED", 502,
        {"detail": detail},
    )

def exam_already_submitted():
    return AppError(
        "This exam has already been submitted.",
        "EXAM_ALREADY_SUBMITTED", 409,
    )


# ── Flask error handler registration ─────────────────────────────────────────

def register_error_handlers(app: Flask):
    @app.errorhandler(AppError)
    def handle_app_error(e: AppError):
        return e.to_response()

    @app.errorhandler(404)
    def handle_404(e):
        return jsonify({"error": "Not found", "code": "NOT_FOUND", "details": {}}), 404

    @app.errorhandler(405)
    def handle_405(e):
        return jsonify({"error": "Method not allowed", "code": "METHOD_NOT_ALLOWED", "details": {}}), 405

    @app.errorhandler(500)
    def handle_500(e):
        return jsonify({"error": "Internal server error", "code": "INTERNAL", "details": {}}), 500
