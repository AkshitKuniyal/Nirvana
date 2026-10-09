from typing import List, Dict, Any
from datetime import datetime

class InsightService:
    def generate_insights(
        self,
        mood_entries: List[Dict[str, Any]],
        journal_entries: List[Dict[str, Any]],
        wellness_sessions: List[Dict[str, Any]],
        memories: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Synthesizes respectful, non-clinical personal patterns.
        NEVER provides psychiatric diagnoses or fake certainty percentages.
        Uses empowering, reflective language.
        """
        insights_list = []

        # 1. Activity effectiveness pattern
        if wellness_sessions:
            positive_shifts = 0
            for s in wellness_sessions:
                before = s.get("before_intensity", 3)
                after = s.get("after_intensity", 3)
                if after < before:
                    positive_shifts += 1
            
            ratio = positive_shifts / len(wellness_sessions)
            if ratio >= 0.5:
                insights_list.append({
                    "id": "ins-1",
                    "category": "helpful_practices",
                    "headline": "Mindful pauses create measurable space",
                    "observation": f"In {positive_shifts} of your recent {len(wellness_sessions)} relaxation sessions, your reported intensity softened afterward. Grounding and breathing appear to serve as reliable anchors for you.",
                    "tag": "Calm Space"
                })

        # 2. Journaling reflection pattern
        if journal_entries:
            insights_list.append({
                "id": "ins-2",
                "category": "expression",
                "headline": "Writing helps give shape to complex thoughts",
                "observation": f"You have written {len(journal_entries)} private reflections. Giving language to inner thoughts often reduces the mental spinning that happens when thoughts remain unspoken.",
                "tag": "Journal"
            })

        # 3. Mood continuity
        if mood_entries:
            counts = {}
            for m in mood_entries:
                st = m.get("mood_state", "okay")
                counts[st] = counts.get(st, 0) + 1
            most_frequent = max(counts, key=counts.get)
            insights_list.append({
                "id": "ins-3",
                "category": "emotional_flow",
                "headline": "Honoring your natural emotional rhythm",
                "observation": f"Your most frequent recent check-in has been '{most_frequent}'. Remember that emotions fluctuate naturally and no state is permanent.",
                "tag": "Daily Flow"
            })

        # Default grounding insights if history is new
        if not insights_list:
            insights_list = [
                {
                    "id": "ins-default-1",
                    "category": "welcome",
                    "headline": "Your personal space is taking root",
                    "observation": "As you talk, write, or sit quietly with Nirvana, gentle patterns and helpful insights will naturally emerge here without judgment.",
                    "tag": "Journey"
                },
                {
                    "id": "ins-default-2",
                    "category": "reminder",
                    "headline": "No pressure to maintain streaks",
                    "observation": "Nirvana is not a productivity tracker. Visit whenever you feel like unburdening, and step away freely when you are at peace.",
                    "tag": "Philosophy"
                }
            ]

        return {
            "insights": insights_list,
            "generated_at": datetime.now().isoformat()
        }

insight_service = InsightService()
