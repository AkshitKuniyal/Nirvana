from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from backend.config import settings

router = APIRouter(prefix="/api/journal", tags=["Journal"])

# ---------------------------------------------------------------------------
# Supabase-backed storage with graceful local fallback
# ---------------------------------------------------------------------------

def _get_db():
    try:
        from backend.database.supabase_client import get_supabase
        return get_supabase()
    except Exception:
        return None


# Local fallback (used only when Supabase is unreachable)
_fallback_store: Dict[str, List[Dict[str, Any]]] = {}


class CreateJournalRequest(BaseModel):
    user_id: str = "default-user"
    title: Optional[str] = "Untitled Reflection"
    content: str
    mood: Optional[str] = None
    tags: Optional[List[str]] = []
    is_private: Optional[bool] = True


class ReflectRequest(BaseModel):
    user_id: str = "default-user"
    mode: str = "understand"  # "reflect", "understand", "next_steps"


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.get("")
async def list_entries(user_id: str = "default-user"):
    db = _get_db()
    if db:
        try:
            res = (
                db.table("journal_entries")
                .select("*")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .execute()
            )
            return {"entries": res.data or []}
        except Exception as e:
            print(f"[journal] Supabase list failed, using fallback: {e}")

    entries = _fallback_store.get(user_id, [])
    return {"entries": sorted(entries, key=lambda x: x["created_at"], reverse=True)}


@router.post("")
async def create_entry(req: CreateJournalRequest):
    entry = {
        "id": str(uuid.uuid4()),
        "user_id": req.user_id,
        "title": req.title or "Untitled Reflection",
        "content": req.content,
        "mood": req.mood,
        "tags": req.tags or [],
        "is_private": req.is_private if req.is_private is not None else True,
        "reflection": None,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }

    db = _get_db()
    if db:
        try:
            res = db.table("journal_entries").insert(entry).execute()
            return {"entry": res.data[0] if res.data else entry}
        except Exception as e:
            print(f"[journal] Supabase insert failed, using fallback: {e}")

    _fallback_store.setdefault(req.user_id, []).append(entry)
    return {"entry": entry}


@router.post("/{entry_id}/reflect")
async def reflect_on_entry(entry_id: str, req: ReflectRequest):
    # Fetch entry
    target = None
    db = _get_db()
    if db:
        try:
            res = (
                db.table("journal_entries")
                .select("*")
                .eq("id", entry_id)
                .eq("user_id", req.user_id)
                .single()
                .execute()
            )
            target = res.data
        except Exception as e:
            print(f"[journal] Supabase fetch failed: {e}")

    if not target:
        entries = _fallback_store.get(req.user_id, [])
        target = next((e for e in entries if e["id"] == entry_id), None)

    if not target:
        raise HTTPException(status_code=404, detail="Journal entry not found")

    content = target["content"]
    reflection = None

    if settings.GEMINI_API_KEY:
        try:
            from google import genai
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            prompt = f"""
You are Nirvana's compassionate journal reflection guide.
A user has written this private journal entry and requested gentle reflection.
Reflect with them using cautious, empathetic language ('It sounds like...', 'You might be feeling...', 'One possibility is...').
Never diagnose, judge, or lecture.

Journal Entry:
"{content}"

Output valid JSON in exactly this format:
{{
  "feeling": "Cautious summary of feelings you sense...",
  "trigger": "Possible situational context or trigger...",
  "thought": "A gentle observation of underlying thoughts...",
  "needs": "What might feel grounding, nourishing, or helpful right now..."
}}
"""
            res = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt
            )
            if res and res.text:
                import json
                text = res.text.strip()
                if "```json" in text:
                    text = text.split("```json")[1].split("```")[0].strip()
                elif "```" in text:
                    text = text.split("```")[1].split("```")[0].strip()
                reflection = json.loads(text)
        except Exception as e:
            print(f"[journal] Gemini reflection fallback: {e}")

    if not reflection:
        reflection = {
            "feeling": "It sounds like you are carrying a lot of deep thoughts and feeling the weight of uncertainty.",
            "trigger": "Navigating situations that demand high mental or emotional energy.",
            "thought": "You may be feeling pressure to resolve or solve things immediately.",
            "needs": "Permission to slow down, breathe, and honor your own pace without self-criticism.",
        }

    # Persist reflection
    if db:
        try:
            db.table("journal_entries").update(
                {"reflection": reflection, "updated_at": datetime.now().isoformat()}
            ).eq("id", entry_id).execute()
        except Exception as e:
            print(f"[journal] Supabase update reflection failed: {e}")
    else:
        target["reflection"] = reflection

    target["reflection"] = reflection
    return {"entry": target, "reflection": reflection}


@router.delete("/{entry_id}")
async def delete_entry(entry_id: str, user_id: str = "default-user"):
    db = _get_db()
    if db:
        try:
            db.table("journal_entries").delete().eq("id", entry_id).eq("user_id", user_id).execute()
            return {"message": "Journal entry deleted permanently"}
        except Exception as e:
            print(f"[journal] Supabase delete failed: {e}")

    entries = _fallback_store.get(user_id, [])
    before_len = len(entries)
    _fallback_store[user_id] = [e for e in entries if e["id"] != entry_id]
    if len(_fallback_store[user_id]) == before_len:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"message": "Journal entry deleted permanently"}
