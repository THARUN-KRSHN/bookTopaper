"""
app/extensions.py — Supabase client singleton
"""
import os
import httpx
from supabase import create_client, Client, ClientOptions

_supabase: Client | None = None


def get_supabase() -> Client:
    """Return a lazily-initialised Supabase Service Role client."""
    global _supabase
    if _supabase is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not url or not key:
            raise RuntimeError(
                "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment."
            )
        options = ClientOptions(
            storage_client_timeout=httpx.Timeout(120.0, connect=20.0, read=120.0, write=120.0),
            postgrest_client_timeout=60,
        )
        _supabase = create_client(url, key, options=options)
    return _supabase
