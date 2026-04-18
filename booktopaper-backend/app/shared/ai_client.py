"""
app/shared/ai_client.py — OpenRouter API wrapper
"""
import os
import json
import httpx


def _base_url() -> str:
    return os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")


def _default_model() -> str:
    return os.getenv("OPENROUTER_MODEL_DEFAULT", "anthropic/claude-3.5-sonnet")


def _vision_model() -> str:
    return os.getenv("OPENROUTER_MODEL_VISION", "openai/gpt-4o")


def _get_headers() -> dict:
    """Build headers lazily so OPENROUTER_API_KEY is read after dotenv loads."""
    key = os.getenv("OPENROUTER_API_KEY", "")
    if not key:
        raise RuntimeError(
            "OPENROUTER_API_KEY is not set. "
            "Add it to your .env file and restart the server."
        )
    return {
        "Authorization": f"Bearer {key}",
        "HTTP-Referer": "https://booktopaper.app",
        "X-Title": "BookToPaper",
        "Content-Type": "application/json",
    }


def chat_completion(
    messages: list,
    model: str | None = None,
    max_tokens: int = 4000,
    expect_json: bool = False,
) -> str:
    """Call OpenRouter chat completions endpoint. Returns the text content."""
    resolved_model = model or _default_model()
    payload: dict = {
        "model": resolved_model,
        "messages": messages,
        "max_tokens": max_tokens,
    }
    if expect_json:
        payload["response_format"] = {"type": "json_object"}

    with httpx.Client(timeout=90.0) as client:
        response = client.post(
            f"{_base_url()}/chat/completions",
            headers=_get_headers(),
            json=payload,
        )

    # Attach the response body to any error so we can see exactly what
    # OpenRouter returned (auth errors, quota issues, bad model names, etc.)
    if response.status_code >= 400:
        try:
            body = response.json()
        except Exception:
            body = response.text
        raise httpx.HTTPStatusError(
            f"OpenRouter {response.status_code}: {body}",
            request=response.request,
            response=response,
        )

    data = response.json()
    return data["choices"][0]["message"]["content"]


def vision_completion(
    prompt: str,
    image_base64: str,
    mime: str = "image/jpeg",
) -> str:
    """Send an image to the vision model for OCR / analysis."""
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:{mime};base64,{image_base64}"
                    },
                },
            ],
        }
    ]
    return chat_completion(messages, model=_vision_model(), max_tokens=4000)


def parse_json_response(raw: str) -> dict | list:
    """
    Safely parse JSON from an LLM response.
    Handles code-fenced responses like ```json ... ```.
    """
    text = raw.strip()
    if text.startswith("```"):
        # Strip markdown fences
        lines = text.split("\n")
        # Remove first and last fence lines
        text = "\n".join(lines[1:-1] if lines[-1].strip() == "```" else lines[1:])
    return json.loads(text)
