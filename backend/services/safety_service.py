import re
from typing import Dict, Any, Tuple

CRISIS_PATTERNS = [
    r"\b(suicide|kill\s+(myself|me)|end\s+my\s+life|want\s+to\s+die|hang\s+myself|shoot\s+myself|slit\s+my\s+wrists?)\b",
    r"\b(don['’]?t\s+want\s+to\s+(live|be\s+alive|exist|wake\s+up)\s*(anymore)?)\b",
    r"\b(better\s+off\s+dead|no\s+reason\s+to\s+live|hurt(ing)?\s+myself|self[- ]harm)\b",
    r"\b(take\s+all\s+(my\s+)?pills|overdose)\b",
    r"\b(mar\s+jaana\s+chahta|khud\s+ko\s+khatam|jaan\s+de\s+dunga|zinda\s+nahi\s+rehna)\b"
]

HIGH_RISK_REGEX = re.compile("|".join(CRISIS_PATTERNS), re.IGNORECASE)

CRISIS_RESOURCES = [
    {
        "name": "Tele-MANAS (Govt of India)",
        "contact": "14416 or 1800-891-4416",
        "description": "Free, 24/7 confidential mental health support across India in multiple languages."
    },
    {
        "name": "KIRAN National Mental Health Helpline",
        "contact": "1800-599-0019",
        "description": "Toll-free 24/7 rehabilitation and psychological support by the Ministry of Social Justice."
    },
    {
        "name": "Vandrevala Foundation Helpline",
        "contact": "+91 9999 666 555",
        "description": "Free 24/7 mental wellness counseling via call and WhatsApp."
    },
    {
        "name": "AASRA Helpline",
        "contact": "+91 98204 66726",
        "description": "24/7 confidential crisis prevention and emotional support."
    },
    {
        "name": "International Crisis Services",
        "contact": "988 (USA/Canada) or findahelpline.com",
        "description": "24/7 free, confidential crisis line for support worldwide."
    }
]

class SafetyService:
    @staticmethod
    def evaluate_safety(text: str) -> Tuple[bool, Dict[str, Any]]:
        """
        Evaluates input for acute crisis or self-harm risk.
        Returns (is_crisis, safety_payload).
        Distinguishes between acute safety emergencies and standard emotional sadness.
        """
        if not text:
            return False, {}
            
        clean_text = text.strip()
        
        # Deterministic regex matching for crisis
        if HIGH_RISK_REGEX.search(clean_text):
            return True, {
                "action": "SAFETY_MODE",
                "risk_level": "critical",
                "message": (
                    "I hear how much pain and heaviness you are holding right now. "
                    "Please know that you matter, and you don't have to navigate this alone. "
                    "Because I am an AI companion and cannot provide emergency medical support, "
                    "I urge you to connect right now with someone who cares about you, or reach out to "
                    "these free, confidential support specialists who are ready to listen:"
                ),
                "resources": CRISIS_RESOURCES,
                "suggested_actions": [
                    {"label": "Call Tele-MANAS (14416)", "action": "tel:14416"},
                    {"label": "Reach Out to a Loved One", "action": "prompt_human_contact"},
                    {"label": "Grounding Exercise (5-4-3-2-1)", "action": "grounding"}
                ]
            }
            
        return False, {}

safety_service = SafetyService()
