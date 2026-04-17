"""
app/__init__.py — Flask Application Factory
"""
import os
from flask import Flask
from flask_cors import CORS

from .config import Config


def create_app(config_class=Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    # ── CORS ────────────────────────────────────────────────────────────────
    CORS(
        app,
        origins=app.config["ALLOWED_ORIGINS"],
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    )

    # ── Error Handlers ───────────────────────────────────────────────────────
    from .shared.errors import register_error_handlers
    register_error_handlers(app)

    # ── Blueprints ───────────────────────────────────────────────────────────
    from .auth.routes import auth_bp
    from .materials.routes import materials_bp
    from .papers.routes import papers_bp
    from .exams.routes import exams_bp
    from .evaluations.routes import evaluations_bp
    from .study.routes import study_bp
    from .planner.routes import planner_bp

    API_PREFIX = "/api/v1"
    app.register_blueprint(auth_bp,        url_prefix=f"{API_PREFIX}/auth")
    app.register_blueprint(materials_bp,   url_prefix=f"{API_PREFIX}/materials")
    app.register_blueprint(papers_bp,      url_prefix=f"{API_PREFIX}/papers")
    app.register_blueprint(exams_bp,       url_prefix=f"{API_PREFIX}/exams")
    app.register_blueprint(evaluations_bp, url_prefix=f"{API_PREFIX}/evaluations")
    app.register_blueprint(study_bp,       url_prefix=f"{API_PREFIX}/study")
    app.register_blueprint(planner_bp,     url_prefix=f"{API_PREFIX}/planner")

    # ── Health check ─────────────────────────────────────────────────────────
    @app.get("/health")
    def health():
        return {"status": "ok", "service": "booktopaper-api", "version": "1.0.0"}

    return app
