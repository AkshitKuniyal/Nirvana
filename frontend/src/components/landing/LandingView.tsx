import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  BookOpen,
  Wind,
  Compass,
  ShieldCheck,
  Lock,
  Heart,
  Sun,
  CloudSun,
  CloudRain,
  Leaf,
  Coffee,
  Smile,
  Volume2,
  Mic,
  Check,
  Activity,
  BookMarked,
} from "lucide-react";

interface LandingViewProps {
  onEnter: () => void;
  onGoToAuth: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onEnter,
  onGoToAuth,
}) => {
  const [selectedMood, setSelectedMood] = useState<
    "good" | "heavy" | "overwhelmed" | "unsure" | null
  >("good");

  return (
    <div className="w-full overflow-hidden" style={{ color: "var(--text-primary)" }}>
      {/* -------------------------------------------------------------
       * SECTION 1: FULL-WIDTH HERO (Cream + Peach + Coral)
       * ------------------------------------------------------------- */}
      <section className="relative w-full zone-cream-peach pt-4 pb-20 sm:pb-32 px-6 sm:px-12 lg:px-16 xl:px-24">
        {/* Top Floating Glass Navigation */}
        <div className="w-full w-full flex items-center justify-between py-4 mb-10 sm:mb-16">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#7A9E8A] flex items-center justify-center shadow-md shadow-[#4F46E5]/25 group-hover:scale-105 transition-transform">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2.5C12 2.5 7 8 7 13.5C7 16.5 9.2 19 12 19C14.8 19 17 16.5 17 13.5C17 8 12 2.5 12 2.5Z" />
                <path d="M12 19C9 19 4 17 2 13C2 13 4 10 8 11.5" />
                <path d="M12 19C15 19 20 17 22 13C22 13 20 10 16 11.5" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                NIRVANA
              </span>
              <span className="hidden sm:inline-block text-[11px] font-medium tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
                Sanctuary
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={onGoToAuth}
              className="text-xs sm:text-sm font-medium px-4 py-2 rounded-full hover:bg-white/70 transition-all cursor-pointer" style={{ color: "var(--text-secondary)" }}
            >
              Sign In
            </button>
            <button
              onClick={onEnter}
              className="px-5 sm:px-6 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs sm:text-sm font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Enter Sanctuary</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hero Grid: Corner-to-Corner Composition */}
        <div className="w-full w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Expressive Typography & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-10 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#FAF8F5] text-xs font-semibold text-[#E07A5F] tracking-wider uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>Your space to breathe</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-normal leading-[1.04] tracking-tight" style={{ color: "var(--text-primary)" }}>
              Come as <br />
              <span className="italic font-normal text-[#4F46E5]">
                you are.
              </span>{" "}
              <br />
              <span className="text-3xl sm:text-5xl md:text-6xl font-light block mt-2" style={{ color: "var(--text-secondary)" }}>
                Leave a little lighter.
              </span>
            </h1>

            <p className="text-base sm:text-lg font-light max-w-xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Nirvana is a personal space to talk, reflect, write, breathe, and
              find your way through whatever is on your mind. Without clinical
              labels, questionnaires, or pressure.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onEnter}
                className="px-8 py-4 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-base shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <span>Enter Nirvana</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onGoToAuth}
                className="px-8 py-4 rounded-full bg-white/80 hover:bg-white font-medium text-base border border-[#E7E5E4] shadow-sm hover:shadow-md transition-all flex items-center justify-center cursor-pointer" style={{ color: "var(--text-primary)" }}
              >
                <span>Sign In or Explore</span>
              </button>
            </div>

            {/* Subtext assurances */}
            <div className="flex items-center gap-6 pt-4 text-xs font-light" style={{ color: "var(--text-muted)" }}>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#7A9E8A]" />
                Zero data selling
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#B87878]" />
                No medical questionnaires
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Vector Illustration + Overlapping Floating Widgets (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Background Organic Blob Accent */}
            <div className="absolute -top-10 -right-10 w-96 h-96 bg-gradient-to-tr from-[#FAF8F5] to-[#FAF8F5] rounded-blob blur-2xl pointer-events-none opacity-80 animate-float-slow" />
            <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-[#F8E9FF]/70 rounded-blob blur-2xl pointer-events-none opacity-60 animate-float-reverse" />

            {/* Rich Bespoke SVG Cozy Illustration */}
            <div className="relative z-10 w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-white/90 to-[#F8F6F1]/90 border-2 border-white shadow-editorial">
              <svg
                className="w-full h-auto rounded-2xl shadow-inner"
                viewBox="0 0 500 420"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="skyGrad"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#FFF3EE" />
                    <stop offset="100%" stopColor="#FAF8F5" />
                  </linearGradient>
                  <linearGradient
                    id="sunBeam"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#FFF2C9" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="couchGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#2D6A4F" />
                  </linearGradient>
                </defs>

                {/* Cozy Room Floor & Wall */}
                <rect width="500" height="420" rx="20" fill="#FFFDF6" />
                <path d="M0 320 L500 320 L500 420 L0 420 Z" fill="#FCECE2" />

                {/* Large Arched Window */}
                <path
                  d="M260 50 C260 20, 440 20, 440 50 L440 270 L260 270 Z"
                  fill="url(#skyGrad)"
                  stroke="#E2DAD1"
                  strokeWidth="4"
                />
                <path
                  d="M260 50 C260 20, 440 20, 440 50"
                  fill="none"
                  stroke="#E2DAD1"
                  strokeWidth="4"
                />
                <line
                  x1="350"
                  y1="30"
                  x2="350"
                  y2="270"
                  stroke="#E2DAD1"
                  strokeWidth="3"
                />
                <line
                  x1="260"
                  y1="150"
                  x2="440"
                  y2="150"
                  stroke="#E2DAD1"
                  strokeWidth="3"
                />

                {/* Sunbeams pouring in */}
                <polygon
                  points="350,30 500,160 500,320 320,320"
                  fill="url(#sunBeam)"
                  opacity="0.6"
                />

                {/* Potted Fiddle Leaf Fig Plant */}
                <path
                  d="M390 320 L380 270 L430 270 L420 320 Z"
                  fill="#D97706"
                />
                <line
                  x1="405"
                  y1="270"
                  x2="405"
                  y2="140"
                  stroke="#2D6A4F"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="380"
                  cy="180"
                  rx="28"
                  ry="16"
                  fill="#2D6A4F"
                  transform="rotate(-20 380 180)"
                />
                <ellipse
                  cx="430"
                  cy="190"
                  rx="28"
                  ry="16"
                  fill="#4F46E5"
                  transform="rotate(25 430 190)"
                />
                <ellipse
                  cx="385"
                  cy="230"
                  rx="26"
                  ry="15"
                  fill="#2D6A4F"
                  transform="rotate(-30 385 230)"
                />
                <ellipse
                  cx="435"
                  cy="240"
                  rx="26"
                  ry="15"
                  fill="#4F46E5"
                  transform="rotate(20 435 240)"
                />
                <ellipse
                  cx="405"
                  cy="140"
                  rx="24"
                  ry="14"
                  fill="#2D6A4F"
                  transform="rotate(5 405 140)"
                />

                {/* Modern Soft Cozy Armchair */}
                <path
                  d="M70 240 C70 190, 240 190, 240 240 L250 310 C250 330, 230 340, 210 340 L100 340 C80 340, 60 330, 60 310 Z"
                  fill="url(#couchGrad)"
                />
                <rect
                  x="80"
                  y="340"
                  width="10"
                  height="25"
                  rx="3"
                  fill="#8C6E54"
                />
                <rect
                  x="220"
                  y="340"
                  width="10"
                  height="25"
                  rx="3"
                  fill="#8C6E54"
                />
                <ellipse cx="155" cy="305" rx="70" ry="25" fill="#AFA0FF" />

                {/* Relaxed Human Character Resting */}
                {/* Body/Torso in warm peach sweater */}
                <path
                  d="M125 245 C125 210, 185 210, 185 245 L190 310 L120 310 Z"
                  fill="#FAF8F5"
                />
                {/* Legs curled up comfortably */}
                <path
                  d="M130 300 C130 280, 180 270, 210 300 C210 320, 170 330, 140 320 Z"
                  fill="#57534E"
                />
                {/* Head */}
                <circle cx="155" cy="190" r="22" fill="#FCD5B5" />
                {/* Hair */}
                <path
                  d="M135 185 C135 160, 175 160, 175 185 C175 195, 170 200, 160 200 C145 200, 135 195, 135 185 Z"
                  fill="#242330"
                />
                {/* Relaxed facial smile */}
                <path
                  d="M150 196 Q155 200 160 196"
                  stroke="#242330"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Wooden Side Table with Teacup & Books */}
                <ellipse cx="250" cy="320" rx="35" ry="12" fill="#E2DAD1" />
                <line
                  x1="250"
                  y1="320"
                  x2="250"
                  y2="370"
                  stroke="#8C6E54"
                  strokeWidth="4"
                />
                {/* Books */}
                <rect
                  x="235"
                  y="308"
                  width="30"
                  height="8"
                  rx="2"
                  fill="#E07A5F"
                />
                <rect
                  x="233"
                  y="302"
                  width="32"
                  height="7"
                  rx="2"
                  fill="#2D6A4F"
                />
                {/* Steaming Ceramic Mug */}
                <rect
                  x="245"
                  y="288"
                  width="14"
                  height="15"
                  rx="3"
                  fill="#F8F6F1"
                  stroke="#4F46E5"
                  strokeWidth="1"
                />
                {/* Steam spirals */}
                <path
                  d="M250 284 Q252 278 250 274"
                  stroke="#4F46E5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                <path
                  d="M254 282 Q256 276 254 272"
                  stroke="#4F46E5"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.6"
                />

                {/* Floating Friendly Ethereal Nirvana Sparkle Orb */}
                <circle cx="100" cy="120" r="18" fill="#FAF8F5" />
                <circle cx="100" cy="120" r="14" fill="#4F46E5" opacity="0.8" />
                <circle cx="100" cy="120" r="8" fill="#FFFFFF" />
              </svg>

              {/* OVERLAPPING FLOATING GLASS UI WIDGETS */}
              {/* Widget 1: Floating Mood Pill (Top Left) */}
              <div className="absolute -top-4 -left-4 sm:-left-6 nirvana-glass rounded-2xl px-4 py-2.5 border border-white shadow-editorial flex items-center gap-2.5 animate-float-slow">
                <span className="text-xl">☀️</span>
                <div>
                  <span className="text-[10px] text-[#78716C] uppercase tracking-wider block font-semibold">
                    Mood Today
                  </span>
                  <span className="text-xs font-semibold text-[#1C1917]">
                    Feeling lighter
                  </span>
                </div>
              </div>

              {/* Widget 2: Nirvana Remembers (Bottom Right) */}
              <div className="absolute -bottom-5 -right-4 sm:-right-6 nirvana-glass rounded-2xl p-3.5 border border-white shadow-editorial max-w-xs animate-float-reverse">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#4F46E5] uppercase tracking-wider mb-0.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Nirvana Remembers</span>
                </div>
                <p className="text-xs text-[#1C1917] font-light">
                  "You prefer quiet moments with tea over racing thoughts."
                </p>
              </div>

              {/* Widget 3: Quick Breathing (Center Right) */}
              <div className="absolute top-1/2 -right-3 hidden sm:flex items-center gap-2 nirvana-glass rounded-full px-3 py-1.5 border border-white shadow-sm">
                <Wind className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span className="text-xs font-medium text-[#1C1917]">
                  Breathe 4-7-8
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
       * SECTION 2: EMOTIONAL CHECK-IN (Corner-to-Corner Transition)
       * ------------------------------------------------------------- */}
      <section className="w-full zone-cream-peach py-16 sm:py-24 px-6 sm:px-12 lg:px-16 xl:px-24 border-t border-[#FAF8F5]/60">
        <div className="w-full w-full text-center space-y-4">
          <span className="text-xs font-semibold text-[#E07A5F] uppercase tracking-widest">
            Daily attunement
          </span>

          <h2 className="font-display text-4xl sm:text-5xl text-[#1C1917] font-normal tracking-tight">
            How are you arriving today?
          </h2>

          <p className="text-sm sm:text-base text-[#57534E] font-light max-w-md mx-auto">
            Select what feels true right now. Nirvana quietly adapts the
            sanctuary to whatever you carry.
          </p>

          {/* Expressive Illustrated State Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
            <button
              onClick={() => {
                setSelectedMood("good");
                onEnter();
              }}
              className={`p-6 rounded-3xl border-2 text-left transition-all cursor-pointer group flex flex-col justify-between h-44 ${
                selectedMood === "good"
                  ? "bg-[#F8F6F1] border-[#E07A5F] shadow-editorial scale-102"
                  : "bg-white/80 hover:bg-white border-white/90 hover:border-[#FAF8F5]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                  ☀️
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#E07A5F] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#1C1917]">
                  I'm feeling good
                </h3>
                <p className="text-xs text-[#78716C] mt-1 font-light">
                  Ground this energy or reflect on what went well.
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedMood("heavy");
                onEnter();
              }}
              className={`p-6 rounded-3xl border-2 text-left transition-all cursor-pointer group flex flex-col justify-between h-44 ${
                selectedMood === "heavy"
                  ? "bg-[#F8F6F1] border-[#4F46E5] shadow-editorial scale-102"
                  : "bg-white/80 hover:bg-white border-white/90 hover:border-[#F8E9FF]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                  ☁️
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#1C1917]">
                  A little heavy
                </h3>
                <p className="text-xs text-[#78716C] mt-1 font-light">
                  Take a gentle pause without any rush to fix it.
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedMood("overwhelmed");
                onEnter();
              }}
              className={`p-6 rounded-3xl border-2 text-left transition-all cursor-pointer group flex flex-col justify-between h-44 ${
                selectedMood === "overwhelmed"
                  ? "bg-[#F8F6F1] border-[#E07A5F] shadow-editorial scale-102"
                  : "bg-white/80 hover:bg-white border-white/90 hover:border-[#FFD5D1]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                  🌧️
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#E07A5F] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#1C1917]">
                  Quite overwhelmed
                </h3>
                <p className="text-xs text-[#78716C] mt-1 font-light">
                  Step into quiet mode or guided 4-7-8 breathing.
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedMood("unsure");
                onEnter();
              }}
              className={`p-6 rounded-3xl border-2 text-left transition-all cursor-pointer group flex flex-col justify-between h-44 ${
                selectedMood === "unsure"
                  ? "bg-[#F8F6F1] border-[#2D6A4F] shadow-editorial scale-102"
                  : "bg-white/80 hover:bg-white border-white/90 hover:border-[#EAF6ED]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                  🌿
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#2D6A4F] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#1C1917]">
                  I don't really know
                </h3>
                <p className="text-xs text-[#78716C] mt-1 font-light">
                  That's completely fine. You can just be here in peace.
                </p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
       * SECTION 3: COMPANION (Lavender + Lilac Zone)
       * ------------------------------------------------------------- */}
      <section
        id="companion"
        className="w-full zone-lavender py-20 sm:py-32 px-6 sm:px-12 lg:px-16 xl:px-24 relative"
      >
        <div className="w-full w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Interactive Mockup Room (7 cols) */}
          <div className="lg:col-span-7 relative">
            <div className="nirvana-glass rounded-3xl p-6 sm:p-8 border-2 border-white shadow-editorial">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2DEEE]/60 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center font-serif text-sm shadow-sm">
                    N
                  </div>
                  <div>
                    <h4 className="font-display text-base font-bold text-[#1C1917]">
                      Your Space
                    </h4>
                    <span className="text-[11px] text-[#4F46E5] font-medium">
                      ● Here with you right now
                    </span>
                  </div>
                </div>

                <span className="text-xs text-[#78716C] bg-white/70 px-3 py-1 rounded-full border border-white">
                  Intimate & Attentive
                </span>
              </div>

              {/* Speech exchange */}
              <div className="space-y-4">
                <div className="p-4 sm:p-5 rounded-3xl rounded-tl-sm bg-white border border-white/90 shadow-sm text-sm sm:text-base text-[#1C1917] font-light leading-relaxed">
                  "You don't have to figure everything out right now. What's
                  sitting most heavily on your mind?"
                </div>

                <div className="ml-auto max-w-[85%] p-4 rounded-3xl rounded-tr-sm bg-[#4F46E5] text-white text-sm sm:text-base font-light leading-relaxed shadow-sm">
                  "I've been feeling like I'm falling behind everyone else, and
                  my mind just won't shut off."
                </div>

                <div className="p-4 sm:p-5 rounded-3xl rounded-tl-sm bg-white border border-white/90 shadow-sm text-sm sm:text-base text-[#1C1917] font-light leading-relaxed">
                  "Comparison is such an exhausting weight to carry. Let's take
                  just one slow breath together. Would you like to unpack where
                  that pressure started, or take two minutes to reset your body
                  first?"
                  <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#E2DEEE]/50">
                    <button
                      onClick={onEnter}
                      className="px-3 py-1.5 rounded-full bg-[#F8E9FF] text-[#4F46E5] text-xs font-semibold hover:bg-[#4F46E5] hover:text-white transition-colors"
                    >
                      🍃 Breathe for 2 minutes
                    </button>
                    <button
                      onClick={onEnter}
                      className="px-3 py-1.5 rounded-full bg-[#F8F6F1] text-[#E07A5F] text-xs font-semibold hover:bg-[#E07A5F] hover:text-white transition-colors"
                    >
                      ✍️ Write in Journal
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating context cards */}
            <div className="hidden sm:flex absolute -bottom-6 -left-6 nirvana-glass rounded-2xl p-3 border border-white shadow-editorial items-center gap-2 text-xs font-semibold text-[#4F46E5]">
              <Sparkles className="w-4 h-4" />
              <span>Remembers what matters to you</span>
            </div>

            <div className="hidden sm:flex absolute -top-4 -right-4 nirvana-glass rounded-2xl p-3 border border-white shadow-editorial items-center gap-2 text-xs font-semibold text-[#2D6A4F]">
              <Heart className="w-4 h-4" />
              <span>Adapts to your pace & mood</span>
            </div>
          </div>

          {/* Right: Editorial Narrative (5 cols) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-xs font-semibold text-[#4F46E5] uppercase tracking-widest">
              Natural conversation
            </span>

            <h2 className="font-display text-4xl sm:text-5xl text-[#1C1917] font-normal leading-tight tracking-tight">
              Someone to talk to. <br />
              <span className="italic text-[#4F46E5]">Whenever you need.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#57534E] font-light leading-relaxed">
              Nirvana isn't a chatbot that gives robotic advice. It's a
              compassionate presence that holds space, remembers your context,
              and helps you untangle thoughts at your own rhythm.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-xs">
                  ✓
                </div>
                <span className="text-sm text-[#1C1917]">
                  Natural voice and quiet text conversation
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-xs">
                  ✓
                </div>
                <span className="text-sm text-[#1C1917]">
                  Transparent memory that you can inspect or erase anytime
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#4F46E5] text-white flex items-center justify-center text-xs">
                  ✓
                </div>
                <span className="text-sm text-[#1C1917]">
                  Gentle grounding suggestions when emotions run high
                </span>
              </div>
            </div>

            <button
              onClick={onEnter}
              className="mt-4 px-6 py-3 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Talk to Nirvana</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
       * SECTION 4: JOURNAL (Honey Cream & Butter Yellow)
       * ------------------------------------------------------------- */}
      <section
        id="journal"
        className="w-full zone-honey-cream py-20 sm:py-32 px-6 sm:px-12 lg:px-16 xl:px-24"
      >
        <div className="w-full w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Editorial Narrative (5 cols) */}
          <div className="lg:col-span-5 space-y-6 text-left order-2 lg:order-1">
            <span className="text-xs font-semibold text-[#D97706] uppercase tracking-widest">
              Private writing
            </span>

            <h2 className="font-display text-4xl sm:text-5xl text-[#1C1917] font-normal leading-tight tracking-tight">
              Some things are easier <br />
              <span className="italic text-[#D97706]">
                when you write them down.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#57534E] font-light leading-relaxed">
              Your uncensored, private notebook. Spill your racing thoughts
              without formatting, judgment, or social scrutiny. Nirvana offers
              gentle compassionate reflections when you want clarity.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-[#FAF8F5] shadow-sm">
                <BookOpen className="w-5 h-5 text-[#D97706] mb-2" />
                <h4 className="font-semibold text-xs text-[#1C1917]">
                  Distraction-Free
                </h4>
                <p className="text-[11px] text-[#78716C] mt-1">
                  Spacious paper aesthetic
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#FAF8F5] shadow-sm">
                <Sparkles className="w-5 h-5 text-[#4F46E5] mb-2" />
                <h4 className="font-semibold text-xs text-[#1C1917]">
                  Gentle Reflection
                </h4>
                <p className="text-[11px] text-[#78716C] mt-1">
                  Unpacks feelings & needs
                </p>
              </div>
            </div>

            <button
              onClick={onEnter}
              className="mt-4 px-6 py-3 rounded-full bg-[#D97706] hover:bg-[#D49028] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Open Your Notebook</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Illustrated Open Notebook Layout (7 cols) */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative">
            <div className="w-full bg-[#FFFDF6] rounded-3xl p-6 sm:p-10 border-2 border-[#FAF8F5] shadow-editorial relative">
              {/* Notebook Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#D97706]/20 mb-6">
                <div className="flex items-center gap-2 text-xs text-[#78716C]">
                  <span className="text-base">☀️</span>
                  <span className="font-medium text-[#1C1917]">
                    Today's Journal Entry
                  </span>
                </div>
                <span className="text-xs text-[#D97706] font-semibold bg-[#FFF2C9] px-3 py-1 rounded-full">
                  100% Private
                </span>
              </div>

              {/* Simulated handwritten entry */}
              <div className="space-y-4">
                <h3 className="font-display text-2xl text-[#1C1917] font-bold">
                  Letting go of things I can't control
                </h3>

                <p className="font-display italic text-lg sm:text-xl text-[#57534E] leading-relaxed">
                  "Today was loud. Everyone seemed to want a piece of my
                  attention. But sitting here right now, I realize none of those
                  urgencies define who I am. I am allowed to rest."
                </p>

                {/* AI Reflection snippet */}
                <div className="mt-6 p-4 rounded-2xl bg-[#F8F6F1] border border-[#FAF8F5] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#D97706]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Nirvana's Reflection</span>
                  </div>
                  <p className="text-xs text-[#57534E] font-light leading-relaxed">
                    "You noticed your boundaries being tested today.
                    Acknowledging that rest is your birthright is a powerful act
                    of self-preservation."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
       * SECTION 5: CALM SPACE ("Take a Moment" - Mint & Sage)
       * ------------------------------------------------------------- */}
      <section
        id="breathe"
        className="w-full zone-mint-sage py-20 sm:py-32 px-6 sm:px-12 lg:px-16 xl:px-24"
      >
        <div className="w-full w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Expanding Breathing Circle Graphic (6 cols) */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            <div className="relative flex items-center justify-center w-72 h-72 sm:w-96 sm:h-96">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full bg-[#2D6A4F]/15 animate-ping opacity-30" />

              {/* Breathing Circle Container */}
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-[#C9EBDD] to-[#EAF6ED] border-4 border-white shadow-editorial flex flex-col items-center justify-center text-center p-6 animate-breathe-slow">
                <Wind className="w-8 h-8 text-[#2D6A4F] mb-2" />
                <span className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest">
                  4-7-8 Breath
                </span>
                <span className="font-display text-3xl sm:text-4xl text-[#1C1917] font-bold mt-1">
                  Inhale · Hold · Exhale
                </span>
                <span className="text-xs text-[#57534E] mt-2 font-light max-w-xs">
                  Slow your pulse, stimulate the vagus nerve, and reset your
                  nervous system.
                </span>
              </div>
            </div>
          </div>

          {/* Right: Editorial Narrative (6 cols) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <span className="text-xs font-semibold text-[#2D6A4F] uppercase tracking-widest">
              Guided Nervous System Reset
            </span>

            <h2 className="font-display text-4xl sm:text-5xl text-[#1C1917] font-normal leading-tight tracking-tight">
              Nothing needs to be solved <br />
              <span className="italic text-[#2D6A4F]">right now.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#57534E] font-light leading-relaxed">
              When thoughts are spinning, words aren't always what you need.
              Take a moment to breathe, practice 5-4-3-2-1 sensory grounding, or
              listen to real-time generated rainfall and singing bowls.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-[#C9EBDD] shadow-sm">
                <h4 className="font-display text-base font-bold text-[#1C1917]">
                  4-7-8 Breathing
                </h4>
                <p className="text-xs text-[#78716C] mt-1 font-light">
                  Rapidly settles acute panic and racing heartbeats.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#C9EBDD] shadow-sm">
                <h4 className="font-display text-base font-bold text-[#1C1917]">
                  5-4-3-2-1 Grounding
                </h4>
                <p className="text-xs text-[#78716C] mt-1 font-light">
                  Anchors awareness firmly in the physical room.
                </p>
              </div>
            </div>

            <button
              onClick={onEnter}
              className="mt-4 px-6 py-3 rounded-full bg-[#2D6A4F] hover:bg-[#245640] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Begin a 2-Minute Pause</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
       * SECTION 6: INSIGHTS (Soft Sky Blue & Violet)
       * ------------------------------------------------------------- */}
      <section
        id="insights"
        className="w-full zone-sky-violet py-20 sm:py-32 px-6 sm:px-12 lg:px-16 xl:px-24"
      >
        <div className="w-full w-full space-y-12 text-center">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-xs font-semibold text-[#4F46E5] uppercase tracking-widest">
              Self-Compassion Timeline
            </span>
            <h2 className="font-display text-4xl sm:text-5xl text-[#1C1917] font-normal tracking-tight">
              Understand yourself, <br />
              <span className="italic text-[#4F46E5]">a little better.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#57534E] font-light">
              No clinical diagnosis, anxiety scores, or percentages. Just your
              personal emotional flow over time.
            </p>
          </div>

          {/* Timeline Visual Storytelling Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="nirvana-glass rounded-3xl p-6 sm:p-8 border-2 border-white shadow-editorial space-y-3">
              <span className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">
                Rhythm of the Week
              </span>
              <h3 className="font-display text-xl text-[#1C1917] font-bold">
                Energy Peaks Mid-Week
              </h3>
              <p className="text-xs text-[#57534E] font-light leading-relaxed">
                You tend to feel most clear on Tuesdays and Wednesdays, with a
                natural dip into exhaustion by Friday evening.
              </p>
            </div>

            <div className="nirvana-glass rounded-3xl p-6 sm:p-8 border-2 border-white shadow-editorial space-y-3">
              <span className="text-xs font-bold text-[#4F46E5] uppercase tracking-wider">
                Recurring Themes
              </span>
              <h3 className="font-display text-xl text-[#1C1917] font-bold">
                Career & Sleep Stillness
              </h3>
              <p className="text-xs text-[#57534E] font-light leading-relaxed">
                Overthinking about professional futures often correlates with
                evening screen time and lack of afternoon quiet.
              </p>
            </div>

            <div className="nirvana-glass rounded-3xl p-6 sm:p-8 border-2 border-white shadow-editorial space-y-3">
              <span className="text-xs font-bold text-[#2D6A4F] uppercase tracking-wider">
                What Actually Helped
              </span>
              <h3 className="font-display text-xl text-[#1C1917] font-bold">
                Unburdening & 4-7-8 Breath
              </h3>
              <p className="text-xs text-[#57534E] font-light leading-relaxed">
                Writing down worries before attempting sleep reduced feelings of
                overwhelm in 85% of recorded instances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
       * SECTION 7: WISDOM (Ancient Parchment & Warm Gold)
       * ------------------------------------------------------------- */}
      <section
        id="wisdom"
        className="w-full zone-wisdom-gold py-20 sm:py-32 px-6 sm:px-12 lg:px-16 xl:px-24"
      >
        <div className="w-full w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Editorial Narrative (5 cols) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-xs font-semibold text-[#D97706] uppercase tracking-widest">
              Spiritual Corner
            </span>

            <h2 className="font-display text-4xl sm:text-5xl text-[#1C1917] font-normal leading-tight tracking-tight">
              Sometimes wisdom comes <br />
              <span className="italic text-[#D97706]">
                from looking inward.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#57534E] font-light leading-relaxed">
              Explore timeless verses from the Bhagavad Gita on duty, fear,
              attachment, and purpose. Grounded in verified canonical texts,
              interpreted for modern challenges without dogma.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-white text-xs text-[#D97706] border border-[#D97706]/30">
                Fear & Uncertainty
              </span>
              <span className="px-3 py-1 rounded-full bg-white text-xs text-[#D97706] border border-[#D97706]/30">
                Letting Go of Outcomes
              </span>
              <span className="px-3 py-1 rounded-full bg-white text-xs text-[#D97706] border border-[#D97706]/30">
                Finding Duty (Dharma)
              </span>
            </div>

            <button
              onClick={onEnter}
              className="mt-4 px-6 py-3 rounded-full bg-[#D97706] hover:bg-[#D49028] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Spiritual Corner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Illuminated Scripture Card (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#FFFDF6] rounded-3xl p-8 sm:p-10 border-2 border-[#D97706]/30 shadow-editorial space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#D97706]/20">
                <span className="px-3 py-1 rounded-full bg-[#FFF2C9] text-[#977313] text-xs font-bold uppercase">
                  Bhagavad Gita 2.47
                </span>
                <span className="text-xs text-[#2D6A4F] font-semibold">
                  Verified Canonical
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAF5EC] border border-[#D97706]/20 text-center space-y-2">
                <p className="font-sanskrit text-xl sm:text-2xl text-[#1C1917] font-bold leading-relaxed">
                  कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। <br />
                  मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥
                </p>
                <p className="font-serif italic text-xs text-amber-700 font-medium">
                  karmaṇy-evādhikāras te mā phaleṣu kadācana | mā karma-phala-hetur bhūr mā te saṅgo ’stvakarmaṇi ||
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block">
                  Translation
                </span>
                <p className="text-sm sm:text-base text-[#1C1917] font-light leading-relaxed">
                  "You have a right to perform your prescribed duty, but you are
                  not entitled to the fruits of action. Never consider yourself
                  the cause of results, and never be attached to inaction."
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F6F1] border border-[#FAF8F5] text-xs text-[#57534E] font-light leading-relaxed">
                <strong className="text-[#1C1917] font-semibold block mb-1">
                  Why this brings peace today:
                </strong>
                Release the crippling burden of anxious anticipation over
                outcomes you cannot control. Focus purely on the sincerity of
                your effort in this moment.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
       * SECTION 8: PRIVACY & FINAL CTA (Warm Cream & Coral)
       * ------------------------------------------------------------- */}
      <section className="w-full zone-cream-peach py-24 sm:py-36 px-6 sm:px-12 lg:px-16 xl:px-24 text-center">
        <div className="w-full w-full space-y-8">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-[#E07A5F] to-[#4F46E5] flex items-center justify-center text-white shadow-sm mb-4">
            <Heart className="w-8 h-8 fill-current" />
          </div>

          <h2 className="font-display text-4xl sm:text-6xl text-[#1C1917] font-normal tracking-tight">
            Whenever you're ready, <br />
            <span className="italic text-[#E07A5F]">Nirvana is here.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#57534E] font-light max-w-lg mx-auto leading-relaxed">
            Step into your private sanctuary. No expectations, no timelines, and
            zero judgment.
          </p>

          <div className="pt-2">
            <button
              onClick={onEnter}
              className="px-10 py-5 rounded-full bg-[#E07A5F] hover:bg-[#C25A40] text-white font-bold text-base shadow-sm hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3 cursor-pointer"
            >
              <span>Enter Your Sanctuary</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#78716C] font-light">
            <span>© Nirvana · A Calmer Space for Your Mind</span>
            <span>·</span>
            <span>Local & Encrypted Data</span>
            <span>·</span>
            <span>Right to be Forgotten Anytime</span>
          </div>
        </div>
      </section>
    </div>
  );
};


