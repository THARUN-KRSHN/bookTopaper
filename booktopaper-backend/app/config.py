"""
app/config.py — Environment configuration
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # Flask
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "1") == "1"
    ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

    # Supabase
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
    SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    # OpenRouter
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
    OPENROUTER_MODEL_DEFAULT = os.getenv("OPENROUTER_MODEL_DEFAULT", "anthropic/claude-3.5-sonnet")
    OPENROUTER_MODEL_VISION = os.getenv("OPENROUTER_MODEL_VISION", "openai/gpt-4o")

    # Storage
    SUPABASE_BUCKET_MATERIALS = os.getenv("SUPABASE_BUCKET_MATERIALS", "materials")
    SUPABASE_BUCKET_PAPERS = os.getenv("SUPABASE_BUCKET_PAPERS", "papers")
    MAX_UPLOAD_SIZE_BYTES = int(os.getenv("MAX_UPLOAD_SIZE_MB", "50")) * 1024 * 1024

    # File upload
    ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg"}
