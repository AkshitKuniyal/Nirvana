import pytest
from backend.services.safety_service import safety_service

def test_crisis_triggers_safety():
    crisis_messages = [
        "I want to die, I can't do this anymore",
        "Thinking about suicide tonight",
        "I feel like hurting myself",
        "I don't want to live anymore",
        "Main khud ko khatam kar dunga"
    ]
    for msg in crisis_messages:
        is_crisis, payload = safety_service.evaluate_safety(msg)
        assert is_crisis is True, f"Failed to trigger crisis for: {msg}"
        assert payload["action"] == "SAFETY_MODE"
        assert len(payload["resources"]) > 0
        assert "Tele-MANAS" in str(payload["resources"])

def test_ordinary_sadness_does_not_trigger_crisis():
    sad_messages = [
        "I'm feeling really sad today.",
        "Work was so exhausting and draining.",
        "I feel a bit overwhelmed by exams.",
        "Aaj mood bohot down hai mera.",
        "I'm just tired of this routine."
    ]
    for msg in sad_messages:
        is_crisis, payload = safety_service.evaluate_safety(msg)
        assert is_crisis is False, f"False positive triggered for ordinary sadness: {msg}"
        assert payload == {}
