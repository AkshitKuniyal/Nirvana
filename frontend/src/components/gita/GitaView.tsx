import React, { useState, useEffect } from "react";
import {
  Compass,
  Search,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Sun,
  Flame,
  Check,
} from "lucide-react";
import { api, GitaVerse } from "../../utils/api";

export const GitaView: React.FC = () => {
  const [query, setQuery] = useState("");
  const [ragResult, setRagResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verses, setVerses] = useState<GitaVerse[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"ask" | "browse" | "saved">("ask");
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "hi">("en");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadVerses();
    loadBookmarks();
  }, []);

  const loadVerses = async () => {
    try {
      const data = await api.getGitaVerses();
      setVerses(data.verses || []);
    } catch (e) {
      console.log("Error loading verses");
    }
  };

  const loadBookmarks = async () => {
    try {
      const data = await api.getBookmarks();
      setBookmarks(data.bookmarks || []);
    } catch (e) {
      console.log("Error loading bookmarks");
    }
  };

  const handleAsk = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim() || isLoading) return;

    setIsLoading(true);
    setRagResult(null);

    try {
      const data = await api.askGita(q);
      setRagResult(data);
    } catch (e) {
      alert("Could not retrieve reflections right now.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async (
    chapter: number,
    verse: number,
    note?: string,
  ) => {
    try {
      await api.bookmarkVerse(
        chapter,
        verse,
        note || query || "Spiritual contemplation",
      );
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      loadBookmarks();
    } catch (e) {
      console.log("Error bookmarking verse");
    }
  };

  const suggestionChips = [
    {
      label: "Fear",
      query: "I feel gripped by fear and worry about what is coming",
    },
    {
      label: "Purpose",
      query: "I feel lost about my life purpose and what I should be doing",
    },
    {
      label: "Failure",
      query: "I am terrified of failing and letting people down",
    },
    {
      label: "Attachment",
      query: "How do I let go of attachment to results and outcomes?",
    },
    {
      label: "Anger",
      query: "I have intense anger and frustration eating away at my peace",
    },
    {
      label: "Uncertainty",
      query: "How do I find steadiness when everything feels uncertain?",
    },
  ];

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pb-20 space-y-10">
      {/* 1. Header */}
      <div className="zone-wisdom-gold rounded-4xl p-8 sm:p-12 border border-[#E7E5E4] dark:border-[#D97706]/25 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#D97706]/40 text-xs text-[#D97706] font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Spiritual Corner</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-[#1C1917] dark:text-[#F1EFE8] font-normal tracking-tight">
            Sometimes wisdom comes <br />
            <span className="italic text-[#D97706]">from looking inward.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#57534E] dark:text-slate-300 font-light mt-2 max-w-xl leading-relaxed">
            Timeless verses from the Bhagavad Gita on duty, fear, attachment,
            and quiet purpose. Grounded in canonical texts, interpreted for
            modern challenges without dogma.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-full bg-white/90 dark:bg-[#131826] p-1.5 border border-[#E7E5E4] dark:border-[#232A40] shadow-sm self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveTab("ask")}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === "ask"
                ? "bg-[#D97706] text-white shadow-sm"
                : "text-[#767185] dark:text-slate-300 hover:text-[#1F1D2B] dark:hover:text-white"
            }`}
          >
            Ask the Gita
          </button>
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === "browse"
                ? "bg-[#D97706] text-white shadow-sm"
                : "text-[#767185] dark:text-slate-300 hover:text-[#1F1D2B] dark:hover:text-white"
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === "saved"
                ? "bg-[#D97706] text-white shadow-sm"
                : "text-[#767185] dark:text-slate-300 hover:text-[#1F1D2B] dark:hover:text-white"
            }`}
          >
            Saved ({bookmarks.length})
          </button>
        </div>
      </div>

      {/* 2. ASK THE GITA TAB */}
      {activeTab === "ask" && (
        <div className="space-y-6">
          {/* Main Search Glass Card */}
          <div className="bg-white/90 dark:bg-[#131826]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-[#E7E5E4] dark:border-[#232A40] shadow-editorial space-y-4">
            <h2 className="font-serif text-xl font-medium text-[#1C1917] dark:text-[#F1EFE8]">
              Ask the Gita
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-slate-300 font-light">
              Speak whatever burden, doubt, or question is on your heart.
              Nirvana will retrieve a canonical verse directly addressing that
              inner state.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk();
              }}
              className="relative flex items-center pt-1"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. I'm anxious about results, or feeling paralyzed by doubt..."
                className="w-full py-4 pl-5 pr-28 rounded-2xl bg-white/80 dark:bg-[#2A2826]/80 border border-[#E2DEEE] dark:border-[#4F46E5]/25 text-sm text-[#1C1917] dark:text-[#F1EFE8] placeholder-[#9E9AA7] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5] shadow-inner font-light"
              />

              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="absolute right-2.5 px-4 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-medium shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isLoading ? "Seeking..." : "Seek"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Suggestion Chips */}
            <div className="pt-2">
              <span className="text-[11px] text-[#9E9AA7] font-light block mb-2">
                Or explore a common human struggle:
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestionChips.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(chip.query);
                      handleAsk(chip.query);
                    }}
                    className="px-3 py-1.5 rounded-full bg-white/70 dark:bg-white/10 hover:bg-[#FFFDF6] dark:hover:bg-white/20 border border-[#E2DEEE] dark:border-white/15 hover:border-[#FCD34D] text-xs text-[#6F6B7A] dark:text-slate-300 hover:text-[#977313] dark:hover:text-[#D97706] transition-all shadow-sm cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Presentation Card */}
          {ragResult && ragResult.found && ragResult.verse && (
            <div className="nirvana-glass rounded-3xl p-6 sm:p-10 border border-white/90 shadow-glass-hover space-y-6 animate-in fade-in duration-300">
              {/* Verse Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E2DEEE]/60 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-[#FFF4D8] text-[#977313] text-xs font-semibold border border-[#FCD34D]/40">
                    Bhagavad Gita {ragResult.verse.chapter}.
                    {ragResult.verse.verse}
                  </span>
                  <span className="text-xs text-[#4F46E5] flex items-center gap-1 font-light">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Canonical
                  </span>
                  {ragResult.ml_confidence && (
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[11px] font-medium border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      ML Match: {ragResult.ml_confidence}
                    </span>
                  )}
                </div>

                <button
                  onClick={() =>
                    handleBookmark(
                      ragResult.verse.chapter,
                      ragResult.verse.verse,
                    )
                  }
                  className="flex items-center gap-1.5 text-xs text-[#4F46E5] hover:text-[#2D6A4F] font-medium px-3 py-1.5 rounded-full bg-white border border-[#E2DEEE] hover:border-[#4F46E5]/40 shadow-sm transition-all"
                >
                  {savedSuccess ? (
                    <BookmarkCheck className="w-3.5 h-3.5 text-[#4F46E5]" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5" />
                  )}
                  <span>{savedSuccess ? "Saved" : "Save Verse"}</span>
                </button>
              </div>

              {ragResult.matched_features && ragResult.matched_features.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-[#78716C] dark:text-slate-400 flex-wrap">
                  <span className="font-medium text-[#4F46E5] text-[11px]">ML Semantic Features:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {ragResult.matched_features.map((feat: string, fi: number) => (
                      <span key={fi} className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 text-[#57534E] dark:text-slate-300 font-mono text-[10px] border border-stone-200 dark:border-slate-700">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sanskrit Shloka */}
              <div className="p-6 rounded-2xl bg-[#FFFDF6] border border-[#FCD34D]/20 text-center space-y-2">
                <p className="font-sanskrit text-lg sm:text-xl text-[#1C1917] dark:text-[#F1EFE8] font-semibold tracking-wide leading-relaxed">
                  {ragResult.verse.sanskrit}
                </p>
                {ragResult.verse.transliteration && (
                  <p className="text-xs sm:text-sm text-[#57534E] dark:text-slate-300 italic font-light">
                    {ragResult.verse.transliteration}
                  </p>
                )}
              </div>

              {/* Translation */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#977313] uppercase tracking-wider block">
                  Translation
                </span>
                <p className="text-sm sm:text-base text-[#1C1917] dark:text-[#F1EFE8] font-light leading-relaxed">
                  "{ragResult.verse.translation_en}"
                </p>
              </div>

              {/* Why this may resonate (Purport) */}
              <div className="space-y-2 pt-2 border-t border-[#E2DEEE]/60">
                <span className="text-xs font-semibold text-[#4F46E5] uppercase tracking-wider block">
                  Why this may resonate
                </span>
                <p className="text-xs sm:text-sm text-[#57534E] dark:text-slate-300 font-light leading-relaxed">
                  {ragResult.verse.purport}
                </p>
              </div>

              {/* Reflect on this (Grounded AI Reflection) */}
              {ragResult.reflection && (
                <div className="p-5 sm:p-6 rounded-2xl bg-[#EEF2FF]/50 border border-[#4F46E5]/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4F46E5]">
                    <Sparkles className="w-4 h-4" />
                    <span>Reflection for You</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#1C1917] dark:text-[#F1EFE8] font-light leading-relaxed whitespace-pre-wrap">
                    {ragResult.reflection}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. BROWSE TAB */}
      {activeTab === "browse" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {verses.map((v, i) => (
            <div
              key={i}
              className="bg-white/90 dark:bg-[#131826]/90 backdrop-blur-xl rounded-3xl p-6 border border-[#E7E5E4] dark:border-[#232A40] shadow-editorial space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4D8] text-[#977313] font-semibold">
                  Chapter {v.chapter}, Verse {v.verse}
                </span>
                <button
                  onClick={() => handleBookmark(v.chapter, v.verse)}
                  className="text-[#4F46E5] hover:text-[#2D6A4F]"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="font-sanskrit text-sm text-[#1C1917] dark:text-[#F1EFE8] font-medium">
                {v.sanskrit}
              </p>
              <p className="text-xs text-[#57534E] dark:text-slate-300 font-light line-clamp-3">
                {v.translation_en}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 4. SAVED TAB */}
      {activeTab === "saved" && (
        <div className="space-y-4">
          {bookmarks.length === 0 ? (
            <div className="nirvana-glass rounded-3xl p-10 text-center border border-white/80 space-y-2">
              <Bookmark className="w-8 h-8 text-[#9E9AA7] mx-auto" />
              <h3 className="font-serif text-lg font-medium text-[#1C1917] dark:text-[#F1EFE8]">
                No saved verses yet.
              </h3>
              <p className="text-xs text-[#57534E] dark:text-slate-300 font-light">
                When a verse touches what you are carrying, save it to return
                whenever you need steadying.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bookmarks.map((b, i) => (
                <div
                  key={i}
                  className="bg-white/90 dark:bg-[#131826]/90 backdrop-blur-xl rounded-3xl p-6 border border-[#E7E5E4] dark:border-[#232A40] shadow-editorial space-y-2"
                >
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFF4D8] text-[#977313] text-xs font-semibold inline-block">
                    Chapter {b.chapter}, Verse {b.verse}
                  </span>
                  <p className="text-xs text-[#57534E] dark:text-slate-300 italic font-light">
                    Note: "{b.user_note || "Saved verse"}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


