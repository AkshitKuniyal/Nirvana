import pytest
from backend.services.gita_service import gita_service

def test_gita_authentic_verse_retrieval():
    results = gita_service.search_verses("anxious about my exam results and career duty")
    assert len(results) > 0
    top = results[0]
    assert top["chapter"] == 2
    assert top["verse"] == 47
    assert "कर्मण्येवाधिकारस्ते" in top["sanskrit"]
    assert "Thy right is to work only" in top["translation_en"] or "fruits" in top["translation_en"]

def test_gita_anger_and_calm_retrieval():
    results = gita_service.search_verses("how do I control my anger and calm down")
    assert len(results) > 0
    verses = [v["verse"] for v in results]
    # Chapter 2 Verse 62 or 63
    assert 62 in verses or 63 in verses

def test_gita_anti_hallucination_empty_for_nonsense():
    results = gita_service.search_verses("cryptocurrency bitcoin gpu mining algorithm")
    assert len(results) == 0

def test_gita_source_verification():
    verse = gita_service.get_verse_by_chapter_and_verse(2, 14)
    assert verse is not None
    assert verse["chapter"] == 2
    assert verse["verse"] == 14
    assert "मात्रास्पर्शास्तु कौन्तेय" in verse["sanskrit"]
