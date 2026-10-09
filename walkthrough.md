# Nirvana — Verification & System Walkthrough

## 🌿 System Status & Architecture Overview

Nirvana is fully operational with both backend (FastAPI on `:8000`) and frontend (Vite React on `:5173`) running and validated.

### Verified Core Modules

1. **Machine Learning Powered Bhagavad Gita RAG**
   - **Dataset**: Canonical 701-verse Kaggle dataset (`a2m2a2n2/bhagwad-gita-dataset`) loaded from `backend/data/gita_verses.json` with original CSV backup (`Bhagwad_Gita.csv`).
   - **ML Engine**: `scikit-learn` TF-IDF vectorizer + Cosine Similarity semantic search across English translations, purports, word meanings, transliterations, and thematic tags.
   - **Emotional Intent Classifier**: Heuristic intent classifier mapping user queries to psychological emotional states (restless mind, anxiety/fear, anger/frustration, grief/sadness, duty/indecision, peace/detachment, surrender/trust).
   - **Anti-Hallucination**: Queries retrieve strictly canonical verses (Chapter & Verse citation, Sanskrit Devanagari, transliteration, Hindi translation, English translation, and purport).
   - **Multimodal Audio**: Web Speech API integration for authentic Sanskrit shloka audio recitation.
   - **Chapter Browser**: Complete interactive explorer for all 18 chapters with summaries and verse counts.

2. **Real-Time Spoken Companion ("Your Space")**
   - **Live Voice Mode**: Hands-free real-time conversational voice dialogue with automatic speech-to-text, concise voice responses (~28 words optimized for spoken audio), and continuous voice turns.
   - **Inworld AI Integration**: Integrated voice session support with seamless ElevenLabs / Web Speech fallback.
   - **Async Memory Pipeline**: Context and memory extractions run in non-blocking background tasks (`asyncio.create_task`) ensuring zero voice response latency.
   - **Scroll Lock Ergonomics**: Page-level Y-axis scroll is locked to prevent unwanted bouncing while the internal chat message container scrolls smoothly.

3. **Mindfulness & Grounding ("Take a Moment")**
   - **4-7-8 & Box Breathing** with dynamic expanding visual guides.
   - **5-4-3-2-1 Sensory Grounding** guided practice.
   - **Web Audio API Ambient Synthesizer**: Pure programmatic soundscapes (Rain, Ocean, Wind, Tibetan Singing Bowl) with zero external media dependencies.

4. **Private Journal ("Let It Out") & Insights ("Understand Yourself")**
   - Distraction-free journaling with optional mood tags and consensual AI reflection.
   - Non-clinical longitudinal insights showing emotional patterns, calm pauses, and grounding trends.

5. **Data Sovereignty & Privacy**
   - Direct memory view, single-fact forget, full JSON export, and complete data purge.
   - Supabase PostgreSQL database integration with safe memory fallback when offline.

---

## 🧪 Verification & Test Results

- **Backend Pytest Suite**: 11 passed (100% pass rate)
  - `test_gita_authentic_verse_retrieval` ✅ PASSED
  - `test_gita_anger_and_calm_retrieval` ✅ PASSED
  - `test_gita_anti_hallucination_empty_for_nonsense` ✅ PASSED
  - `test_gita_source_verification` ✅ PASSED
  - `test_memory_crud_and_forgetting` ✅ PASSED
  - `test_ethical_memory_extraction` ✅ PASSED
  - `test_low_effort_mode` ✅ PASSED
  - `test_crisis_switch` ✅ PASSED
  - `test_normal_reflection` ✅ PASSED
  - `test_crisis_triggers_safety` ✅ PASSED
  - `test_ordinary_sadness_does_not_trigger_crisis` ✅ PASSED
- **Frontend TypeScript & Vite Production Build**: `tsc && vite build` completed cleanly with 0 errors.
- **UI Scaling**: 110% root zoom base scale configured in `frontend/src/index.css` for optimal readability and ergonomic layout.
