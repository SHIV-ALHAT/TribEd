"""
JAGO Multilingual Tribal Scholarship Assistant (FastAPI Backend)
"""

from typing import Dict, Any

def process_jago_query(user_query: str, lang: str, active_app: Any = None) -> Dict[str, Any]:
    text_lower = user_query.lower()

    if any(k in text_lower for k in ["status", "स्थिति", "प्रगती", "track"]):
        if active_app:
            return {
                "message": f"Your application {active_app.id} is currently in {active_app.current_status} status. {active_app.status_reason}",
                "intent": "APPLICATION_STATUS",
                "action_suggestions": ["View Timeline", "Check Verification Checks"],
                "factual_context": f"Status: {active_app.current_status}"
            }

    if any(k in text_lower for k in ["bonafide", "deficiency", "issue", "बोनाफाइड", "त्रुटी"]):
        return {
            "message": "Your application was flagged because the uploaded Bonafide Certificate is from AY 2024-25. Please upload the certified AY 2026-27 Bonafide to proceed.",
            "intent": "DEFICIENCY_HELP",
            "action_suggestions": ["Upload AY 2026-27 Bonafide", "Ask Reviewer"],
            "factual_context": "Deficiency: Bonafide renewal needed"
        }

    if any(k in text_lower for k in ["payment", "dbt", "paisa", "रुपये", "पैसे", "bank"]):
        return {
            "message": "The Post-Matric Scholarship provides ₹48,000 direct bank transfer via Aadhaar Payment Bridge System (APBS) once verified and sanctioned.",
            "intent": "PAYMENT_STATUS",
            "action_suggestions": ["View DBT State Machine", "Bank Seeding Status"],
            "factual_context": "Sanction Amount: ₹48,000"
        }

    return {
        "message": "Hello! I am JAGO, your scholarship guide for the Ministry of Tribal Affairs. Ask me about your application status, bonafide deficiency, or DBT payment.",
        "intent": "GREETING",
        "action_suggestions": ["What is my application status?", "Why is my bonafide flagged?", "When will DBT arrive?"]
    }
