from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from backend.services.orchestrator import orchestrator
from backend.services.inworld_service import inworld_service

router = APIRouter(prefix="/companion", tags=["Companion"])

class ChatRequest(BaseModel):
    user_id: str = "default-user"
    message: str
    conversation_history: Optional[List[Dict[str, str]]] = []
    user_preferences: Optional[Dict[str, Any]] = {}
    allow_memory: bool = True
    voice_mode: bool = False
    voice_id: Optional[str] = "Luna"

class VoiceSessionRequest(BaseModel):
    user_id: str = "default-user"

class TTSRequest(BaseModel):
    text: str
    voice_id: Optional[str] = "Luna"

@router.post("/chat")
async def chat_with_companion(req: ChatRequest):
    try:
        result = await orchestrator.process_turn(
            user_id=req.user_id,
            message=req.message,
            conversation_history=req.conversation_history,
            user_preferences=req.user_preferences,
            allow_memory=req.allow_memory,
            is_voice_mode=req.voice_mode
        )

        audio_b64 = None
        audio_provider = "none"

        # If voice mode is requested, synthesize audio in real time via Inworld AI
        if req.voice_mode and result.get("message"):
            tts_res = await inworld_service.synthesize_speech(
                text=result["message"],
                voice_id=req.voice_id or "Luna"
            )
            audio_b64 = tts_res.get("audioContent")
            audio_provider = tts_res.get("provider", "browser_native")

        result["audio_base64"] = audio_b64
        result["audio_provider"] = audio_provider
        result["voice_id"] = req.voice_id or "Luna"
        return result
    except Exception as e:
        print(f"Error in companion chat: {e}")
        return {
            "action": "RESPOND",
            "message": "Something went quiet for a moment. Take a deep breath—I am right here whenever you'd like to try again.",
            "suggested_actions": [
                {"label": "Take a Pause", "action": "quiet_mode"},
                {"label": "Breathe", "action": "breathing"}
            ],
            "extracted_memory": None,
            "audio_base64": None,
            "audio_provider": "browser_native",
            "voice_id": req.voice_id or "Luna"
        }

@router.post("/tts")
async def synthesize_speech_endpoint(req: TTSRequest):
    """Generates direct Inworld AI TTS audio for any given text."""
    return await inworld_service.synthesize_speech(text=req.text, voice_id=req.voice_id or "Luna")

@router.post("/voice-session")
async def get_voice_session(req: VoiceSessionRequest):
    session = await inworld_service.create_voice_session(req.user_id)
    return session
