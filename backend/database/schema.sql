-- Nirvana Database Schema
-- Supabase PostgreSQL with strict Row Level Security (RLS)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    preferred_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 3. USER PREFERENCES
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    interaction_mode TEXT DEFAULT 'both' CHECK (interaction_mode IN ('talk', 'type', 'both')),
    spiritual_guidance_enabled BOOLEAN DEFAULT FALSE,
    spiritual_preference TEXT DEFAULT 'gita',
    ambient_sound_volume FLOAT DEFAULT 0.5,
    preferred_sound TEXT DEFAULT 'rain',
    reduce_animations BOOLEAN DEFAULT FALSE,
    allow_memory_extraction BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_pref UNIQUE (user_id)
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own preferences"
    ON public.user_preferences FOR ALL
    USING (auth.uid() = user_id);

-- 4. CONVERSATIONS & MESSAGES
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'Reflective Moment',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own conversations"
    ON public.conversations FOR ALL
    USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'companion', 'system')),
    content TEXT NOT NULL,
    action_type TEXT DEFAULT 'RESPOND',
    metadata JSONB DEFAULT '{}'::jsonb,
    is_ephemeral BOOLEAN DEFAULT FALSE, -- for "don't remember this"
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and manage own messages"
    ON public.messages FOR ALL
    USING (auth.uid() = user_id);

-- 5. STRUCTURED MEMORIES
CREATE TABLE IF NOT EXISTS public.memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN (
        'preference', 
        'personal_context', 
        'recurring_concern', 
        'goal', 
        'helpful_activity', 
        'spiritual_preference', 
        'communication_style'
    )),
    content TEXT NOT NULL,
    source TEXT DEFAULT 'conversation' CHECK (source IN ('conversation', 'journal', 'user_explicit')),
    confidence FLOAT DEFAULT 0.85,
    importance INT DEFAULT 3 CHECK (importance BETWEEN 1 AND 5),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and manage own memories"
    ON public.memories FOR ALL
    USING (auth.uid() = user_id);

-- 6. JOURNAL ENTRIES ("Let It Out")
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT NOT NULL,
    mood TEXT,
    tags TEXT[] DEFAULT '{}',
    is_private BOOLEAN DEFAULT TRUE,
    reflection JSONB, -- { "feeling": "...", "trigger": "...", "thought": "...", "needs": "..." }
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own journal entries"
    ON public.journal_entries FOR ALL
    USING (auth.uid() = user_id);

-- 7. MOOD CHECK-INS
CREATE TABLE IF NOT EXISTS public.mood_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mood_state TEXT NOT NULL CHECK (mood_state IN ('good', 'okay', 'meh', 'low', 'overwhelmed')),
    intensity INT DEFAULT 3 CHECK (intensity BETWEEN 1 AND 5),
    note TEXT,
    context_tag TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own mood entries"
    ON public.mood_entries FOR ALL
    USING (auth.uid() = user_id);

-- 8. WELLNESS SESSIONS & FEEDBACK
CREATE TABLE IF NOT EXISTS public.wellness_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'breathing_478', 
        'breathing_box', 
        'grounding_54321', 
        'calm_reset', 
        'ambient_sounds', 
        'quiet_mode'
    )),
    duration_seconds INT DEFAULT 120,
    before_intensity INT CHECK (before_intensity BETWEEN 1 AND 5),
    after_intensity INT CHECK (after_intensity BETWEEN 1 AND 5),
    feedback_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.wellness_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wellness sessions"
    ON public.wellness_sessions FOR ALL
    USING (auth.uid() = user_id);

-- 9. USER GOALS
CREATE TABLE IF NOT EXISTS public.user_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'mindfulness',
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own goals"
    ON public.user_goals FOR ALL
    USING (auth.uid() = user_id);

-- 10. GITA BOOKMARKS & SAVED VERSES
CREATE TABLE IF NOT EXISTS public.saved_verses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chapter INT NOT NULL,
    verse INT NOT NULL,
    sanskrit TEXT NOT NULL,
    translation_en TEXT NOT NULL,
    personal_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_verse UNIQUE (user_id, chapter, verse)
);

ALTER TABLE public.saved_verses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saved verses"
    ON public.saved_verses FOR ALL
    USING (auth.uid() = user_id);

-- 11. SAFETY AUDIT EVENTS
CREATE TABLE IF NOT EXISTS public.safety_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    trigger_category TEXT NOT NULL,
    action_taken TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.safety_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own safety events"
    ON public.safety_events FOR SELECT
    USING (auth.uid() = user_id);

-- INDEXES for High-Performance Queries
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_memories_user ON public.memories(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_journal_user ON public.journal_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_user ON public.mood_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wellness_user ON public.wellness_sessions(user_id, created_at DESC);
