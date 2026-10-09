import pytest
from backend.services.memory_service import memory_service

def test_memory_crud_and_forgetting():
    user = "test-user-1"
    
    # 1. Add memory
    mem = memory_service.add_memory(
        user_id=user,
        category="preference",
        content="Prefers soft ambient audio and short messages.",
        source="conversation"
    )
    assert mem["id"] is not None
    assert mem["content"] == "Prefers soft ambient audio and short messages."

    # 2. Retrieve memories
    all_mems = memory_service.get_user_memories(user)
    assert any(m["id"] == mem["id"] for m in all_mems)

    # 3. Update memory
    updated = memory_service.update_memory(user, mem["id"], "Prefers gentle rain sounds.")
    assert updated is not None
    assert updated["content"] == "Prefers gentle rain sounds."

    # 4. Delete / forget memory
    deleted = memory_service.delete_memory(user, mem["id"])
    assert deleted is True

    # 5. Verify forgotten
    active_mems = memory_service.get_user_memories(user)
    assert not any(m["id"] == mem["id"] for m in active_mems)

def test_ethical_memory_extraction():
    # Detects preference
    pref_text = "I prefer talking to typing when I am stressed."
    cand = memory_service.extract_candidate_memory(pref_text)
    assert cand is not None
    assert cand["category"] == "preference"
    assert "talking" in cand["content"]

    # Refuses to extract negative self-harm or sensitive words
    bad_text = "I want to hurt myself"
    cand_bad = memory_service.extract_candidate_memory(bad_text)
    assert cand_bad is None
