"""
app/shared/storage.py — Supabase Storage helper
"""
import os
from app.extensions import get_supabase


def upload_to_storage(file_bytes: bytes, path: str, bucket: str) -> str:
    """Upload bytes to Supabase Storage and return the public URL."""
    sb = get_supabase()
    sb.storage.from_(bucket).upload(
        path,
        file_bytes,
        {"upsert": "true"},
    )
    result = sb.storage.from_(bucket).get_public_url(path)
    return result


def delete_from_storage(path: str, bucket: str) -> None:
    """Remove a file from Supabase Storage."""
    sb = get_supabase()
    sb.storage.from_(bucket).remove([path])


def get_download_url(path: str, bucket: str) -> str:
    """Return the public URL for a stored file."""
    sb = get_supabase()
    return sb.storage.from_(bucket).get_public_url(path)


def download_from_storage(path: str, bucket: str) -> bytes:
    """Download a file from Supabase Storage and return raw bytes."""
    sb = get_supabase()
    response = sb.storage.from_(bucket).download(path)
    return response
