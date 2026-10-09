import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Wind,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  ArrowLeft,
  Eye,
  Heart,
  CheckCircle,
} from "lucide-react";

/* ================================================================
 *  TYPES
 * ================================================================ */
type Practice = "overview" | "breathe" | "ground";
type BreathPattern = "478" | "box";
type BreathPhase = "Inhale" | "Hold" | "Exhale" | "Rest";

interface PhaseConfig {
  label: BreathPhase;
  duration: number; // seconds
  instruction: string;
  colorClass: string; // Tailwind bg gradient
  animClass: string; // breathing CSS animation class
}

/* ================================================================
 *  PATTERN CONFIGS
 * ================================================================ */
const PATTERNS: Record<BreathPattern, PhaseConfig[]> = {
  "478": [
    {
      label: "Inhale",
      duration: 4,
      instruction: "Slowly breathe in through your nose...",
      colorClass: "from-[#EEF2FF] to-[#D4C8FF]/60",
      animClass: "breathe-inhale",
    },
    {
      label: "Hold",
      duration: 7,
      instruction: "Hold gently. Rest in stillness...",
      colorClass: "from-[#C9EBDD]/80 to-[#EEF2FF]/60",
      animClass: "breathe-hold",
    },
    {
      label: "Exhale",
      duration: 8,
      instruction: "Release fully through your mouth with a soft sigh...",
      colorClass: "from-[#FAFAF8] to-[#E8F4FD]/60",
      animClass: "breathe-exhale",
    },
  ],
  box: [
    {
      label: "Inhale",
      duration: 4,
      instruction: "Breathe in steadily through your nose...",
      colorClass: "from-[#EEF2FF] to-[#D4C8FF]/60",
      animClass: "breathe-box-inhale",
    },
    {
      label: "Hold",
      duration: 4,
      instruction: "Hold at the top, feel your chest expand...",
      colorClass: "from-[#C9EBDD]/80 to-[#EEF2FF]/60",
      animClass: "breathe-box-hold1",
    },
    {
      label: "Exhale",
      duration: 4,
      instruction: "Release slowly, letting tension dissolve...",
      colorClass: "from-[#FAFAF8] to-[#E8F4FD]/60",
      animClass: "breathe-box-exhale",
    },
    {
      label: "Rest",
      duration: 4,
      instruction: "Hold gently at the bottom, be still...",
      colorClass: "from-[#FFF4D8]/80 to-[#FFFDF6]/60",
      animClass: "breathe-box-rest",
    },
  ],
};

/* ================================================================
 *  GROUNDING STEPS
 * ================================================================ */
const groundingSteps = [
  {
    count: 5,
    label: "Acknowledge 5 things you can see around you",
    sub: "Notice subtle details: light, shadow, texture, or an object near you.",
    color:
      "bg-[#EEF2FF] dark:bg-[#181F32] text-[#1C1917] dark:text-[#F1EFE8] border-[#A3A19C] dark:border-[#4F46E5]/40",
  },
  {
    count: 4,
    label: "Acknowledge 4 things you can physically feel",
    sub: "The ground beneath your feet, fabric on your skin, or temperature.",
    color:
      "bg-[#E7EEE8] dark:bg-[#0C1F17] text-[#1C1917] dark:text-[#F1EFE8] border-[#C9EBDD] dark:border-[#4F46E5]/30",
  },
  {
    count: 3,
    label: "Acknowledge 3 distinct sounds you can hear",
    sub: "Distant wind, your breath, traffic, or the gentle hum of a room.",
    color:
      "bg-[#DDE8E4] dark:bg-[#0F1E38] text-[#1C1917] dark:text-[#F1EFE8] border-[#DDE8E4] dark:border-[#4F46E5]/30",
  },
  {
    count: 2,
    label: "Acknowledge 2 things you can smell or enjoy",
    sub: "Fresh air, coffee, rain, or a familiar comforting scent.",
    color:
      "bg-[#F1EFE8] dark:bg-[#2A1E0D] text-[#1C1917] dark:text-[#F1EFE8] border-[#FCD34D]/50 dark:border-[#D97706]/30",
  },
  {
    count: 1,
    label: "Acknowledge 1 good thing about yourself right now",
    sub: "You showed up for yourself. You are here, breathing, and trying.",
    color:
      "bg-[#FFF1EB] dark:bg-[#2E121B] text-[#1C1917] dark:text-[#F1EFE8] border-[#FFD5C2]/60 dark:border-[#FB7185]/30",
  },
];

/* ================================================================
 *  BREATHE VIEW
 * ================================================================ */
const BreatheView: React.FC<{ pattern: BreathPattern; onBack: () => void }> = ({
  pattern,
  onBack,
}) => {
  const phases = PATTERNS[pattern];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(phases[0].duration);
  const [isActive, setIsActive] = useState(true);
  const [cycles, setCycles] = useState(0);
  const [animKey, setAnimKey] = useState(0); // force re-mount of animated el

  const phaseRef = useRef(phaseIdx);
  phaseRef.current = phaseIdx;
  const isActiveRef = useRef(isActive);
  isActiveRef.current = isActive;

  // Core timer
  useEffect(() => {
    if (!isActive) return;

    const currentPhase = phases[phaseRef.current];
    setSecondsLeft(currentPhase.duration);
    setAnimKey((k) => k + 1);

    let elapsed = 0;
    const tick = setInterval(() => {
      elapsed += 1;
      setSecondsLeft(currentPhase.duration - elapsed);

      if (elapsed >= currentPhase.duration) {
        clearInterval(tick);
        if (!isActiveRef.current) return;
        const next = (phaseRef.current + 1) % phases.length;
        if (next === 0) setCycles((c) => c + 1);
        setPhaseIdx(next);
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [phaseIdx, isActive, pattern]);

  const currentPhase = phases[phaseIdx];
  const progress =
    ((currentPhase.duration - secondsLeft) / currentPhase.duration) * 100;

  const reset = () => {
    setIsActive(false);
    setPhaseIdx(0);
    setSecondsLeft(phases[0].duration);
    setCycles(0);
    setTimeout(() => setIsActive(true), 100);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-auto flex flex-col items-center justify-between"
      style={{ background: "var(--zone-mint-bg)" }}
    >
      {/* Ambient background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, #C9EBDD 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #EEF2FF 0%, transparent 70%)",
            transform: "translate(-30%, 30%)",
          }}
        />
      </div>

      {/* Top Bar */}
      <div className="relative z-10 w-full max-w-xl flex items-center justify-between px-6 pt-6 sm:pt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full nirvana-glass border border-white/60 transition-all cursor-pointer"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Leave practice</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/50 dark:bg-white/10 px-3 py-1.5 rounded-full border border-white/60 text-xs">
            <span className="font-semibold text-[#4F46E5]">{cycles}</span>
            <span>cycles</span>
          </div>
          <button
            onClick={reset}
            className="p-2 rounded-full bg-white/50 border border-white/60 transition-all cursor-pointer hover:bg-white/80"
            title="Restart"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Central Breathing UI */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-8 space-y-10 w-full px-6">
        {/* Pattern label */}
        <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#4F46E5]">
          {pattern === "478" ? "4-7-8 Relaxing Breath" : "Box Breathing"}
        </p>

        {/* Animated orb stack */}
        <div className="relative flex items-center justify-center">
          {/* Outermost ambient ring — always visible */}
          <div
            className={`absolute rounded-full bg-gradient-to-br ${currentPhase.colorClass} opacity-30 transition-all duration-700`}
            style={{ width: 340, height: 340 }}
          />

          {/* Middle animated ring */}
          <div
            key={`ring-${animKey}`}
            className={`absolute rounded-full bg-gradient-to-br ${currentPhase.colorClass} opacity-55 ${currentPhase.animClass}`}
            style={{ width: 280, height: 280 }}
          />

          {/* Inner glass orb — always fixed size */}
          <div className="relative z-10 w-52 h-52 sm:w-56 sm:h-56 rounded-full nirvana-glass border-2 border-white/80 flex flex-col items-center justify-center text-center shadow-2xl">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[#4F46E5] mb-2 block">
              {currentPhase.label}
            </span>
            <span
              className="font-display text-5xl sm:text-6xl font-light"
              style={{ color: "var(--text-primary)" }}
            >
              {secondsLeft}
            </span>
            <span className="text-xs text-stone-600 dark:text-slate-300 mt-1">
              seconds
            </span>
          </div>
        </div>

        {/* Progress bar for current phase */}
        <div className="w-full max-w-xs">
          <div className="h-1 bg-white/40 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#4F46E5] transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p
            className="text-center text-xs mt-3 font-light leading-relaxed max-w-xs mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            {currentPhase.instruction}
          </p>
        </div>

        {/* Phase indicator dots */}
        <div className="flex items-center gap-2.5">
          {phases.map((p, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-500 ${
                i === phaseIdx
                  ? "w-6 h-2 bg-[#4F46E5]"
                  : i < phaseIdx
                    ? "w-2 h-2 bg-[#4F46E5]/40"
                    : "w-2 h-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="relative z-10 w-full max-w-xs flex items-center justify-center gap-3 pb-10">
        <button
          onClick={() => setIsActive(!isActive)}
          className="px-8 py-3 rounded-full text-white text-sm font-semibold shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          style={{ background: isActive ? "#4F46E5" : "#2D6A4F" }}
        >
          {isActive ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>{isActive ? "Pause" : "Resume"}</span>
        </button>
      </div>
    </div>
  );
};

/* ================================================================
 *  GROUNDING VIEW
 * ================================================================ */
const GroundingView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const current = groundingSteps[step];

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-16 flex flex-col items-center space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-[#C9EBDD]/70 text-[#2D7354] flex items-center justify-center shadow-lg">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2
          className="font-display text-3xl font-normal"
          style={{ color: "var(--text-primary)" }}
        >
          You've completed your grounding.
        </h2>
        <p
          className="text-sm font-light max-w-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          You brought yourself back into your body and your room. This is one of
          the most powerful things you can do in a difficult moment.
        </p>
        <button
          onClick={onBack}
          className="mt-4 px-8 py-3 rounded-full bg-[#4F46E5] text-white text-sm font-semibold shadow-md cursor-pointer"
        >
          Return to Practices ?
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-16 space-y-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-medium px-3.5 py-1.5 rounded-full nirvana-glass border border-white/60 cursor-pointer"
        style={{ color: "var(--text-secondary)" }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to practices
      </button>

      {/* Step progress */}
      <div className="flex items-center gap-2">
        {groundingSteps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i <= step ? "bg-[#4F46E5]" : "bg-[#E2DEEE]"
            }`}
          />
        ))}
      </div>

      <div className="nirvana-glass rounded-3xl p-8 sm:p-12 border border-white/90 shadow-glass space-y-6 text-center">
        {/* Big number badge */}
        <div
          className={`w-20 h-20 mx-auto rounded-2xl border-2 font-display text-3xl font-bold flex items-center justify-center shadow-md ${current.color}`}
        >
          {current.count}
        </div>

        <h2
          className="font-display text-2xl sm:text-3xl font-normal leading-snug"
          style={{ color: "var(--text-primary)" }}
        >
          {current.label}
        </h2>
        <p
          className="text-sm font-light max-w-md mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {current.sub}
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-5 py-2.5 rounded-xl border text-xs font-medium cursor-pointer"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-secondary)",
              }}
            >
              Previous
            </button>
          )}

          {step < groundingSteps.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-6 py-2.5 rounded-xl bg-[#4F46E5] text-white text-xs font-semibold shadow-md cursor-pointer"
            >
              I've observed this ?
            </button>
          ) : (
            <button
              onClick={() => setCompleted(true)}
              className="px-6 py-2.5 rounded-xl bg-[#4F46E5] text-white text-xs font-semibold shadow-md cursor-pointer"
            >
              Complete grounding ?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================================================================
 *  MAIN WELLNESS VIEW
 * ================================================================ */
export const WellnessView: React.FC = () => {
  const [practice, setPractice] = useState<Practice>("overview");
  const [breathPattern, setBreathPattern] = useState<BreathPattern>("478");

  if (practice === "breathe") {
    return (
      <BreatheView
        pattern={breathPattern}
        onBack={() => setPractice("overview")}
      />
    );
  }

  if (practice === "ground") {
    return <GroundingView onBack={() => setPractice("overview")} />;
  }

  /* ---- OVERVIEW ---- */
  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pb-20 space-y-10">
      {/* Header */}
      <div className="zone-mint-sage rounded-4xl p-8 sm:p-12 border border-[#E7E5E4] dark:border-[#4F46E5]/25 shadow-editorial space-y-2 transition-colors">
        <span className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest block">
          Guided Nervous System Pause
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[#1C1917] dark:text-[#F1EFE8]">
          Nothing needs to be solved <br />
          <span className="italic text-[#2D6A4F]">right now.</span>
        </h1>
        <p className="text-sm sm:text-base font-light mt-2 max-w-xl leading-relaxed text-[#57534E] dark:text-slate-300">
          When racing thoughts overwhelm the mind, words aren't always what you
          need. Settle into breath, grounding, or quiet presence.
        </p>
      </div>

      {/* Practice Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* 4-7-8 Breathing */}
        <div className="bg-white/90 dark:bg-[#131826] backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-[#E7E5E4] dark:border-[#232A40] shadow-editorial nirvana-glass-hover flex flex-col justify-between gap-6 transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
              <Wind className="w-6 h-6" />
            </div>
            <h3
              className="font-display text-xl font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              4-7-8 Soothing Breath
            </h3>
            <p
              className="text-xs sm:text-sm font-normal text-stone-600 dark:text-slate-300 leading-relaxed"
            >
              Inhale for 4 seconds, hold gently for 7, and release for 8.
              Scientifically proven to stimulate the vagus nerve and slow a
              racing heartbeat.
            </p>
            <div className="flex gap-2 text-[11px]">
              {["Inhale 4s", "Hold 7s", "Exhale 8s"].map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#4F46E5] font-medium">
              ⏱️ 2 min / cycle
            </span>
            <button
              onClick={() => {
                setBreathPattern("478");
                setPractice("breathe");
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 rounded-full shadow-sm cursor-pointer transition-all"
            >
              Start Breathing →
            </button>
          </div>
        </div>

        {/* Box Breathing */}
        <div className="bg-white/90 dark:bg-[#131826] backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-[#E7E5E4] dark:border-[#232A40] shadow-editorial nirvana-glass-hover flex flex-col justify-between gap-6 transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#DDE8E4]/50 text-[#2B7AA1] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3
              className="font-display text-xl font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Box Breathing
            </h3>
            <p
              className="text-xs sm:text-sm font-normal text-stone-600 dark:text-slate-300 leading-relaxed"
            >
              Equal 4-second counts for Inhale, Hold, Exhale, and Rest. Calms
              hyper-arousal and sharpens presence in moments of mental fog.
            </p>
            <div className="flex gap-2 text-[11px] flex-wrap">
              {["Inhale 4s", "Hold 4s", "Exhale 4s", "Rest 4s"].map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#4F46E5] font-medium">
              ⏱️ 2 min / cycle
            </span>
            <button
              onClick={() => {
                setBreathPattern("box");
                setPractice("breathe");
              }}
              className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium px-4 py-2 rounded-full shadow-sm cursor-pointer transition-all"
            >
              Start Box Breath →
            </button>
          </div>
        </div>

        {/* 5-4-3-2-1 Grounding */}
        <div className="bg-white/90 dark:bg-[#131826] backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-[#E7E5E4] dark:border-[#232A40] shadow-editorial nirvana-glass-hover flex flex-col justify-between gap-6 transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C9EBDD]/60 text-[#2D7354] flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h3
              className="font-display text-xl font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              5-4-3-2-1 Grounding
            </h3>
            <p
              className="text-xs sm:text-sm font-normal text-stone-600 dark:text-slate-300 leading-relaxed"
            >
              Pull your awareness out of anxious thought loops and back into
              your physical room using sight, touch, sound, and presence.
            </p>
            <div className="flex gap-2 text-[11px] flex-wrap">
              {["👁️ See", "✋ Feel", "👂 Hear", "👃 Smell", "💚 Know"].map(
                (t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-medium"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#4F46E5] font-medium">3–5 min</span>
            <button
              onClick={() => setPractice("ground")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 py-2 rounded-full shadow-sm cursor-pointer transition-all"
            >
              Start Grounding →
            </button>
          </div>
        </div>

        {/* Quiet Stillness */}
        <div className="bg-white/90 dark:bg-[#131826] backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-[#E7E5E4] dark:border-[#232A40] shadow-editorial nirvana-glass-hover flex flex-col justify-between gap-6 transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF4D8] text-[#977313] flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3
              className="font-display text-xl font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Just Be Quiet
            </h3>
            <p
              className="text-xs sm:text-sm font-normal text-stone-600 dark:text-slate-300 leading-relaxed"
            >
              No breathing rhythm to follow, no tasks to perform. Sit
              comfortably and let the world continue without your intervention.
            </p>
            <div className="flex gap-2 text-[11px]">
              {["No guidance", "Self-paced", "Unstructured"].map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#4F46E5] font-medium">
              Self-paced
            </span>
            <button
              onClick={() => {
                setBreathPattern("box");
                setPractice("breathe");
              }}
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium px-4 py-2 rounded-full shadow-sm cursor-pointer transition-all"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-soft)",
                color: "var(--text-primary)",
              }}
            >
              Sit in Quiet →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

