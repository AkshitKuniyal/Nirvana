import httpx
from typing import Dict, Any, Optional, List
from backend.config import settings

class InworldService:
    CURATED_VOICES = [
        {"id": "Luna", "name": "Luna", "gender": "Female", "description": "Calm, relaxing, ideal for mindfulness and meditations"},
        {"id": "Serena", "name": "Serena", "gender": "Female", "description": "Soft, nurturing, compassionate emotional support"},
        {"id": "Evelyn", "name": "Evelyn", "gender": "Female", "description": "Gentle, intimate, calming quiet presence"},
        {"id": "Gareth", "name": "Gareth", "gender": "Male", "description": "Soothing, grounded, gentle guidance"},
        {"id": "Dennis", "name": "Dennis", "gender": "Male", "description": "Smooth, warm, friendly and reassuring"},
        {"id": "Shreya", "name": "Shreya", "gender": "Female", "description": "Clear, bright, friendly and peaceful"}
    ]

    async def synthesize_speech(self, text: str, voice_id: str = "Luna") -> Dict[str, Any]:
        """
        Synthesizes realistic, studio-quality speech using Inworld AI TTS API.
        Uses the ultra-low latency inworld-tts-2-flash model for real-time conversation.
        """
        if not settings.INWORLD_API_KEY:
            return {
                "status": "fallback",
                "audioContent": None,
                "provider": "browser_native",
                "message": "Inworld API key not configured; using browser speech synthesis."
            }

        clean_text = text.strip()
        if not clean_text:
            return {"status": "empty", "audioContent": None}

        # Truncate if excessively long to keep real-time latency tight (under ~350 chars is ideal for conversational turns)
        if len(clean_text) > 450:
            sentences = clean_text.split(". ")
            shortened = []
            char_count = 0
            for s in sentences:
                if char_count + len(s) < 400:
                    shortened.append(s)
                    char_count += len(s)
                else:
                    break
            clean_text = ". ".join(shortened) if shortened else clean_text[:400]
            if not clean_text.endswith("."):
                clean_text += "."

        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                resp = await client.post(
                    "https://api.inworld.ai/tts/v1/voice",
                    headers={
                        "Authorization": f"Basic {settings.INWORLD_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "text": clean_text,
                        "voiceId": voice_id or "Luna",
                        "modelId": "inworld-tts-2-flash",
                        "audioConfig": {
                            "audioEncoding": "MP3"
                        }
                    }
                )

                if resp.status_code == 200:
                    data = resp.json()
                    audio_b64 = data.get("audioContent")
                    return {
                        "status": "success",
                        "audioContent": audio_b64,
                        "voice": voice_id or "Luna",
                        "provider": "inworld",
                        "model": "inworld-tts-2-flash"
                    }
                else:
                    print(f"[InworldService] TTS synthesis non-200: {resp.status_code} {resp.text[:120]}")
        except Exception as e:
            print(f"[InworldService] TTS synthesis exception: {e}")

        # Fallback signal so frontend can seamlessly use browser synthesis
        return {
            "status": "fallback",
            "audioContent": None,
            "provider": "browser_native"
        }

    async def create_voice_session(self, user_id: str) -> Dict[str, Any]:
        """
        Negotiates active real-time voice session capabilities and curated voices.
        """
        has_key = bool(settings.INWORLD_API_KEY)
        return {
            "status": "ready",
            "provider": "inworld" if has_key else "browser_native",
            "active_model": "inworld-tts-2-flash" if has_key else "web_speech_api",
            "default_voice": "Luna",
            "voices": self.CURATED_VOICES,
            "message": "Real-time conversation pipeline ready with natural continuous voice loop."
        }

inworld_service = InworldService()
