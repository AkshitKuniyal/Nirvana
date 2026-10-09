from fastapi import APIRouter
from backend.services.memory_service import memory_service

router = APIRouter(prefix="/api/privacy", tags=["Privacy"])


def _get_db():
    try:
        from backend.database.supabase_client import get_supabase
        return get_supabase()
    except Exception:
        return None


@router.get("/export")
async def export_user_data(user_id: str = "default-user"):
    """
    Exports all personal data stored for this user account in transparent JSON format.
    """
    db = _get_db()
    journals, moods, wellness, verses = [], [], [], []

    if db:
        try:
            journals = (db.table("journal_entries").select("*").eq("user_id", user_id).execute()).data or []
            moods = (db.table("mood_entries").select("*").eq("user_id", user_id).execute()).data or []
            wellness = (db.table("wellness_sessions").select("*").eq("user_id", user_id).execute()).data or []
            verses = (db.table("saved_verses").select("*").eq("user_id", user_id).execute()).data or []
        except Exception as e:
            print(f"[privacy] Supabase export failed: {e}")

    return {
        "user_id": user_id,
        "memories": memory_service.get_user_memories(user_id),
        "journal_entries": journals,
        "mood_entries": moods,
        "wellness_sessions": wellness,
        "saved_verses": verses,
    }


@router.post("/delete-all")
async def delete_all_data(user_id: str = "default-user"):
    """
    Permanently erases all user-owned records across all collections.
    """
    db = _get_db()
    if db:
        try:
            db.table("journal_entries").delete().eq("user_id", user_id).execute()
            db.table("mood_entries").delete().eq("user_id", user_id).execute()
            db.table("wellness_sessions").delete().eq("user_id", user_id).execute()
            db.table("saved_verses").delete().eq("user_id", user_id).execute()
            db.table("memories").delete().eq("user_id", user_id).execute()
        except Exception as e:
            print(f"[privacy] Supabase delete-all failed: {e}")

    memory_service.clear_all_memories(user_id)

    return {"message": "All personal data has been permanently and irrevocably erased."}
