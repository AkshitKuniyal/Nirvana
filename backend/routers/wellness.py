from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/wellness", tags=["Wellness"])

_fallback_store: Dict[str, List[Dict[str, Any]]] = {}


def _get_db():
    try:
        from backend.database.supabase_client import get_supabase
        return get_supabase()
    except Exception:
        return None


class WellnessSessionRequest(BaseModel):
    user_id: str = "default-user"
    activity_type: str  # 'breathing_478', 'breathing_box', 'grounding_54321', 'calm_reset', 'ambient_sounds', 'quiet_mode'
    duration_seconds: Optional[int] = 120
    before_intensity: Optional[int] = 3
    after_intensity: Optional[int] = 2
    feedback_note: Optional[str] = None


@router.get("/sessions")
async def get_sessions(user_id: str = "default-user"):
    db = _get_db()
    if db:
        try:
            res = (
                db.table("wellness_sessions")
                .select("*")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .execute()
            )
            return {"sessions": res.data or []}
        except Exception as e:
            print(f"[wellness] Supabase list failed, using fallback: {e}")

    sessions = _fallback_store.get(user_id, [])
    return {"sessions": sorted(sessions, key=lambda x: x["created_at"], reverse=True)}


@router.post("/session")
async def record_session(req: WellnessSessionRequest):
    session = {
        "id": str(uuid.uuid4()),
        "user_id": req.user_id,
        "activity_type": req.activity_type,
        "duration_seconds": req.duration_seconds or 120,
        "before_intensity": req.before_intensity,
        "after_intensity": req.after_intensity,
        "feedback_note": req.feedback_note,
        "created_at": datetime.now().isoformat(),
    }

    db = _get_db()
    if db:
        try:
            res = db.table("wellness_sessions").insert(session).execute()
            return {"session": res.data[0] if res.data else session}
        except Exception as e:
            print(f"[wellness] Supabase insert failed, using fallback: {e}")

    _fallback_store.setdefault(req.user_id, []).append(session)
    return {"session": session}
