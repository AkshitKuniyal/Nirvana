import React, { useState } from "react";
import { Sparkles, Check, ArrowRight } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (preferences: any) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [selectedIntent, setSelectedIntent] = useState<string>("talk");
  const [interactionMode, setInteractionMode] = useState<string>("both");
  const [spiritualEnabled, setSpiritualEnabled] = useState<boolean>(true);

  if (!isOpen) return null;

  const intents = [
    {
      id: "talk",
      label: "Somewhere to talk freely",
      desc: "Unburden thoughts without being judged",
    },
    {
      id: "clear_mind",
      label: "A place to clear my mind",
      desc: "Breathe, listen to calm sounds, and settle",
    },
    {
      id: "understand",
      label: "A place to understand myself",
      desc: "Notice gentle patterns and recurring feelings",
    },
    {
      id: "journal",
      label: "A private space to write",
      desc: "Unpack messy emotions on your own terms",
    },
    {
      id: "spiritual",
      label: "A space for timeless reflection",
      desc: "Explore grounded wisdom from the Bhagavad Gita",
    },
    {
      id: "unsure",
      label: "I don't really know yet",
      desc: "Just take it one quiet moment at a time",
    },
  ];

  const handleFinish = () => {
    onComplete({
      intent: selectedIntent,
      interaction_mode: interactionMode,
      spiritual_guidance_enabled: spiritualEnabled,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg nirvana-glass rounded-3xl p-6 sm:p-8 border border-white/90 shadow-glass-modal">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5 text-xs text-[#4F46E5] font-medium bg-[#EEF2FF] px-3 py-1 rounded-full border border-[#4F46E5]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to Nirvana</span>
          </div>
          <button
            onClick={handleFinish}
            className="text-xs text-[#6F6B7A] hover:text-[#242330] transition-colors cursor-pointer"
          >
            Skip for now
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif text-[#242330] font-normal">
                What would you like this space to be for you?
              </h2>
              <p className="text-xs sm:text-sm text-[#6F6B7A] font-light mt-1">
                Choose what feels true today. You can always change this later.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {intents.map((item) => {
                const isSelected = selectedIntent === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIntent(item.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#EEF2FF] border-[#4F46E5] shadow-sm"
                        : "bg-white/70 hover:bg-white border-white/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium text-[#242330]">
                        {item.label}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#4F46E5]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#6F6B7A] mt-0.5 font-light">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 px-6 rounded-2xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-medium shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif text-[#242330] font-normal">
                How do you prefer to express yourself?
              </h2>
              <p className="text-xs sm:text-sm text-[#6F6B7A] font-light mt-1">
                Nirvana supports both spoken and typed moments.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "both",
                  label: "Both voice and text",
                  sub: "I like talking sometimes and writing other times",
                },
                {
                  id: "text",
                  label: "Mostly typing & writing",
                  sub: "I prefer quiet, distraction-free text",
                },
                {
                  id: "voice",
                  label: "Mostly voice conversation",
                  sub: "Speaking helps me untangle thoughts faster",
                },
              ].map((opt) => {
                const isSelected = interactionMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setInteractionMode(opt.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#EEF2FF] border-[#4F46E5] shadow-sm"
                        : "bg-white/70 hover:bg-white border-white/80"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium text-[#242330]">
                        {opt.label}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#4F46E5]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#6F6B7A] mt-0.5 font-light">
                      {opt.sub}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-2xl bg-white border border-[#E2DEEE] text-xs font-medium text-[#6F6B7A]"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3 px-6 rounded-2xl bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-medium shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter Your Sanctuary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


