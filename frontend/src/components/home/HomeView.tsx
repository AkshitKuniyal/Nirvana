import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  BookOpen,
  Wind,
  Compass,
  Sparkles,
  Mic,
  PenTool,
  ArrowRight,
  Brain,
  Volume2,
  CheckCircle2,
  RefreshCw,
  Sun,
  Cloud,
  CloudRain,
  Leaf,
  LineChart,
  Shield,
} from "lucide-react";
import { api, MemoryItem } from "../../utils/api";

interface HomeViewProps {
  onNavigate: (view: string) => void;
  openAudioModal: () => void;
  userName?: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  openAudioModal,
  userName,
}) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(() => {
    return sessionStorage.getItem("nirvana_locked_mood") || null;
  });
  const [isMoodLocked, setIsMoodLocked] = useState<boolean>(() => {
    return Boolean(sessionStorage.getItem("nirvana_locked_mood"));
  });
  const [quickThought, setQuickThought] = useState("");
  const [recentMemory, setRecentMemory] = useState<MemoryItem | null>(null);
  const [moodSavedToast, setMoodSavedToast] = useState(false);

  useEffect(() => {
    api
      .getMemories()
      .then((data) => {
        if (data.memories && data.memories.length > 0) {
          setRecentMemory(data.memories[0]);
        }
      })
      .catch(() => {});
  }, []);

  const handleMoodSelect = async (moodId: string) => {
    setSelectedMood(moodId);
    setIsMoodLocked(true);
    sessionStorage.setItem("nirvana_locked_mood", moodId);
    setMoodSavedToast(true);
    setTimeout(() => setMoodSavedToast(false), 4000);
    try {
      await api.logMood(moodId);
    } catch (e) {
      console.log("Mood logged");
    }
  };

  const handleResetMood = () => {
    sessionStorage.removeItem("nirvana_locked_mood");
    setIsMoodLocked(false);
    setSelectedMood(null);
  };

  const handleQuickTalk = () => {
    if (quickThought.trim()) {
      sessionStorage.setItem("nirvana_initial_msg", quickThought.trim());
    }
    onNavigate("companion");
  };

  const handleQuickWrite = () => {
    if (quickThought.trim()) {
      sessionStorage.setItem("nirvana_initial_journal", quickThought.trim());
    }
    onNavigate("journal");
  };

  const moodCards = [
    {
      id: "good",
      label: "Feeling good",
      Icon: Sun,
      accent: "text-amber-500",
      iconBg: "bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-800/30",
      activeBorder: "border-amber-300 dark:border-amber-600",
      activeBg: "bg-amber-50/60 dark:bg-amber-950/20",
      sub: "Carry this brightness forward",
    },
    {
      id: "heavy",
      label: "A little heavy",
      Icon: Cloud,
      accent: "text-indigo-500",
      iconBg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-800/30",
      activeBorder: "border-indigo-300 dark:border-indigo-600",
      activeBg: "bg-indigo-50/60 dark:bg-indigo-950/20",
      sub: "Gently unburden what weighs on you",
    },
    {
      id: "overwhelmed",
      label: "Overwhelmed",
      Icon: CloudRain,
      accent: "text-rose-500",
      iconBg: "bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-800/30",
      activeBorder: "border-rose-300 dark:border-rose-600",
      activeBg: "bg-rose-50/60 dark:bg-rose-950/20",
      sub: "Take quiet shelter right here",
    },
    {
      id: "unsure",
      label: "Not sure",
      Icon: Leaf,
      accent: "text-emerald-500",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-800/30",
      activeBorder: "border-emerald-300 dark:border-emerald-600",
      activeBg: "bg-emerald-50/60 dark:bg-emerald-950/20",
      sub: "Just resting in the moment",
    },
  ];

  const chosenMood = selectedMood
    ? moodCards.find((m) => m.id === selectedMood)
    : null;

  const pathways = [
    {
      id: "companion",
      Icon: MessageCircle,
      title: "Your Space",
      desc: "Talk with a companion who listens deeply and holds quiet space for you.",
      cta: "Open conversation",
      iconBg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-800/30",
      accent: "text-indigo-500",
      ctaColor: "text-indigo-600 dark:text-indigo-400",
      hoverBorder: "hover:border-indigo-300 dark:hover:border-indigo-700/60",
    },
    {
      id: "journal",
      Icon: BookOpen,
      title: "Private Journal",
      desc: "A quiet notebook for uncensored thoughts, with optional gentle reflections.",
      cta: "Write a thought",
      iconBg: "bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-800/30",
      accent: "text-amber-500",
      ctaColor: "text-amber-600 dark:text-amber-400",
      hoverBorder: "hover:border-amber-300 dark:hover:border-amber-700/60",
    },
    {
      id: "wellness",
      Icon: Wind,
      title: "Breathe & Ground",
      desc: "4-7-8 breathing and 5-4-3-2-1 grounding to settle an overwhelmed mind.",
      cta: "Start a 2-min pause",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-800/30",
      accent: "text-emerald-500",
      ctaColor: "text-emerald-600 dark:text-emerald-400",
      hoverBorder: "hover:border-emerald-300 dark:hover:border-emerald-700/60",
    },
    {
      id: "gita",
      Icon: Compass,
      title: "Wisdom Corner",
      desc: "Explore timeless Bhagavad Gita verses on duty, letting go, and inner peace.",
      cta: "Ask the Gita",
      iconBg: "bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-800/30",
      accent: "text-rose-500",
      ctaColor: "text-rose-600 dark:text-rose-400",
      hoverBorder: "hover:border-rose-300 dark:hover:border-rose-700/60",
    },
    {
      id: "insights",
      Icon: LineChart,
      title: "Understand Yourself",
      desc: "Non-clinical reflective patterns from your 7, 30, and 90-day check-ins.",
      cta: "See your patterns",
      iconBg: "bg-violet-50 dark:bg-violet-950/40 border-violet-100 dark:border-violet-800/30",
      accent: "text-violet-500",
      ctaColor: "text-violet-600 dark:text-violet-400",
      hoverBorder: "hover:border-violet-300 dark:hover:border-violet-700/60",
    },
    {
      id: "memory",
      Icon: Brain,
      title: "Your Memory",
      desc: "View, edit, or forget what Nirvana holds about you. Full control, always.",
      cta: "Manage memories",
      iconBg: "bg-stone-100 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700",
      accent: "text-stone-500",
      ctaColor: "text-stone-600 dark:text-stone-400",
      hoverBorder: "hover:border-stone-400 dark:hover:border-stone-600",
    },
  ];

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pb-20 space-y-8">

      {/* ── Hero Section ── */}
      <section className="relative w-full rounded-4xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm">
        {/* Gradient background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, #eef2ff 0%, #faf8f5 40%, #fdf4ff 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none dark:block hidden"
          style={{
            background:
              "linear-gradient(135deg, #1e1b4b 0%, #0f1117 45%, #1a0d2e 100%)",
          }}
        />

        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 dark:opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #a5b4fc 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-15 dark:opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #c4b5fd 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

        <div className="relative z-10 p-8 sm:p-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-stone-900/60 backdrop-blur-sm border border-indigo-200/60 dark:border-indigo-800/40 text-xs font-medium text-indigo-700 dark:text-indigo-300 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Welcome home{userName && userName !== "Friend" ? `, ${userName}` : ""}</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-stone-900 dark:text-stone-100 font-normal tracking-tight leading-[1.1] mb-4 max-w-2xl">
            How are you arriving{" "}
            <span className="italic text-indigo-600 dark:text-indigo-400">
              into your space today?
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-md leading-relaxed mb-10">
            No pressure. Talk freely, write in quiet, breathe, or simply sit in stillness.
          </p>

          {/* ── Mood Cards ── */}
          {!isMoodLocked ? (
            <div className="animate-in fade-in duration-300">
              <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-3 uppercase tracking-wider">
                How are you feeling right now?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {moodCards.map((m) => {
                  const Icon = m.Icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleMoodSelect(m.id)}
                      className="group p-5 rounded-3xl border border-white/60 dark:border-stone-700/60 bg-white/70 dark:bg-stone-900/60 backdrop-blur-sm text-left hover:bg-white dark:hover:bg-stone-800/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col gap-3"
                    >
                      <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${m.iconBg}`}>
                        <Icon className={`w-5 h-5 ${m.accent}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 leading-tight">
                          {m.label}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                          {m.sub}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="inline-flex items-center gap-4 p-4 sm:p-5 rounded-3xl bg-white/80 dark:bg-stone-900/70 backdrop-blur-sm border border-stone-200/60 dark:border-stone-700/60 shadow-sm">
                {chosenMood && (
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${chosenMood.iconBg}`}>
                    <chosenMood.Icon className={`w-6 h-6 ${chosenMood.accent}`} />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Check-in saved
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {chosenMood?.label} — sanctuary is attuned.
                  </p>
                </div>
                <button
                  onClick={handleResetMood}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Change</span>
                </button>
              </div>
              {moodSavedToast && (
                <p className="mt-3 text-xs text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1.5 animate-in fade-in duration-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  Attuned with care. Your sanctuary is adjusted to this moment.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Quick Thought + Memory Row ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Thought box */}
        <div className="lg:col-span-7 bg-white dark:bg-[#181B24] rounded-4xl p-7 sm:p-9 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-normal text-stone-900 dark:text-stone-100">
                What's on your mind?
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Type a thought — talk through it or unpack it privately.
              </p>
            </div>
          </div>

          <textarea
            rows={4}
            value={quickThought}
            onChange={(e) => setQuickThought(e.target.value)}
            placeholder="Tell me what's going on, or simply how your heart feels right now..."
            className="w-full p-4 rounded-3xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 transition-all resize-none leading-relaxed"
          />

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleQuickTalk}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>Talk with Nirvana</span>
            </button>
            <button
              onClick={handleQuickWrite}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 active:scale-[0.98] text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PenTool className="w-4 h-4" />
              <span>Write in Journal</span>
            </button>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Memory card */}
          <div className="bg-white dark:bg-[#181B24] rounded-4xl p-7 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                Nirvana Remembers
              </span>
              <button
                onClick={() => onNavigate("memory")}
                className="text-xs text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-300 font-medium cursor-pointer transition-colors flex items-center gap-1"
              >
                <Shield className="w-3 h-3" />
                Manage
              </button>
            </div>
            {recentMemory ? (
              <>
                <p className="font-display italic text-lg text-stone-900 dark:text-stone-100 leading-relaxed">
                  "{recentMemory.content}"
                </p>
                <span className="text-xs text-stone-400 dark:text-stone-500 block">
                  Remembered to keep your space personal.
                </span>
              </>
            ) : (
              <>
                <h3 className="font-display text-xl text-stone-900 dark:text-stone-100 font-semibold">
                  A place that learns what soothes you
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  As you talk and write, Nirvana gently retains your preferences
                  so you never start from scratch.
                </p>
              </>
            )}
          </div>

          {/* Ambient sound CTA */}
          <div
            onClick={openAudioModal}
            className="group bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 rounded-4xl p-6 border border-emerald-200/80 dark:border-emerald-800/40 shadow-sm cursor-pointer flex items-center justify-between hover:border-emerald-300 dark:hover:border-emerald-700 hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/40 flex items-center justify-center shadow-sm">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Ambient Soundscapes
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Gentle rain, ocean waves, singing bowl
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-500 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* ── Pathways Grid ── */}
      <section className="space-y-5">
        <div>
          <h3 className="font-display text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-normal">
            Where would you like to go?
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Every room in your sanctuary has its own intention.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pathways.map((p) => {
            const Icon = p.Icon;
            return (
              <div
                key={p.id}
                onClick={() => onNavigate(p.id)}
                className={`group bg-white dark:bg-[#181B24] rounded-4xl p-7 border border-stone-200 dark:border-stone-800 shadow-sm ${p.hoverBorder} cursor-pointer flex flex-col justify-between min-h-[180px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
              >
                <div>
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center mb-4 shadow-sm ${p.iconBg}`}>
                    <Icon className={`w-5 h-5 ${p.accent}`} />
                  </div>
                  <h4 className="font-display text-lg font-bold text-stone-900 dark:text-stone-100">
                    {p.title}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-semibold mt-5 ${p.ctaColor}`}>
                  <span>{p.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
