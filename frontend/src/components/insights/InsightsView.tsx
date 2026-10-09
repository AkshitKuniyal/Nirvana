import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Heart,
  Activity,
  Wind,
  BookOpen,
  MessageCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { api } from "../../utils/api";

/* ================================================================
 *  MOOD META WITH PROFESSIONAL LIGHT & DARK COLOR COMBINATIONS
 * ================================================================ */
const moodMeta: Record<string, { emoji: string; label: string; heightPx: number; bar: string; badge: string }> = {
  good: { 
    emoji: "☀️", 
    label: "Good", 
    heightPx: 96, 
    bar: "bg-gradient-to-t from-[#FF9E80] to-[#FFD5C2] dark:from-[#E11D48] dark:to-[#FB7185] shadow-[0_4px_16px_rgba(255,158,128,0.3)] dark:shadow-[0_4px_16px_rgba(225,29,72,0.4)]", 
    badge: "bg-[#FFF1EB] text-[#C05C2E] dark:bg-[#381622] dark:text-[#FDA4AF] border border-[#FFD5C2]/70 dark:border-[#FB7185]/30" 
  },
  okay: { 
    emoji: "🌤️", 
    label: "Okay", 
    heightPx: 72, 
    bar: "bg-gradient-to-t from-[#60A5FA] to-[#B9DDF5] dark:from-[#1D4ED8] dark:to-[#60A5FA] shadow-[0_4px_16px_rgba(96,165,250,0.3)] dark:shadow-[0_4px_16px_rgba(29,78,216,0.4)]", 
    badge: "bg-[#E8F4FD] text-[#2B7AA1] dark:bg-[#11243A] dark:text-[#93C5FD] border border-[#B9DDF5]/70 dark:border-[#60A5FA]/30" 
  },
  meh: { 
    emoji: "☁️", 
    label: "Low", 
    heightPx: 52, 
    bar: "bg-gradient-to-t from-[#A78BFA] to-[#DDD6FE] dark:from-[#6D28D9] dark:to-[#A78BFA] shadow-[0_4px_16px_rgba(167,139,250,0.35)] dark:shadow-[0_4px_16px_rgba(109,40,217,0.4)]", 
    badge: "bg-[#EEF2FF] text-[#6852ED] dark:bg-[#251842] dark:text-[#C4B5FD] border border-[#DDD6FE]/70 dark:border-[#A78BFA]/30" 
  },
  low: { 
    emoji: "🌧️", 
    label: "Heavy", 
    heightPx: 36, 
    bar: "bg-gradient-to-t from-[#F472B6] to-[#FCE7F3] dark:from-[#BE185D] dark:to-[#F472B6] shadow-[0_4px_16px_rgba(244,114,182,0.35)] dark:shadow-[0_4px_16px_rgba(190,24,93,0.4)]", 
    badge: "bg-[#FDF0F7] text-[#A83772] dark:bg-[#351528] dark:text-[#F9A8D4] border border-[#FCE7F3]/70 dark:border-[#F472B6]/30" 
  },
  overwhelmed: { 
    emoji: "⛈️", 
    label: "Overwhelmed", 
    heightPx: 24, 
    bar: "bg-gradient-to-t from-[#818CF8] to-[#E0E7FF] dark:from-[#4338CA] dark:to-[#818CF8] shadow-[0_4px_16px_rgba(129,140,248,0.35)] dark:shadow-[0_4px_16px_rgba(67,56,202,0.4)]", 
    badge: "bg-[#EEF2FF] text-[#4338CA] dark:bg-[#1A1A3B] dark:text-[#C7D2FE] border border-[#E0E7FF]/70 dark:border-[#818CF8]/30" 
  },
  uncertain: { 
    emoji: "🌿", 
    label: "Uncertain", 
    heightPx: 24, 
    bar: "bg-gradient-to-t from-[#34D399] to-[#D1FAE5] dark:from-[#047857] dark:to-[#34D399] shadow-[0_4px_16px_rgba(52,211,153,0.35)] dark:shadow-[0_4px_16px_rgba(4,120,87,0.4)]", 
    badge: "bg-[#ECFDF5] text-[#047857] dark:bg-[#0D281E] dark:text-[#6EE7B7] border border-[#D1FAE5]/70 dark:border-[#34D399]/30" 
  },
};

const getMeta = (mood: string) => moodMeta[mood] ?? moodMeta.okay;

/* ================================================================
 *  JOURNEY MILESTONES
 * ================================================================ */
const journeyMilestones = [
  {
    icon: Sparkles,
    color: "bg-[#EEF2FF] text-[#8E7CFF] dark:bg-[#2A1E4A] dark:text-[#C4B5FD]",
    title: "Arrived at your sanctuary",
    text: "You took a pause from a busy day to check in with your heart and breath.",
  },
  {
    icon: Wind,
    color: "bg-[#EDF7F1] text-[#1E5638] dark:bg-[#10291E] dark:text-[#6EE7B7]",
    title: "Guided calming rhythm",
    text: "You engaged with a guided breathing practice to ground your nervous system.",
  },
  {
    icon: BookOpen,
    color: "bg-[#FFF8EB] text-[#977313] dark:bg-[#342410] dark:text-[#FBBF24]",
    title: "Personal reflection written",
    text: "You unpacked what was weighing on you in private, unburdened writing.",
  },
  {
    icon: MessageCircle,
    color: "bg-[#EFF5FF] text-[#1D4ED8] dark:bg-[#12233F] dark:text-[#93C5FD]",
    title: "Open conversation with companion",
    text: "You allowed yourself to be heard without judgment in a safe space.",
  },
];

/* ================================================================
 *  COMPONENT
 * ================================================================ */
export const InsightsView: React.FC = () => {
  const [insights, setInsights] = useState<any[]>([]);
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [insightsData, moodData] = await Promise.all([
        api.getInsights().catch(() => ({ insights: [] })),
        api.getMoodHistory(14).catch(() => ({ entries: [] })),
      ]);
      setInsights(insightsData.insights || []);
      setMoodHistory(moodData.entries || []);
    } catch {
      setError("Could not load your insights - your data is safe.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---- Stats ---- */
  const moodCounts = moodHistory.reduce<Record<string, number>>((acc, e) => {
    acc[e.mood] = (acc[e.mood] || 0) + 1;
    return acc;
  }, {});

  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
  const totalSessions = moodHistory.length;
  const avgMoodLabel = dominantMood ? getMeta(dominantMood[0]).label : "Not yet tracked";

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pb-20 space-y-10">

      {/* -- Header --------------------------------------------- */}
      <div className="zone-sky-violet rounded-4xl p-8 sm:p-12 border border-[#E2DDD5] dark:border-[#60A5FA]/25 shadow-editorial space-y-4 relative overflow-hidden transition-colors">
        {/* Decorative glowing blobs */}
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-[#B8C8FF]/30 dark:bg-[#3B82F6]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-12 w-36 h-36 rounded-full bg-[#EEF2FF]/40 dark:bg-[#8B5CF6]/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-[#E2DDD5] dark:border-white/15 text-xs font-semibold text-[#5B85DE] dark:text-[#93C5FD] tracking-wider uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Self-Compassion Timeline</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[#181524] dark:text-[#F7F4FF]">
            Understand yourself, <br />
            <span className="italic text-[#5B85DE] dark:text-[#93C5FD]">a little better.</span>
          </h1>
          <p className="text-sm sm:text-base font-light max-w-xl leading-relaxed text-[#4F4A5E] dark:text-slate-300">
            Gentle self-reflection over time. No medical diagnostics or clinical ratings — just your natural emotional rhythms.
          </p>

          {/* Quick stats row */}
          {!isLoading && totalSessions > 0 && (
            <div className="flex gap-4 flex-wrap pt-2">
              <div className="bg-white/85 dark:bg-[#131826]/85 border border-[#E2DDD5] dark:border-[#232A40] rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-sm">
                <TrendingUp className="w-4 h-4 text-[#5B85DE] dark:text-[#60A5FA]" />
                <span className="text-xs font-medium text-[#181524] dark:text-[#F7F4FF]">
                  {totalSessions} total check-in{totalSessions === 1 ? "" : "s"}
                </span>
              </div>
              <div className="bg-white/85 dark:bg-[#131826]/85 border border-[#E2DDD5] dark:border-[#232A40] rounded-2xl px-4 py-2.5 flex items-center gap-2.5 shadow-sm">
                <span className="text-lg leading-none">{dominantMood ? getMeta(dominantMood[0]).emoji : "✨"}</span>
                <span className="text-xs font-medium text-[#181524] dark:text-[#F7F4FF]">
                  Primary tone: {avgMoodLabel}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* -- Mood Rhythm Chart ----------------------------------- */}
      <section className="bg-white/90 dark:bg-[#131826]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-[#E2DDD5] dark:border-[#232A40] shadow-editorial space-y-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-medium text-[#181524] dark:text-[#F7F4FF]">
              Your Recent Rhythm
            </h2>
            <p className="text-xs sm:text-sm font-light mt-0.5 text-[#4F4A5E] dark:text-slate-300">
              How your days have felt arriving into your sanctuary
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-medium bg-[#EEF2FF] dark:bg-[#2A1E4A] text-[#8E7CFF] dark:text-[#C4B5FD] px-3.5 py-1 rounded-full border border-[#8E7CFF]/30">
              Last 14 days
            </span>
            <button
              onClick={loadData}
              className="p-2 rounded-full border border-[#E2DDD5] dark:border-white/15 bg-white dark:bg-white/10 text-[#4F4A5E] dark:text-slate-300 cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-xs"
              title="Refresh timeline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-14 flex items-center justify-center gap-3 text-[#7E7890] dark:text-[#A8A0C2]">
            <div className="w-5 h-5 border-2 border-[#8E7CFF]/40 border-t-[#8E7CFF] rounded-full animate-spin" />
            <span className="text-xs font-light">Loading your rhythm...</span>
          </div>
        ) : moodHistory.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="text-5xl filter drop-shadow-md">🌱</div>
            <p className="text-base font-normal text-[#181524] dark:text-[#F7F4FF]">
              Your rhythm will bloom here as you spend time with Nirvana.
            </p>
            <p className="text-xs font-light max-w-sm mx-auto text-[#4F4A5E] dark:text-slate-300">
              Check in on the home screen whenever you arrive to begin sketching your story.
            </p>
          </div>
        ) : (
          <div className="pt-4 space-y-6">
            {/* Bar chart */}
            <div className="flex items-end justify-start gap-3 sm:gap-5 overflow-x-auto no-scrollbar pb-4 pt-6" style={{ minHeight: 160 }}>
              {moodHistory.slice(0, 14).reverse().map((entry, idx) => {
                const meta = getMeta(entry.mood);
                return (
                  <div key={idx} className="flex flex-col items-center gap-2.5 shrink-0 group cursor-default">
                    <span className="text-2xl filter drop-shadow-sm group-hover:scale-125 transition-transform duration-200">
                      {meta.emoji}
                    </span>
                    <div
                      className={`w-10 sm:w-12 rounded-2xl ${meta.bar} transition-all duration-300 group-hover:scale-105 group-hover:brightness-110`}
                      style={{ height: meta.heightPx }}
                    />
                    <span className="text-[11px] font-medium text-[#7E7890] dark:text-[#A8A0C2]">
                      {new Date(entry.logged_at).toLocaleDateString(undefined, { weekday: "short" })}
                    </span>
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs ${meta.badge}`}>
                      {meta.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2.5 pt-4 border-t border-[#E2DDD5] dark:border-[#232A40]">
              {Object.entries(moodMeta).map(([key, m]) => (
                <span key={key} className={`text-[11px] font-medium px-3 py-1 rounded-full flex items-center gap-1.5 ${m.badge}`}>
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* -- AI Insights / Themes ------------------------------- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Recurring Themes */}
        <div className="bg-white/90 dark:bg-[#131826]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-[#E2DDD5] dark:border-[#232A40] shadow-editorial space-y-4 transition-colors">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8E7CFF] dark:text-[#A78BFA] uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>Recurring Themes</span>
          </div>
          <p className="text-xs font-light text-[#4F4A5E] dark:text-slate-300">
            Topics that have frequently surfaced in your writings and conversations:
          </p>

          {isLoading ? (
            <div className="space-y-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-11 rounded-2xl animate-pulse bg-black/5 dark:bg-white/5" />
              ))}
            </div>
          ) : insights.length > 0 ? (
            <div className="space-y-3">
              {insights.slice(0, 4).map((insight: any, i: number) => {
                // Normalise: backend returns { headline, observation, tag }
                // Older/string format is also handled
                const headline =
                  typeof insight === "string"
                    ? insight
                    : insight.headline || insight.title || insight.text || insight.content || "";
                const observation =
                  typeof insight === "string"
                    ? ""
                    : insight.observation || insight.description || "";
                const tag =
                  typeof insight === "string" ? "" : insight.tag || insight.category || "";

                return (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-[#E2DDD5] dark:border-[#8E7CFF]/20 bg-[#FAF5FF] dark:bg-[#1E1738]/80 flex flex-col gap-1.5 transition-transform hover:scale-[1.01]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#8E7CFF] dark:text-[#A78BFA]" />
                        <span className="text-xs font-semibold text-[#181524] dark:text-[#F7F4FF] leading-snug">
                          {headline}
                        </span>
                      </div>
                      {tag && (
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EEF2FF] dark:bg-[#2A1E4A] text-[#8E7CFF] dark:text-[#C4B5FD] border border-[#8E7CFF]/20 shrink-0">
                          {tag}
                        </span>
                      )}
                    </div>
                    {observation && (
                      <p className="text-[11px] font-light leading-relaxed text-[#4F4A5E] dark:text-slate-300 pl-5">
                        {observation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2.5">
              {["Work & Expectations", "Overthinking Outcomes", "Rest & Sleep Stillness"].map((t, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl border border-[#E2DDD5] dark:border-[#8E7CFF]/25 bg-[#FAF5FF] dark:bg-[#1E1738]/80 flex items-center justify-between"
                >
                  <span className="text-xs font-medium text-[#181524] dark:text-[#F7F4FF]">{t}</span>
                  <span className="text-[11px] text-[#7E22CE] dark:text-[#C4B5FD] font-medium">Frequently present</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Things That Helped (Clean, Professional Pastel in Light / Deep Luminous in Dark) */}
        <div className="bg-white/90 dark:bg-[#131826]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-[#E2DDD5] dark:border-[#232A40] shadow-editorial space-y-4 transition-colors">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#15803D] dark:text-[#34D399] uppercase tracking-wider">
            <Heart className="w-4 h-4" />
            <span>Things That Helped</span>
          </div>
          <p className="text-xs font-light text-[#4F4A5E] dark:text-slate-300">
            Practices and moments that supported you when feeling heavy:
          </p>

          <div className="space-y-2.5">
            {[
              { 
                t: "4-7-8 Breathing Pause", 
                s: "Brought heartbeat down", 
                bg: "bg-[#F0FDF4] dark:bg-[#0E251B]", 
                border: "border-[#DCFCE7] dark:border-[#34D399]/30", 
                titleColor: "text-[#181524] dark:text-[#F7F4FF]",
                badgeColor: "text-[#15803D] dark:text-[#6EE7B7]" 
              },
              { 
                t: "Unburdening in Journal", 
                s: "Untangled racing mind", 
                bg: "bg-[#F0FDF4] dark:bg-[#0E251B]", 
                border: "border-[#DCFCE7] dark:border-[#34D399]/30", 
                titleColor: "text-[#181524] dark:text-[#F7F4FF]",
                badgeColor: "text-[#15803D] dark:text-[#6EE7B7]" 
              },
              { 
                t: "Calming Rain Soundscape", 
                s: "Grounding presence", 
                bg: "bg-[#F0FDF4] dark:bg-[#0E251B]", 
                border: "border-[#DCFCE7] dark:border-[#34D399]/30", 
                titleColor: "text-[#181524] dark:text-[#F7F4FF]",
                badgeColor: "text-[#15803D] dark:text-[#6EE7B7]" 
              },
            ].map(({ t, s, bg, border, titleColor, badgeColor }, i) => (
              <div 
                key={i} 
                className={`p-3.5 rounded-2xl border ${bg} ${border} flex items-center justify-between transition-transform hover:scale-[1.01] shadow-xs`}
              >
                <span className={`text-xs font-medium ${titleColor}`}>{t}</span>
                <span className={`text-[11px] font-semibold ${badgeColor}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- Journey Timeline ----------------------------------- */}
      <section className="bg-white/90 dark:bg-[#131826]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-[#E2DDD5] dark:border-[#232A40] shadow-editorial space-y-6 transition-colors">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-medium text-[#181524] dark:text-[#F7F4FF]">
            Your Journey
          </h2>
          <p className="text-xs sm:text-sm font-light mt-0.5 text-[#4F4A5E] dark:text-slate-300">
            Milestones of self-care and quiet reflection
          </p>
        </div>

        <div className="relative pl-8 space-y-6">
          <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#8E7CFF] via-[#4EAA82] to-transparent opacity-40" />

          {journeyMilestones.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="relative group">
                <div className={`absolute -left-8 top-1.5 w-7 h-7 rounded-full ${item.color} flex items-center justify-center shadow-sm border-2 border-white dark:border-gray-800 transition-transform group-hover:scale-115`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white/80 dark:bg-white/5 rounded-2xl p-4 sm:p-5 border border-[#E2DDD5] dark:border-[#232A40] shadow-sm space-y-1 transition-all group-hover:translate-x-1.5">
                  <h4 className="text-sm font-semibold text-[#181524] dark:text-[#F7F4FF]">
                    {item.title}
                  </h4>
                  <p className="text-xs font-light leading-relaxed text-[#4F4A5E] dark:text-slate-300">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

