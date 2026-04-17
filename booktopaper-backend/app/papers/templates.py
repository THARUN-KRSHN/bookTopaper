"""
app/papers/templates.py — Exam format templates (KTU, CBSE, Custom)
"""
from dataclasses import dataclass, field
from typing import List


@dataclass
class SectionTemplate:
    name: str
    instruction: str
    style: str  # "short_answer" | "long_answer" | "mcq" | "either_or"
    default_mark_per_q: int
    default_count: int


@dataclass
class ExamTemplate:
    name: str
    format_code: str
    general_instructions: str
    sections: List[SectionTemplate]


KTU_TEMPLATE = ExamTemplate(
    name="KTU University Exam",
    format_code="ktu",
    general_instructions=(
        "Answer all questions in Part A. "
        "Answer one question from each module in Part B. "
        "Answer one question from each module in Part C."
    ),
    sections=[
        SectionTemplate(
            name="Part A",
            instruction="Answer all questions. Each question carries 2 marks.",
            style="short_answer",
            default_mark_per_q=2,
            default_count=10,
        ),
        SectionTemplate(
            name="Part B",
            instruction="Answer any two questions from each module. Each question carries 5 marks.",
            style="either_or",
            default_mark_per_q=5,
            default_count=6,
        ),
        SectionTemplate(
            name="Part C",
            instruction="Answer one question from each module. Each question carries 10 marks.",
            style="long_answer",
            default_mark_per_q=10,
            default_count=3,
        ),
    ],
)

CBSE_TEMPLATE = ExamTemplate(
    name="CBSE Board Exam",
    format_code="cbse",
    general_instructions=(
        "All questions are compulsory. "
        "Section A contains MCQs. "
        "Section B contains short answer questions. "
        "Section C contains long answer questions."
    ),
    sections=[
        SectionTemplate(
            name="Section A",
            instruction="Choose the correct answer. Each question carries 1 mark.",
            style="mcq",
            default_mark_per_q=1,
            default_count=20,
        ),
        SectionTemplate(
            name="Section B",
            instruction="Answer the following. Each question carries 3 marks.",
            style="short_answer",
            default_mark_per_q=3,
            default_count=6,
        ),
        SectionTemplate(
            name="Section C",
            instruction="Answer the following in detail. Each question carries 5 marks.",
            style="long_answer",
            default_mark_per_q=5,
            default_count=4,
        ),
    ],
)

CUSTOM_TEMPLATE = ExamTemplate(
    name="Custom Exam",
    format_code="custom",
    general_instructions="Answer all questions as per the instructions for each section.",
    sections=[],  # populated from request body
)

TEMPLATES = {
    "ktu": KTU_TEMPLATE,
    "cbse": CBSE_TEMPLATE,
    "custom": CUSTOM_TEMPLATE,
}


def get_template(format_code: str) -> ExamTemplate:
    return TEMPLATES.get(format_code.lower(), CUSTOM_TEMPLATE)


def get_style_prompt(style: str) -> str:
    """Return a style description for the question generation prompt."""
    return {
        "short_answer": "concise 2-4 sentence answers, direct factual questions",
        "long_answer": "detailed explanatory questions requiring paragraph answers with examples",
        "either_or": "descriptive questions that can be answered in a structured essay format",
        "mcq": "multiple choice questions with 4 options (A/B/C/D), clearly indicate the correct answer in the JSON",
    }.get(style, "standard exam questions")
