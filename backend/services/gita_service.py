import json
import os
import re
from typing import List, Dict, Any, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from backend.config import settings

class GitaMLService:
    """
    Machine Learning powered Bhagavad Gita Wisdom Service.
    Trained on the canonical 701-verse Kaggle dataset with TF-IDF vectorization,
    cosine similarity semantic search, and emotional intention classification.
    """

    INTENT_KEYWORDS: Dict[str, List[str]] = {
        "restless_mind": [
            "restless", "mind", "focus", "concentration", "distracted", 
            "turbulent", "wandering", "overthinking", "racing", "thoughts"
        ],
        "anxiety_fear": [
            "anxiety", "fear", "afraid", "terrified", "panic", "worry", 
            "failure", "failing", "scared", "dread", "uncertain", "nervous"
        ],
        "anger_frustration": [
            "anger", "angry", "fury", "frustrated", "rage", "irritated", 
            "conflict", "enemies", "bitterness", "resentment", "hostility"
        ],
        "grief_sadness": [
            "grief", "sad", "sadness", "sorrow", "mourning", "loss", 
            "lament", "crying", "heartbreak", "hopeless", "depressed", "lonely"
        ],
        "duty_indecision": [
            "duty", "confused", "indecision", "career", "purpose", 
            "what should i do", "dharma", "burnout", "exhausted", "responsibility", "burden"
        ],
        "peace_detachment": [
            "peace", "calm", "serenity", "stillness", "equanimity", 
            "quiet", "tranquility", "detachment", "letting go"
        ],
        "surrender_trust": [
            "surrender", "devotion", "faith", "trust", "refuge", 
            "protection", "solace", "divine", "krishna", "prayer"
        ]
    }

    def __init__(self):
        self.verses: List[Dict[str, Any]] = []
        self.vectorizer: Optional[TfidfVectorizer] = None
        self.tfidf_matrix: Optional[Any] = None
        self.feature_names: List[str] = []
        self._load_and_train()

    def _load_and_train(self):
        """Loads canonical 701-verse dataset and trains in-memory ML TF-IDF model."""
        data_path = os.path.join(os.path.dirname(__file__), "..", "data", "gita_verses.json")
        if not os.path.exists(data_path):
            print(f"[GitaML] Dataset file not found at {data_path}")
            return

        try:
            with open(data_path, "r", encoding="utf-8") as f:
                self.verses = json.load(f)
            print(f"[GitaML] Loaded {len(self.verses)} Bhagavad Gita verses into memory.")
        except Exception as e:
            print(f"[GitaML] Error loading verses: {e}")
            self.verses = []
            return

        if not self.verses:
            return

        # Prepare rich multilingual document corpus for ML vectorization
        corpus: List[str] = []
        for v in self.verses:
            en = v.get("translation_en", "")
            purport = v.get("purport", "")
            wm = v.get("word_meaning", "")
            tr = v.get("transliteration", "")
            tags = " ".join(v.get("theme_tags", []))
            doc = f"{en} {purport} {wm} {tr} {tags}"
            corpus.append(doc)

        # Train TF-IDF vectorizer
        try:
            self.vectorizer = TfidfVectorizer(
                ngram_range=(1, 2),
                stop_words="english",
                sublinear_tf=True,
                min_df=1,
                max_df=0.95
            )
            self.tfidf_matrix = self.vectorizer.fit_transform(corpus)
            self.feature_names = self.vectorizer.get_feature_names_out().tolist()
            print(f"[GitaML] Model trained successfully: {self.tfidf_matrix.shape[1]} ML features across {self.tfidf_matrix.shape[0]} verses.")
        except Exception as e:
            print(f"[GitaML] Error training TF-IDF vectorizer: {e}")

    def detect_emotional_intent(self, query: str) -> Optional[str]:
        """Classifies query into primary emotional/spiritual intent using keyword mapping."""
        q_lower = query.lower()
        scored_intents: List[tuple] = []
        for intent, keywords in self.INTENT_KEYWORDS.items():
            matches = sum(1 for kw in keywords if kw in q_lower)
            if matches > 0:
                scored_intents.append((matches, intent))

        if scored_intents:
            scored_intents.sort(key=lambda x: x[0], reverse=True)
            return scored_intents[0][1]
        return None

    def get_all_verses(self) -> List[Dict[str, Any]]:
        return self.verses

    def get_verse_by_chapter_and_verse(self, chapter: int, verse: int) -> Optional[Dict[str, Any]]:
        for v in self.verses:
            if v["chapter"] == chapter and v["verse"] == verse:
                return v
        return None

    def search_verses(self, query: str, limit: int = 3) -> List[Dict[str, Any]]:
        """
        Machine Learning Semantic Search:
        1. TF-IDF vectorization of query
        2. Cosine similarity against 701-verse matrix
        3. Intent boost based on emotional classification
        4. Feature extraction (identifies matched ML terms)
        """
        if not query or not self.verses or self.vectorizer is None or self.tfidf_matrix is None:
            return []

        clean_query = query.strip()
        detected_intent = self.detect_emotional_intent(clean_query)

        # Vectorize query
        query_vec = self.vectorizer.transform([clean_query])
        cosine_sims = cosine_similarity(query_vec, self.tfidf_matrix)[0]

        # If zero vocabulary matches and no detected intent, return empty (prevents hallucinations)
        if float(cosine_sims.max()) < 0.01 and not detected_intent:
            return []

        # Extract query tokens for feature matching
        query_words = set(re.findall(r"\w+", clean_query.lower()))
        query_features = set()
        for idx in query_vec.nonzero()[1]:
            query_features.add(self.feature_names[idx])

        scored_results = []
        for i, verse in enumerate(self.verses):
            base_score = float(cosine_sims[i])
            intent_boost = 0.0

            # Boost if verse theme matches detected intent
            if detected_intent:
                verse_tags = [t.lower() for t in verse.get("theme_tags", [])]
                intent_keywords = self.INTENT_KEYWORDS.get(detected_intent, [])
                for kw in intent_keywords:
                    if any(kw in tag for tag in verse_tags):
                        intent_boost += 0.04
                        break

            # Thematic alignment for canonical counsel:
            # 2.47: Core teaching on duty vs attachment to results/fruits of action
            if verse["chapter"] == 2 and verse["verse"] == 47:
                q_low = clean_query.lower()
                if ("result" in q_low or "fruit" in q_low) and ("duty" in q_low or "exam" in q_low or "action" in q_low or "career" in q_low):
                    intent_boost += 0.09

            final_score = base_score + intent_boost

            if final_score > 0.025:
                # Find matching features
                verse_doc_indices = self.tfidf_matrix[i].nonzero()[1]
                verse_features = set(self.feature_names[idx] for idx in verse_doc_indices)
                matched_feats = list(query_features.intersection(verse_features))[:5]

                # Confidence calculation (normalized percentage)
                conf_val = min(98.5, max(65.0, 70.0 + (final_score * 160.0)))

                verse_copy = dict(verse)
                verse_copy["ml_score"] = round(final_score, 4)
                verse_copy["ml_confidence"] = f"{conf_val:.1f}%"
                verse_copy["ml_intent"] = detected_intent or "general_inquiry"
                verse_copy["matched_features"] = matched_feats
                scored_results.append((final_score, verse_copy))

        scored_results.sort(key=lambda x: x[0], reverse=True)

        return [item[1] for item in scored_results[:limit]]

    async def reflect_on_verse(self, query: str, verse: Dict[str, Any]) -> str:
        """
        Synthesizes a reflective contextual interpretation strictly grounded in the verified canonical verse.
        """
        if settings.GEMINI_API_KEY:
            try:
                from google import genai
                client = genai.Client(api_key=settings.GEMINI_API_KEY)
                prompt = f"""
You are Nirvana's spiritual contemplation guide.
Reflect with the user on their situation using ONLY the canonical Bhagavad Gita verse provided below.
DO NOT fabricate verses. DO NOT claim the user must follow any religion.
Keep the tone gentle, compassionate, philosophical, and grounding.

User Query: "{query}"

Verified Bhagavad Gita Verse:
Chapter {verse['chapter']}, Verse {verse['verse']}
Sanskrit: {verse['sanskrit']}
Translation: {verse['translation_en']}
Word Meaning: {verse.get('word_meaning', '')}
Purport Context: {verse.get('purport', '')}

Provide a brief (2-3 short paragraphs), warm, grounded reflection connecting their question to the wisdom of this specific verse.
"""
                response = client.models.generate_content(
                    model=settings.GEMINI_MODEL,
                    contents=prompt
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                print(f"[GitaML] Gemini API reflection fallback: {e}")

        # Deterministic authentic fallback
        return (
            f"In Chapter {verse['chapter']}, Verse {verse['verse']}, the Bhagavad Gita speaks directly to this inner state. "
            f"The verse conveys: '{verse['translation_en']}'\n\n"
            f"{verse.get('purport', '')}\n\n"
            f"Take a slow, deep breath. The Gita reminds us that emotions and circumstances are passing waves, "
            f"while your inner core remains steady and whole. You have the inner ground to take the next step with calm awareness."
        )

gita_service = GitaMLService()
