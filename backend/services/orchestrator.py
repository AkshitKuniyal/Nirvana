from typing import Dict, Any, List, Optional
import re
from backend.config import settings
from backend.services.safety_service import safety_service
from backend.services.memory_service import memory_service
from backend.services.gita_service import gita_service

class Orchestrator:
    async def process_turn(
        self,
        user_id: str,
        message: str,
        conversation_history: List[Dict[str, str]] = None,
        user_preferences: Dict[str, Any] = None,
        allow_memory: bool = True,
        is_voice_mode: bool = False
    ) -> Dict[str, Any]:
        """
        Central orchestration pipeline for Nirvana Companion.
        Steps:
        1. Safety Evaluation (deterministic & immediate)
        2. 'I don't want to talk' / Low-effort Intent Detection
        3. Spiritual / Gita Intent Detection (if enabled or requested)
        4. Context Assembly (relevant memories, short-term history)
        5. AI Reasoning & Response Generation
        6. Dynamic Action Decision (RESPOND, SUGGEST_JOURNAL, BREATHE, CALM_SOUNDS, etc.)
        7. Memory Candidate Extraction
        """
        conversation_history = conversation_history or []
        user_preferences = user_preferences or {}
        clean_text = message.strip()

        # Step 1: Safety Evaluation
        is_crisis, safety_payload = safety_service.evaluate_safety(clean_text)
        if is_crisis:
            return {
                "action": "SAFETY_MODE",
                "message": safety_payload["message"],
                "resources": safety_payload["resources"],
                "suggested_actions": safety_payload["suggested_actions"],
                "extracted_memory": None
            }

        # Step 2: "I don't want to talk" / Low-effort mode
        low_effort_patterns = [
            r"\b(don['’]?t\s+want\s+to\s+talk|not\s+in\s+the\s+mood\s+to\s+talk|can\s+we\s+just\s+be\s+quiet|shut\s+up|leave\s+me\s+alone|just\s+sit|no\s+words)\b",
            r"\b(baat\s+nahi\s+karni|bolne\s+ka\s+mann\s+nahi|chup\s+rehna\s+hai)\b"
        ]
        if any(re.search(pat, clean_text, re.IGNORECASE) for pat in low_effort_patterns):
            return {
                "action": "LOW_EFFORT_MODE",
                "message": "That is completely okay. You don't have to explain anything or find any words right now. We can just be here in quiet.",
                "suggested_actions": [
                    {"label": "Gentle 4-7-8 Breathing", "action": "breathing"},
                    {"label": "Calming Rain Sound", "action": "calm_sounds"},
                    {"label": "Private Journal", "action": "journal"},
                    {"label": "Just Sit in Quiet", "action": "quiet_mode"}
                ],
                "extracted_memory": None
            }

        # Step 3: Spiritual / Gita Query Detection
        gita_keywords = [
            r"\b(gita|krishna|arjuna|karma|dharma|shloka|verse|spiritual|scripture|bhagavad)\b",
            r"\b(what\s+does\s+the\s+gita\s+say|gita\s+guidance|gita\s+reflection)\b"
        ]
        wants_gita = any(re.search(kw, clean_text, re.IGNORECASE) for kw in gita_keywords)
        spiritual_enabled = user_preferences.get("spiritual_guidance_enabled", False)

        if wants_gita or (spiritual_enabled and re.search(r"\b(duty|purpose|why\s+is\s+this\s+happening|anxious\s+about\s+results)\b", clean_text, re.IGNORECASE)):
            verses = gita_service.search_verses(clean_text, limit=1)
            if verses:
                matched_verse = verses[0]
                reflection = await gita_service.reflect_on_verse(clean_text, matched_verse)
                return {
                    "action": "SPIRITUAL_REFLECT",
                    "message": reflection,
                    "verse": matched_verse,
                    "suggested_actions": [
                        {"label": "Save this Verse", "action": "bookmark_verse"},
                        {"label": "Journal with this Thought", "action": "journal"},
                        {"label": "Take a Deep Breath", "action": "breathing"}
                    ],
                    "extracted_memory": None
                }

        # Step 4: Context Assembly
        relevant_memories = memory_service.get_user_memories(user_id) if allow_memory else []
        memory_context = "\n".join([f"- {m['content']}" for m in relevant_memories[:4]]) if relevant_memories else "No previous memories recorded yet."

        # Step 5: AI Reasoning & Generation
        ai_reply = await self._generate_response(
            clean_text,
            conversation_history,
            memory_context,
            user_preferences,
            is_voice_mode=is_voice_mode
        )

        # Step 6: Determine Dynamic Action & Suggested Micro-Interactions
        action_type = "RESPOND"
        suggested_actions = []

        lower_reply = ai_reply.lower()
        if re.search(r"\b(breathe|exhale|deep breath)\b", lower_reply) or re.search(r"\b(overwhelmed|panic|heavy heart|chest tight)\b", clean_text.lower()):
            action_type = "SUGGEST_BREATHING"
            suggested_actions = [
                {"label": "Breathe with Nirvana (2 min)", "action": "breathing"},
                {"label": "Calming Ambient Rain", "action": "calm_sounds"},
                {"label": "Write It Out", "action": "journal"}
            ]
        elif re.search(r"\b(journal|write it down|unburden)\b", lower_reply) or len(clean_text.split()) > 40:
            action_type = "SUGGEST_JOURNAL"
            suggested_actions = [
                {"label": "Let It Out in Private Journal", "action": "journal"},
                {"label": "Take a Quiet Pause", "action": "quiet_mode"}
            ]
        else:
            suggested_actions = [
                {"label": "Take a Pause", "action": "quiet_mode"},
                {"label": "Journal", "action": "journal"}
            ]

        # Step 7: Memory Extraction (only if allowed and non-ephemeral)
        candidate_memory = None
        if allow_memory:
            if is_voice_mode:
                # Run memory extraction in background so voice turn returns with ultra-low latency
                import asyncio
                asyncio.create_task(self._async_extract_and_save_memory(user_id, clean_text))
            else:
                candidate = memory_service.extract_candidate_memory(clean_text)
                if candidate:
                    saved = memory_service.add_memory(
                        user_id=user_id,
                        category=candidate["category"],
                        content=candidate["content"],
                        importance=candidate["importance"]
                    )
                    candidate_memory = saved

        return {
            "action": action_type,
            "message": ai_reply,
            "suggested_actions": suggested_actions,
            "extracted_memory": candidate_memory
        }

    async def _async_extract_and_save_memory(self, user_id: str, clean_text: str):
        try:
            candidate = memory_service.extract_candidate_memory(clean_text)
            if candidate:
                memory_service.add_memory(
                    user_id=user_id,
                    category=candidate["category"],
                    content=candidate["content"],
                    importance=candidate["importance"]
                )
        except Exception as e:
            print(f"[orchestrator] Background memory save note: {e}")

    async def _generate_response(
        self,
        user_input: str,
        history: List[Dict[str, str]],
        memory_context: str,
        user_preferences: Dict[str, Any],
        is_voice_mode: bool = False
    ) -> str:
        """
        Invokes Gemini with strict safety and compassionate system instructions,
        falling back gracefully to contextual grounded responses if offline.
        """
        if is_voice_mode:
            system_instruction = f"""
You are Nirvana, speaking directly with the user over a live 1-on-1 spoken voice call.
CRITICAL SPOKEN VOICE GUIDELINES:
- You are speaking out loud through voice audio. Speak naturally, tenderly, and warmly like a close friend on a call.
- Keep your response to 1 or 2 concise spoken sentences (maximum 28 words).
- ABSOLUTELY NEVER use markdown, bold (**), asterisks (*), bullet points, numbered lists, emojis, quotes, or symbols.
- If the user gives a greeting (like 'hi', 'hello', 'hey', 'namaste'), reply warmly in one sentence and invite them to share how they are feeling.
- Never interrogate or ask multiple questions. Ask at most one gentle, caring open question or simply validate their feeling.

Verified context:
{memory_context}
"""
        else:
            system_instruction = f"""
You are Nirvana, an intimate, calming, and deeply empathetic mental wellness companion and safe sanctuary.
You are NOT a clinical therapist, medical doctor, or generic customer service bot. You are an attentive, thoughtful, warm presence who listens deeply and holds space without judgment.

Guidelines:
- If the user sends a greeting (e.g., 'Hi', 'Hello', 'Hey', 'Namaste'), warmly welcome them back to their space, let them know you are right here with them, and gently ask how their day or heart is feeling right now, reminding them there is zero rush.
- If the user expresses stress, sadness, fatigue, or overwhelm, validate their emotion with heartfelt empathy, tenderness, and grounding calm.
- Never say 'As an AI language model...', 'I am an AI', or use robotic boilerplate.
- Never interrogate the user with multiple questions; ask at most one gentle, caring open question when it feels natural.
- Keep responses concise, warm, grounded, and comforting (usually 2-4 sentences).
- Speak naturally in English, or gentle Hinglish if the user speaks Hindi/Hinglish.

Verified context about this user:
{memory_context}
"""
        if settings.GEMINI_API_KEY:
            try:
                from google import genai
                client = genai.Client(api_key=settings.GEMINI_API_KEY)
                
                # Format recent history
                contents = []
                for turn in history[-6:]:
                    role = "user" if turn.get("sender") == "user" else "model"
                    contents.append(f"{role}: {turn.get('content', '')}")
                contents.append(f"user: {user_input}")

                full_prompt = system_instruction + "\n\nConversation so far:\n" + "\n".join(contents) + "\nmodel:"
                
                candidate_models = [settings.GEMINI_MODEL, "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
                seen = set()
                models_to_try = [m for m in candidate_models if m and not (m in seen or seen.add(m))]
                
                for mod in models_to_try:
                    try:
                        response = client.models.generate_content(
                            model=mod,
                            contents=full_prompt
                        )
                        if response and response.text:
                            text = response.text.strip()
                            if is_voice_mode:
                                # Strip any accidental markdown formatting or emojis for spoken voice
                                text = re.sub(r"[*_#`~[\]()]", "", text).replace("\n", " ").strip()
                            return text
                    except Exception as model_err:
                        print(f"Gemini model {mod} attempt note: {model_err}")
            except Exception as e:
                print(f"Gemini generation fallback: {e}")

        # Intelligent contextual fallback
        text_lower = user_input.lower()
        if is_voice_mode:
            if any(k in text_lower for k in ["hi", "hello", "hey", "namaste", "morning", "evening"]):
                return "Hello. I'm right here with you. How is your heart feeling today?"
            if any(k in text_lower for k in ["exhausted", "tired", "thak"]):
                return "It sounds like today has asked a lot of you. Take a slow breath—I'm right here with you."
            if any(k in text_lower for k in ["anxious", "stress", "overthink", "worried"]):
                return "Let's pause together for just one breath. What is sitting at the front of your mind right now?"
            if any(k in text_lower for k in ["sad", "low", "crying", "hurt"]):
                return "I hear you, and it's okay to feel whatever is here. You don't have to carry it all alone."
            return "I'm listening closely. Take all the time you need."

        if "exhausted" in text_lower or "tired" in text_lower or "thak" in text_lower:
            return "It sounds like today has asked a lot out of you. You don't have to carry the whole day on your shoulders here. Would you like to just unburden what's weighing on you, or simply rest in silence for a few minutes?"
        if "anxious" in text_lower or "stress" in text_lower or "overthink" in text_lower or "worried" in text_lower:
            return "When the mind starts racing, everything feels urgent all at once. Let's slow down for just one breath. What's the main thought sitting at the front of your mind right now?"
        if "sad" in text_lower or "low" in text_lower or "crying" in text_lower:
            return "I hear you, and it's okay to feel low right now. You don't have to force yourself to be cheerful or put up a front here. I'm right here with you."
        
        return "I'm listening. Take whatever time you need—there's no rush to explain everything."

orchestrator = Orchestrator()

