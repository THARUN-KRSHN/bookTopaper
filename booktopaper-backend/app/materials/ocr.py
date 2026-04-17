"""
app/materials/ocr.py — Text extraction from PDFs and images
"""
import base64
import io
from app.shared.ai_client import vision_completion


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text from a PDF using PyMuPDF (fitz).
    Falls back gracefully if the PDF is image-only (scanned).
    """
    try:
        import fitz  # PyMuPDF

        doc = fitz.open(stream=file_bytes, filetype="pdf")
        pages_text = []
        for page_num, page in enumerate(doc):
            text = page.get_text("text")
            if text.strip():
                pages_text.append(text)

        doc.close()
        raw_text = "\n\n".join(pages_text)

        # If very little text was extracted, it's likely a scanned/image PDF
        if len(raw_text.strip()) < 200:
            return _ocr_pdf_as_images(file_bytes)

        return _clean_text(raw_text)

    except ImportError:
        raise RuntimeError("PyMuPDF (fitz) is not installed. Run: pip install PyMuPDF")


def extract_text_from_image(file_bytes: bytes, mime: str = "image/jpeg") -> str:
    """
    Send an image to the OpenRouter vision model for OCR.
    Returns cleaned extracted text.
    """
    image_b64 = base64.b64encode(file_bytes).decode("utf-8")
    prompt = (
        "Extract all text from this educational image or handwritten notes. "
        "Preserve the structure as much as possible. "
        "Return only the extracted text, no commentary."
    )
    raw = vision_completion(prompt, image_b64, mime)
    return _clean_text(raw)


def _ocr_pdf_as_images(file_bytes: bytes) -> str:
    """
    Convert each PDF page to an image and OCR via vision model.
    Used as fallback for scanned / handwritten PDFs.
    """
    try:
        import fitz

        doc = fitz.open(stream=file_bytes, filetype="pdf")
        all_text = []

        for page_num in range(min(len(doc), 20)):  # cap at 20 pages for cost
            page = doc[page_num]
            # Render at 2x scale for better OCR quality
            mat = fitz.Matrix(2.0, 2.0)
            pix = page.get_pixmap(matrix=mat)
            img_bytes = pix.tobytes("jpeg")
            img_b64 = base64.b64encode(img_bytes).decode("utf-8")

            prompt = (
                f"This is page {page_num + 1} of educational study notes. "
                "Extract all visible text, including handwritten content, diagrams labels, "
                "and printed text. Preserve formatting as much as possible."
            )
            page_text = vision_completion(prompt, img_b64, "image/jpeg")
            all_text.append(page_text)

        doc.close()
        return _clean_text("\n\n".join(all_text))

    except Exception as e:
        raise RuntimeError(f"Image-based OCR failed: {e}")


def _clean_text(text: str) -> str:
    """Remove excessive whitespace and common PDF header/footer artifacts."""
    import re

    # Normalise whitespace
    text = re.sub(r"\r\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)

    # Remove common page-number patterns
    text = re.sub(r"^\s*\d+\s*$", "", text, flags=re.MULTILINE)

    return text.strip()
