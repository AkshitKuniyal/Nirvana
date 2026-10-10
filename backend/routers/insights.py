from fastapi import APIRouter
from backend.services.insight_service import insight_service
from backend.services.memory_service import memory_service

router = APIRouter(prefix="/insights", tags=["Insights"])


def _get_db():
    try:
        from backend.database.supabase_client import get_supabase
        return get_supabase()
    except Exception:
        return None


@router.get("")
async def get_insights(user_id: str = "default-user"):
    db = _get_db()
    moods, journals, wellness = [], [], []

    if db:
        try:
            moods = (db.table("mood_entries").select("*").eq("user_id", user_id).execute()).data or []
            journals = (db.table("journal_entries").select("*").eq("user_id", user_id).execute()).data or []
            wellness = (db.table("wellness_sessions").select("*").eq("user_id", user_id).execute()).data or []
        except Exception as e:
            print(f"[insights] Supabase fetch failed: {e}")

    memories = memory_service.get_user_memories(user_id)

    return insight_service.generate_insights(
        mood_entries=moods,
        journal_entries=journals,
        wellness_sessions=wellness,
        memories=memories,
    )
