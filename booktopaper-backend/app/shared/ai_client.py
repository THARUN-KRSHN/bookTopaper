"""
app/shared/ai_client.py — OpenRouter API wrapper
"""
import os
import json
import httpx

OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
OPENROUTER_API_KEY  = os.getenv("OPENROUTER_API_KEY", "")
DEFAULT_MODEL       = os.getenv("OPENROUTER_MODEL_DEFAULT", "anthropic/claude-3.5-sonnet")
VISION_MODEL        = os.getenv("OPENROUTER_MODEL_VISION", "openai/gpt-4o")

_HEADERS = {
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    "HTTP-Referer": "https://booktopaper.app",
    "X-Title": "BookToPaper",
    "Content-Type": "application/json",
}


def chat_completion(
    messages: list,
    model: str = DEFAULT_MODEL,
    max_tokens: int = 4000,
    expect_json: bool = False,
) -> str:
    """Call OpenRouter chat completions endpoint. Returns the text content."""
    payload: dict = {
        "model": model,
        "messages": messages,
        "max_tokens": max_tokens,
    }
    if expect_json:
        payload["response_format"] = {"type": "json_object"}

    with httpx.Client(timeout=90.0) as client:
        response = client.post(
            f"{OPENROUTER_BASE_URL}/chat/completions",
            headers=_HEADERS,
            json=payload,
        )
        response.raise_for_status()

    return response.json()["choices"][0]["message"]["content"]


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
    return chat_completion(messages, model=VISION_MODEL, max_tokens=4000)


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
