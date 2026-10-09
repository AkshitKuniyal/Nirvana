import pytest
from backend.services.orchestrator import orchestrator

@pytest.mark.asyncio
async def test_low_effort_mode():
    result = await orchestrator.process_turn(
        user_id="test-user",
        message="I don't want to talk right now.",
        conversation_history=[],
        allow_memory=False
    )
    assert result["action"] == "LOW_EFFORT_MODE"
    assert "don't have to explain anything" in result["message"].lower()
    actions = [a["action"] for a in result["suggested_actions"]]
    assert "breathing" in actions
    assert "quiet_mode" in actions

@pytest.mark.asyncio
async def test_crisis_switch():
    result = await orchestrator.process_turn(
        user_id="test-user",
        message="I want to commit suicide",
        conversation_history=[],
        allow_memory=False
    )
    assert result["action"] == "SAFETY_MODE"
    assert len(result["resources"]) > 0

@pytest.mark.asyncio
async def test_normal_reflection():
    result = await orchestrator.process_turn(
        user_id="test-user",
        message="I had a very exhausting day at college.",
        conversation_history=[],
        allow_memory=False
    )
    assert result["action"] in ["RESPOND", "SUGGEST_BREATHING", "SUGGEST_JOURNAL"]
    assert len(result["message"]) > 10
