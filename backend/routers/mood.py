from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
import uuid

router = APIRouter(prefix="/api/mood", tags=["Mood"])

# Local fallback store
_fallback_store: Dict[str, List[Dict[str, Any]]] = {}


def _get_db():
    try:
        from backend.database.supabase_client import get_supabase
        return get_supabase()
    except Exception:
        return None


class LogMoodRequest(BaseModel):
    user_id: str = "default-user"
    mood_state: str  # 'good', 'okay', 'meh', 'low', 'overwhelmed'
    intensity: Optional[int] = 3
    note: Optional[str] = None
    context_tag: Optional[str] = None


@router.get("")
async def get_mood_history(user_id: str = "default-user", days: int = 30):
    cutoff = (datetime.now() - timedelta(days=days)).isoformat()

    db = _get_db()
    if db:
        try:
            res = (
                db.table("mood_entries")
                .select("*")
                .eq("user_id", user_id)
                .gte("created_at", cutoff)
                .order("created_at", desc=True)
                .execute()
            )
            return {"entries": res.data or [], "days": days}
        except Exception as e:
            print(f"[mood] Supabase list failed, using fallback: {e}")

    entries = _fallback_store.get(user_id, [])
    filtered = [e for e in entries if e["created_at"] >= cutoff]
    return {
        "entries": sorted(filtered, key=lambda x: x["created_at"], reverse=True),
        "days": days,
    }


@router.post("")
async def log_mood(req: LogMoodRequest):
    entry = {
        "id": str(uuid.uuid4()),
        "user_id": req.user_id,
        "mood_state": req.mood_state,
        "intensity": req.intensity or 3,
        "note": req.note,
        "context_tag": req.context_tag,
        "created_at": datetime.now().isoformat(),
    }

    db = _get_db()
    if db:
        try:
            res = db.table("mood_entries").insert(entry).execute()
            return {"entry": res.data[0] if res.data else entry}
        except Exception as e:
            print(f"[mood] Supabase insert failed, using fallback: {e}")

    _fallback_store.setdefault(req.user_id, []).append(entry)
    return {"entry": entry}
