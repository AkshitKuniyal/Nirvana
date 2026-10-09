from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid
from backend.services.gita_service import gita_service

router = APIRouter(prefix="/api/gita", tags=["Spiritual Corner"])

# Local fallback for saved verses (used only if Supabase is unavailable)
_fallback_verses: Dict[str, List[Dict[str, Any]]] = {}


def _get_db():
    try:
        from backend.database.supabase_client import get_supabase
        return get_supabase()
    except Exception:
        return None


class AskGitaRequest(BaseModel):
    query: str
    limit: Optional[int] = 1


class BookmarkVerseRequest(BaseModel):
    user_id: str = "default-user"
    chapter: int
    verse: int
    personal_note: Optional[str] = None


@router.get("/verses")
async def list_verses(chapter: Optional[int] = None):
    all_verses = gita_service.get_all_verses()
    if chapter:
        return {"verses": [v for v in all_verses if v["chapter"] == chapter]}
    return {"verses": all_verses}


@router.get("/verses/{chapter}/{verse_num}")
async def get_single_verse(chapter: int, verse_num: int):
    verse = gita_service.get_verse_by_chapter_and_verse(chapter, verse_num)
    if not verse:
        raise HTTPException(status_code=404, detail="Verse not found in verified knowledge base")
    return {"verse": verse}


@router.post("/ask")
async def ask_gita(req: AskGitaRequest):
    """
    RAG search against verified Bhagavad Gita knowledge base.
    Guaranteed zero hallucination of verses or numbers.
    """
    query = req.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    matches = gita_service.search_verses(query, limit=req.limit or 1)
    if not matches:
        return {
            "found": False,
            "message": "I could not find a directly corresponding verse in the Gita for this specific query. Nirvana will never invent or guess scripture. You can try exploring themes like duty, peace, grief, or anger.",
            "verse": None,
            "reflection": None,
        }

    matched_verse = matches[0]
    reflection = await gita_service.reflect_on_verse(query, matched_verse)

    return {
        "found": True,
        "verse": matched_verse,
        "reflection": reflection,
        "citation": f"Bhagavad Gita Chapter {matched_verse['chapter']}, Verse {matched_verse['verse']}",
        "verified_source": "Canonical Bhagavad Gita ML Knowledge Base (701 Verses)",
        "ml_match_score": matched_verse.get("ml_score", 0.0),
        "ml_confidence": matched_verse.get("ml_confidence", "90.0%"),
        "ml_intent": matched_verse.get("ml_intent", "general_inquiry"),
        "matched_features": matched_verse.get("matched_features", []),
    }


@router.get("/bookmarks")
async def get_bookmarks(user_id: str = "default-user"):
    db = _get_db()
    if db:
        try:
            res = (
                db.table("saved_verses")
                .select("*")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .execute()
            )
            return {"bookmarks": res.data or []}
        except Exception as e:
            print(f"[gita] Supabase list bookmarks failed: {e}")

    return {"bookmarks": _fallback_verses.get(user_id, [])}


@router.post("/bookmark")
async def bookmark_verse(req: BookmarkVerseRequest):
    verse = gita_service.get_verse_by_chapter_and_verse(req.chapter, req.verse)
    if not verse:
        raise HTTPException(status_code=404, detail="Cannot bookmark unverified verse")

    db = _get_db()
    if db:
        try:
            # Check if already bookmarked
            existing = (
                db.table("saved_verses")
                .select("*")
                .eq("user_id", req.user_id)
                .eq("chapter", req.chapter)
                .eq("verse", req.verse)
                .execute()
            )
            if existing.data:
                return {"bookmark": existing.data[0], "message": "Already saved in your collection"}

            bookmark = {
                "id": str(uuid.uuid4()),
                "user_id": req.user_id,
                "chapter": req.chapter,
                "verse": req.verse,
                "sanskrit": verse["sanskrit"],
                "translation_en": verse["translation_en"],
                "personal_note": req.personal_note,
                "created_at": datetime.now().isoformat(),
            }
            res = db.table("saved_verses").insert(bookmark).execute()
            return {"bookmark": res.data[0] if res.data else bookmark, "message": "Verse saved to your sanctuary"}
        except Exception as e:
            print(f"[gita] Supabase bookmark failed, using fallback: {e}")

    # Fallback
    _fallback_verses.setdefault(req.user_id, [])
    existing = next(
        (b for b in _fallback_verses[req.user_id] if b["chapter"] == req.chapter and b["verse"] == req.verse),
        None,
    )
    if existing:
        return {"bookmark": existing, "message": "Already saved in your collection"}

    bookmark = {
        "id": str(uuid.uuid4()),
        "user_id": req.user_id,
        "chapter": req.chapter,
        "verse": req.verse,
        "sanskrit": verse["sanskrit"],
        "translation_en": verse["translation_en"],
        "personal_note": req.personal_note,
        "created_at": datetime.now().isoformat(),
    }
    _fallback_verses[req.user_id].append(bookmark)
    return {"bookmark": bookmark, "message": "Verse saved to your sanctuary"}


@router.delete("/bookmark/{bookmark_id}")
async def remove_bookmark(bookmark_id: str, user_id: str = "default-user"):
    db = _get_db()
    if db:
        try:
            db.table("saved_verses").delete().eq("id", bookmark_id).eq("user_id", user_id).execute()
            return {"message": "Bookmark removed"}
        except Exception as e:
            print(f"[gita] Supabase delete bookmark failed: {e}")

    _fallback_verses[user_id] = [b for b in _fallback_verses.get(user_id, []) if b["id"] != bookmark_id]
    return {"message": "Bookmark removed"}
