import React, { useState, useEffect } from "react";
import {
  PenTool,
  Sparkles,
  BookOpen,
  Calendar,
  Trash2,
  X,
  ArrowRight,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { api, JournalEntry } from "../../utils/api";

export const JournalView: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("okay");
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isReflecting, setIsReflecting] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    loadJournal();
    // Check if there was a quick thought passed from Home
    const initialThought = sessionStorage.getItem("nirvana_initial_journal");
    if (initialThought) {
      setContent(initialThought);
      setIsWriting(true);
      sessionStorage.removeItem("nirvana_initial_journal");
    }
  }, []);

  const loadJournal = async () => {
    try {
      const data = await api.getJournal();
      setEntries(data.entries || []);
    } catch (e) {
      console.log("Error loading journal entries");
    }
  };

  const handleSave = async (withReflection = false) => {
    if (!content.trim()) return;

    setIsSaving(true);
    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    try {
      const { entry } = await api.createJournal(
        title || "Reflective Thought",
        content,
        mood,
        tags,
      );

      if (withReflection) {
        setIsReflecting(true);
        const reflected = await api.reflectJournal(entry.id);
        entry.reflection = reflected.reflection;
        setIsReflecting(false);
      }

      setEntries((prev) => [entry, ...prev]);
      setIsWriting(false);
      setTitle("");
      setContent("");
      setTagInput("");
    } catch (e) {
      console.log("Error creating journal");
    } finally {
      setIsSaving(false);
      setIsReflecting(false);
    }
  };

  const handleReflectExisting = async (entry: JournalEntry) => {
    setIsReflecting(true);
    try {
      const reflected = await api.reflectJournal(entry.id);
      const updated = { ...entry, reflection: reflected.reflection };
      setEntries((prev) => prev.map((e) => (e.id === entry.id ? updated : e)));
      setSelectedEntry(updated);
    } catch (e) {
      console.log("Error reflecting on entry");
    } finally {
      setIsReflecting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteJournal(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (selectedEntry?.id === id) {
        setSelectedEntry(null);
      }
    } catch (e) {
      console.log("Error deleting journal entry");
    }
  };

  const moodEmojis: Record<string, string> = {
    good: "☀️",
    okay: "🌤️",
    low: "🌧️",
    heavy: "☁️",
    uncertain: "🌿",
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pb-20 space-y-10">
      {/* 1. Header */}
      <div className="zone-honey-cream rounded-4xl p-8 sm:p-12 border border-[#E7E5E4] dark:border-[#D97706]/25 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors">
        <div>
          <span className="text-xs font-bold text-[#D97706] dark:text-[#D97706] uppercase tracking-widest block mb-1">
            Private Notebook
          </span>
          <h1 className="font-display text-4xl sm:text-5xl text-[#1C1917] dark:text-[#F1EFE8] font-normal tracking-tight">
            Some things are easier <br />
            <span className="italic text-[#D97706] dark:text-[#D97706]">
              when you write them down.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#57534E] dark:text-slate-300 font-light mt-2 max-w-xl leading-relaxed">
            This space is entirely yours. Spill your racing thoughts without
            formatting, audience, or judgment.
          </p>
        </div>

        {!isWriting && (
          <button
            onClick={() => setIsWriting(true)}
            className="px-6 py-3.5 rounded-full btn-glow-coral text-xs sm:text-sm font-semibold shadow-sm transition-all self-start sm:self-auto flex items-center gap-2 cursor-pointer"
          >
            <PenTool className="w-4 h-4" />
            <span>Write a thought</span>
          </button>
        )}
      </div>

      {/* 2. Writing Notebook Surface */}
      {isWriting && (
        <div className="nirvana-glass rounded-3xl p-6 sm:p-8 border border-[#E7E5E4] dark:border-[#232A40] shadow-editorial space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4] dark:border-[#232A40]">
            <span className="text-xs font-medium text-[#4F46E5] dark:text-[#4F46E5] uppercase tracking-wider flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5" />
              Private Notebook
            </span>
            <button
              onClick={() => setIsWriting(false)}
              className="p-1.5 rounded-full text-[#78716C] dark:text-slate-300 hover:text-[#1C1917] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A title for this moment (optional)"
            className="w-full text-lg sm:text-xl font-display text-[#1C1917] dark:text-[#F1EFE8] placeholder-[#78716C] dark:placeholder-[#64748B] bg-transparent focus:outline-none font-medium"
          />

          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? Spill your thoughts freely without trying to sound good..."
            className="w-full p-4 rounded-2xl bg-white/80 dark:bg-[#131826]/80 border border-[#E7E5E4] dark:border-[#4F46E5]/25 text-sm sm:text-base text-[#1C1917] dark:text-[#F1EFE8] placeholder-[#78716C] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5] transition-all resize-none font-light leading-relaxed"
          />

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            {/* Mood selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#57534E] dark:text-slate-300 font-light">
                Mood:
              </span>
              <div className="flex items-center gap-1.5">
                {Object.entries(moodEmojis).map(([key, emoji]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMood(key)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-all cursor-pointer ${
                      mood === key
                        ? "bg-[#EEF2FF] dark:bg-[#45423E] border-[#4F46E5] dark:border-[#4F46E5] scale-105 shadow-sm"
                        : "bg-white/80 dark:bg-white/10 border-[#E7E5E4] dark:border-[#232A40] opacity-70 hover:opacity-100"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsWriting(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#78716C] dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                Discard
              </button>

              <button
                type="button"
                disabled={!content.trim() || isSaving}
                onClick={() => handleSave(false)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-[#1E1935] text-[#1C1917] dark:text-[#F1EFE8] hover:text-[#4F46E5] border border-[#E7E5E4] dark:border-[#4F46E5]/30 text-xs font-medium shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                Save
              </button>

              <button
                type="button"
                disabled={!content.trim() || isSaving}
                onClick={() => handleSave(true)}
                className="px-5 py-2 rounded-xl btn-glow-lavender text-xs font-medium transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Save & Reflect</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Past Entries List */}
      <div className="space-y-4">
        <h2 className="font-display text-lg sm:text-xl text-[#1C1917] dark:text-[#F1EFE8] font-medium px-1">
          Your Reflections
        </h2>

        {entries.length === 0 ? (
          /* Empty State */
          <div className="nirvana-glass rounded-3xl p-12 text-center border border-[#E7E5E4] dark:border-[#232A40] space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EEF2FF] dark:bg-[#45423E] text-[#4F46E5] dark:text-[#4F46E5] flex items-center justify-center mb-2 shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-medium text-[#1C1917] dark:text-[#F1EFE8]">
              Nothing written yet.
            </h3>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-slate-300 font-light max-w-sm mx-auto leading-relaxed">
              Whenever you're ready, this space is yours. Write as little or as
              much as feels natural.
            </p>
            <button
              onClick={() => setIsWriting(true)}
              className="mt-3 px-5 py-2 rounded-full bg-white dark:bg-[#1E1935] text-xs font-medium text-[#4F46E5] dark:text-[#4F46E5] border border-[#4F46E5]/30 hover:bg-[#EEF2FF] dark:hover:bg-[#45423E] transition-colors shadow-xs"
            >
              Start writing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="nirvana-glass rounded-3xl p-6 border border-[#E7E5E4] dark:border-[#232A40] shadow-editorial nirvana-glass-hover cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#78716C] dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {moodEmojis[entry.mood || "okay"] || "🌤️"}
                      </span>
                      <span className="font-light">
                        {new Date(entry.created_at).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </span>
                    </div>
                    {entry.reflection && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#4F46E5] dark:text-[#4F46E5] bg-[#EEF2FF] dark:bg-[#45423E] px-2.5 py-0.5 rounded-full font-medium border border-[#4F46E5]/20">
                        <Sparkles className="w-2.5 h-2.5" />
                        Reflected
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-base font-semibold text-[#1C1917] dark:text-[#F1EFE8] group-hover:text-[#4F46E5] dark:group-hover:text-[#4F46E5] transition-colors line-clamp-1">
                    {entry.title || "Untitled Thought"}
                  </h3>

                  <p className="text-xs text-[#57534E] dark:text-slate-300 font-light line-clamp-3 leading-relaxed">
                    {entry.content}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-[#E7E5E4] dark:border-[#232A40] flex items-center justify-between text-xs text-[#4F46E5] dark:text-[#4F46E5] font-medium">
                  <span className="group-hover:underline">Read entry</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Distraction-Free Reading / Reflection Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="nirvana-glass rounded-3xl max-w-2xl w-full p-6 sm:p-10 border border-[#E7E5E4] dark:border-white/15 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6 relative bg-white/95 dark:bg-[#131826]/95">
            {/* Modal top controls */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E5E4] dark:border-[#232A40]">
              <div className="flex items-center gap-2 text-xs text-[#78716C] dark:text-slate-300">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {new Date(selectedEntry.created_at).toLocaleDateString(
                    undefined,
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </span>
                <span className="text-sm ml-1">
                  {moodEmojis[selectedEntry.mood || "okay"]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(selectedEntry.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-[#1C1917] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl sm:text-3xl text-[#1C1917] dark:text-[#F1EFE8] font-normal">
                {selectedEntry.title || "Untitled Thought"}
              </h2>
              <p className="text-sm sm:text-base text-[#1C1917] dark:text-[#F1EFE8] font-light leading-relaxed whitespace-pre-wrap">
                {selectedEntry.content}
              </p>
            </div>

            {/* AI Gentle Reflection Card */}
            {selectedEntry.reflection ? (
              <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-[#EEF2FF]/70 dark:bg-[#251B40] border border-[#4F46E5]/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#4F46E5] dark:text-slate-300">
                  <Sparkles className="w-4 h-4" />
                  <span>Gentle Reflection from Nirvana</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-white/80 dark:bg-white/10">
                    <span className="font-medium text-[#57534E] dark:text-slate-300 block">
                      What felt present:
                    </span>
                    <span className="text-[#1C1917] dark:text-[#F1EFE8] mt-0.5 block font-light">
                      {selectedEntry.reflection.feeling}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/80 dark:bg-white/10">
                    <span className="font-medium text-[#57534E] dark:text-slate-300 block">
                      What may need care:
                    </span>
                    <span className="text-[#1C1917] dark:text-[#F1EFE8] mt-0.5 block font-light">
                      {selectedEntry.reflection.needs}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#1C1917] dark:text-[#F1EFE8] italic font-light pt-1">
                  "{selectedEntry.reflection.thought}"
                </p>
              </div>
            ) : (
              <div className="pt-4 border-t border-[#E7E5E4] dark:border-[#232A40] flex items-center justify-between">
                <span className="text-xs text-[#57534E] dark:text-slate-300 font-light">
                  Want a compassionate reflection on this thought?
                </span>
                <button
                  onClick={() => handleReflectExisting(selectedEntry)}
                  disabled={isReflecting}
                  className="px-4 py-2 rounded-xl btn-glow-lavender text-xs font-medium transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {isReflecting ? "Reflecting..." : "Reflect with Nirvana"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

