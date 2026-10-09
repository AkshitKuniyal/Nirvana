// API client for Nirvana platform services

const API_BASE = "/api";

export interface ChatMessage {
  id: string;
  sender: "user" | "companion" | "system";
  content: string;
  action_type?: string;
  resources?: Array<{ name: string; contact: string; description: string }>;
  suggested_actions?: Array<{ label: string; action: string }>;
  follow_up_memories?: string[];
  created_at?: string;
}

export interface MemoryItem {
  id: string;
  user_id: string;
  category: string;
  content: string;
  source: string;
  confidence: number;
  importance: number;
  is_active: boolean;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
  is_private: boolean;
  reflection?: {
    feeling: string;
    trigger: string;
    thought: string;
    needs: string;
  };
  created_at: string;
}

export interface GitaVerse {
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  translation_en: string;
  translation_hi: string;
  theme_tags: string[];
  purport: string;
}

export const api = {
  // Companion
  async sendMessage(
    message: string,
    history: ChatMessage[] = [],
    allowMemory: boolean = true,
    userPreferences: Record<string, any> = {},
    voiceMode: boolean = false,
    voiceId: string = "Luna",
  ) {
    const res = await fetch(`${API_BASE}/companion/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "default-user",
        message,
        conversation_history: history.map((h) => ({
          sender: h.sender,
          content: h.content,
        })),
        user_preferences: userPreferences,
        allow_memory: allowMemory,
        voice_mode: voiceMode,
        voice_id: voiceId,
      }),
    });
    if (!res.ok) throw new Error("Companion service unavailable");
    return res.json();
  },

  async synthesizeSpeech(text: string, voiceId: string = "Luna") {
    const res = await fetch(`${API_BASE}/companion/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice_id: voiceId }),
    });
    if (!res.ok) throw new Error("TTS service unavailable");
    return res.json();
  },

  async getVoiceSession() {
    const res = await fetch(`${API_BASE}/companion/voice-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: "default-user" }),
    });
    if (!res.ok) throw new Error("Voice session unavailable");
    return res.json();
  },

  // Memories
  async getMemories(): Promise<{ memories: MemoryItem[] }> {
    const res = await fetch(`${API_BASE}/memory?user_id=default-user`);
    if (!res.ok) throw new Error("Failed to load memories");
    return res.json();
  },

  async addMemory(
    category: string,
    content: string,
  ): Promise<{ memory: MemoryItem }> {
    const res = await fetch(`${API_BASE}/memory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "default-user",
        category,
        content,
        importance: 3,
      }),
    });
    if (!res.ok) throw new Error("Failed to save memory");
    return res.json();
  },

  async deleteMemory(id: string) {
    const res = await fetch(`${API_BASE}/memory/${id}?user_id=default-user`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to forget memory");
    return res.json();
  },

  async clearMemories() {
    const res = await fetch(`${API_BASE}/memory?user_id=default-user`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to clear memories");
    return res.json();
  },

  // Journal
  async getJournal(): Promise<{ entries: JournalEntry[] }> {
    const res = await fetch(`${API_BASE}/journal?user_id=default-user`);
    if (!res.ok) throw new Error("Failed to load journal");
    return res.json();
  },

  async createJournal(
    title: string,
    content: string,
    mood?: string,
    tags: string[] = [],
  ): Promise<{ entry: JournalEntry }> {
    const res = await fetch(`${API_BASE}/journal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "default-user",
        title,
        content,
        mood,
        tags,
        is_private: true,
      }),
    });
    if (!res.ok) throw new Error("Failed to save journal entry");
    return res.json();
  },

  async reflectJournal(
    entryId: string,
  ): Promise<{ entry: JournalEntry; reflection: any }> {
    const res = await fetch(`${API_BASE}/journal/${entryId}/reflect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: "default-user", mode: "understand" }),
    });
    if (!res.ok) throw new Error("Failed to generate reflection");
    return res.json();
  },

  async deleteJournal(entryId: string) {
    const res = await fetch(
      `${API_BASE}/journal/${entryId}?user_id=default-user`,
      {
        method: "DELETE",
      },
    );
    if (!res.ok) throw new Error("Failed to delete journal entry");
    return res.json();
  },

  // Mood
  async getMoodHistory(days = 30) {
    const res = await fetch(
      `${API_BASE}/mood?user_id=default-user&days=${days}`,
    );
    if (!res.ok) throw new Error("Failed to load mood history");
    return res.json();
  },

  async logMood(mood_state: string, intensity = 3, note?: string) {
    const res = await fetch(`${API_BASE}/mood`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "default-user",
        mood_state,
        intensity,
        note,
      }),
    });
    if (!res.ok) throw new Error("Failed to log check-in");
    return res.json();
  },

  // Wellness
  async recordWellness(
    activity_type: string,
    duration_seconds = 120,
    before_intensity?: number,
    after_intensity?: number,
    feedback_note?: string,
  ) {
    const res = await fetch(`${API_BASE}/wellness/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "default-user",
        activity_type,
        duration_seconds,
        before_intensity,
        after_intensity,
        feedback_note,
      }),
    });
    if (!res.ok) throw new Error("Failed to record wellness session");
    return res.json();
  },

  // Gita / Spiritual
  async getGitaVerses(chapter?: number): Promise<{ verses: GitaVerse[] }> {
    const url = chapter
      ? `${API_BASE}/gita/verses?chapter=${chapter}`
      : `${API_BASE}/gita/verses`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load Gita verses");
    return res.json();
  },

  async askGita(query: string) {
    const res = await fetch(`${API_BASE}/gita/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error("Gita reflection service unavailable");
    return res.json();
  },

  async getBookmarks() {
    const res = await fetch(`${API_BASE}/gita/bookmarks?user_id=default-user`);
    if (!res.ok) throw new Error("Failed to load bookmarks");
    return res.json();
  },

  async bookmarkVerse(chapter: number, verse: number, note?: string) {
    const res = await fetch(`${API_BASE}/gita/bookmark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "default-user",
        chapter,
        verse,
        personal_note: note,
      }),
    });
    if (!res.ok) throw new Error("Failed to bookmark verse");
    return res.json();
  },

  // Insights
  async getInsights() {
    const res = await fetch(`${API_BASE}/insights?user_id=default-user`);
    if (!res.ok) throw new Error("Failed to load insights");
    return res.json();
  },

  // Privacy & Data
  async exportData() {
    const res = await fetch(`${API_BASE}/privacy/export?user_id=default-user`);
    if (!res.ok) throw new Error("Failed to export data");
    return res.json();
  },

  async purgeAllData() {
    const res = await fetch(
      `${API_BASE}/privacy/delete-all?user_id=default-user`,
      {
        method: "POST",
      },
    );
    if (!res.ok) throw new Error("Failed to purge data");
    return res.json();
  },
};
