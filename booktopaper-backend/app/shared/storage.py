"""
app/shared/storage.py — Supabase Storage helper
"""
import os
import mimetypes
from app.extensions import get_supabase


def _guess_content_type(path: str) -> str:
    """Guess MIME type from file extension; default to octet-stream."""
    mime, _ = mimetypes.guess_type(path)
    return mime or "application/octet-stream"


def upload_to_storage(file_bytes: bytes, path: str, bucket: str) -> str:
    """Upload bytes to Supabase Storage and return the public URL.

    supabase-py v2 requires an explicit content-type in file_options;
    omitting it causes a misleading 400 'RLS policy' rejection from Storage.
    """
    sb = get_supabase()
    content_type = _guess_content_type(path)
    sb.storage.from_(bucket).upload(
        path,
        file_bytes,
        {
            "content-type": content_type,
            "cache-control": "3600",
            "upsert": "true",
        },
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
