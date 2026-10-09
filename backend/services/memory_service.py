import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
import re


_supabase_disabled = False

def _get_db():
    global _supabase_disabled
    if _supabase_disabled:
        return None
    try:
        from backend.database.supabase_client import get_supabase
        return get_supabase()
    except Exception:
        _supabase_disabled = True
        return None


# In-memory fallback
_fallback_store: Dict[str, List[Dict[str, Any]]] = {}


class MemoryService:

    def get_user_memories(self, user_id: str) -> List[Dict[str, Any]]:
        global _supabase_disabled
        db = _get_db()
        if db:
            try:
                res = (
                    db.table("memories")
                    .select("*")
                    .eq("user_id", user_id)
                    .eq("is_active", True)
                    .order("importance", desc=True)
                    .execute()
                )
                return res.data or []
            except Exception as e:
                print(f"[memory] Supabase get failed, switching to memory fallback: {e}")
                # Don't delay subsequent turns if remote table or permissions error occurred
                if "401" in str(e) or "PGRST" in str(e) or "relation" in str(e):
                    _supabase_disabled = True


        memories = _fallback_store.get(user_id, [])
        return [m for m in memories if m.get("is_active", True)]

    def add_memory(
        self,
        user_id: str,
        category: str,
        content: str,
        source: str = "conversation",
        confidence: float = 0.85,
        importance: int = 3,
    ) -> Dict[str, Any]:
        db = _get_db()
        if db:
            try:
                # Dedup check
                existing = (
                    db.table("memories")
                    .select("*")
                    .eq("user_id", user_id)
                    .eq("is_active", True)
                    .execute()
                )
                for m in (existing.data or []):
                    if m["content"].strip().lower() == content.strip().lower():
                        return m

                new_mem = {
                    "id": str(uuid.uuid4()),
                    "user_id": user_id,
                    "category": category,
                    "content": content.strip(),
                    "source": source,
                    "confidence": round(confidence, 2),
                    "importance": importance,
                    "is_active": True,
                    "created_at": datetime.now().isoformat(),
                    "updated_at": datetime.now().isoformat(),
                }
                res = db.table("memories").insert(new_mem).execute()
                return res.data[0] if res.data else new_mem
            except Exception as e:
                print(f"[memory] Supabase add failed, using fallback: {e}")

        # Fallback
        if user_id not in _fallback_store:
            _fallback_store[user_id] = []
        for m in _fallback_store[user_id]:
            if m["content"].strip().lower() == content.strip().lower() and m.get("is_active"):
                return m

        new_mem = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "category": category,
            "content": content.strip(),
            "source": source,
            "confidence": round(confidence, 2),
            "importance": importance,
            "is_active": True,
            "created_at": datetime.now().isoformat(),
        }
        _fallback_store[user_id].append(new_mem)
        return new_mem

    def update_memory(self, user_id: str, memory_id: str, content: str) -> Optional[Dict[str, Any]]:
        db = _get_db()
        if db:
            try:
                res = (
                    db.table("memories")
                    .update({"content": content.strip(), "updated_at": datetime.now().isoformat()})
                    .eq("id", memory_id)
                    .eq("user_id", user_id)
                    .execute()
                )
                return res.data[0] if res.data else None
            except Exception as e:
                print(f"[memory] Supabase update failed: {e}")

        memories = _fallback_store.get(user_id, [])
        for m in memories:
            if m["id"] == memory_id:
                m["content"] = content.strip()
                m["updated_at"] = datetime.now().isoformat()
                return m
        return None

    def delete_memory(self, user_id: str, memory_id: str) -> bool:
        db = _get_db()
        if db:
            try:
                db.table("memories").update(
                    {"is_active": False, "updated_at": datetime.now().isoformat()}
                ).eq("id", memory_id).eq("user_id", user_id).execute()
                return True
            except Exception as e:
                print(f"[memory] Supabase delete failed: {e}")

        memories = _fallback_store.get(user_id, [])
        for m in memories:
            if m["id"] == memory_id:
                m["is_active"] = False
                return True
        return False

    def clear_all_memories(self, user_id: str) -> bool:
        db = _get_db()
        if db:
            try:
                db.table("memories").update(
                    {"is_active": False, "updated_at": datetime.now().isoformat()}
                ).eq("user_id", user_id).execute()
                return True
            except Exception as e:
                print(f"[memory] Supabase clear failed: {e}")

        _fallback_store[user_id] = []
        return True

    def extract_candidate_memory(self, user_text: str) -> Optional[Dict[str, Any]]:
        """
        Conservative deterministic extraction of stable, helpful memories.
        Never extracts medical diagnoses, sensitive personal attributes, or fleeting complaints.
        """
        text = user_text.lower()

        pref_match = re.search(
            r"\bi (prefer|like|love) (voice|talking|writing|reading|silence|calm sounds|ambient sounds)\b", text
        )
        if pref_match:
            item = pref_match.group(2)
            return {
                "category": "preference",
                "content": f"You prefer {item} during our interactions.",
                "importance": 4,
            }

        helped_match = re.search(
            r"\b(breathing|journaling|walking|talking to you|music|rain sounds) (really )?helped\b", text
        )
        if helped_match:
            activity = helped_match.group(1)
            return {
                "category": "helpful_activity",
                "content": f"{activity.capitalize()} was helpful to you recently.",
                "importance": 3,
            }

        goal_match = re.search(r"\bi want to (work on|improve|reduce|focus on) ([a-zA-Z\s]{4,30})", text)
        if goal_match:
            goal_target = goal_match.group(2).strip()
            if not re.search(r"(hurt|die|kill|harm)", goal_target):
                return {
                    "category": "goal",
                    "content": f"You are working on: {goal_target}.",
                    "importance": 3,
                }

        return None


memory_service = MemoryService()
