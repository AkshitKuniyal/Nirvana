import React, { useState, useEffect } from "react";
import {
  X,
  Volume2,
  CloudRain,
  Waves,
  Wind,
  Bell,
  Square,
  Play,
} from "lucide-react";
import { ambientAudio } from "../../utils/ambientAudio";

interface AudioPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAudioPlaying: boolean;
  setIsAudioPlaying: (playing: boolean) => void;
}

export const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({
  isOpen,
  onClose,
  isAudioPlaying,
  setIsAudioPlaying,
}) => {
  const [activeSound, setActiveSound] = useState<
    "rain" | "waves" | "wind" | "bowl" | "off"
  >(ambientAudio.getCurrentSound());
  const [volume, setVolume] = useState<number>(ambientAudio.getVolume());
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);

  useEffect(() => {
    setActiveSound(ambientAudio.getCurrentSound());
  }, [isOpen]);

  const selectSound = (sound: "rain" | "waves" | "wind" | "bowl") => {
    if (activeSound === sound && isAudioPlaying) {
      ambientAudio.stop();
      setActiveSound("off");
      setIsAudioPlaying(false);
    } else {
      ambientAudio.play(sound);
      setActiveSound(sound);
      setIsAudioPlaying(true);
    }
  };

  const handleStop = () => {
    ambientAudio.stop();
    setActiveSound("off");
    setIsAudioPlaying(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    ambientAudio.setVolume(val);
  };

  const handleSetTimer = (mins: number) => {
    setTimerMinutes(mins);
    window.setTimeout(
      () => {
        handleStop();
        setTimerMinutes(null);
      },
      mins * 60 * 1000,
    );
  };

  if (!isOpen) return null;

  const soundOptions = [
    {
      id: "rain",
      label: "Gentle Rain",
      desc: "Continuous soft rainfall on a quiet leaf canopy",
      icon: CloudRain,
      color: "bg-[#DDE8E4]/50 text-[#2B7AA1]",
    },
    {
      id: "waves",
      label: "Ocean Waves",
      desc: "Rhythmic rolling sea foam and distant tide",
      icon: Waves,
      color: "bg-[#C9EBDD]/60 text-[#2D7354]",
    },
    {
      id: "wind",
      label: "Forest Wind",
      desc: "Slow rustle of warm wind through mountain pine trees",
      icon: Wind,
      color: "bg-[#EEF2FF] text-[#4F46E5]",
    },
    {
      id: "bowl",
      label: "Singing Bowl",
      desc: "432Hz harmonic Tibetan metal singing bowl resonance",
      icon: Bell,
      color: "bg-[#FFF4D8] text-[#977313]",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="nirvana-glass rounded-3xl max-w-md w-full p-6 sm:p-8 border border-white/90 shadow-glass-modal space-y-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2DEEE]/60">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#4F46E5]" />
            <h3 className="font-serif text-lg font-medium text-[#1C1917] dark:text-[#F1EFE8]">
              Calm Ambient Sounds
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#9E9AA7] hover:text-[#1C1917] dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sound Selection Grid */}
        <div className="grid grid-cols-2 gap-3">
          {soundOptions.map((item) => {
            const Icon = item.icon;
            const isPlayingThis = activeSound === item.id && isAudioPlaying;
            return (
              <button
                key={item.id}
                onClick={() => selectSound(item.id as any)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-28 ${
                  isPlayingThis
                    ? "bg-[#EEF2FF] dark:bg-[#45423E] border-[#4F46E5] dark:border-[#4F46E5] shadow-sm scale-102"
                    : "bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 border-white/80 dark:border-white/10 hover:border-[#E7E5E4] dark:hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isPlayingThis && (
                    <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-ping" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-xs text-[#1C1917] dark:text-[#F1EFE8]">
                    {item.label}
                  </h4>
                  <p className="text-[10px] text-[#57534E] dark:text-[#A3A19C] line-clamp-1 font-light">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Volume Slider */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-[#6F6B7A] dark:text-[#A3A19C]">
            <span>Volume</span>
            <span>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-1.5 bg-[#E2DEEE] rounded-lg appearance-none cursor-pointer accent-[#4F46E5]"
          />
        </div>

        {/* Sleep Timer */}
        <div className="space-y-2 pt-2 border-t border-[#E2DEEE]/60">
          <span className="text-xs text-[#6F6B7A] dark:text-[#A3A19C] block">
            Auto-stop timer:
          </span>
          <div className="flex gap-2">
            {[10, 20, 45].map((m) => (
              <button
                key={m}
                onClick={() => handleSetTimer(m)}
                className={`flex-1 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  timerMinutes === m
                    ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                    : "bg-white/80 dark:bg-white/10 text-[#6F6B7A] dark:text-[#A3A19C] border-[#E7E5E4] dark:border-white/10 hover:bg-white dark:hover:bg-white/20"
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        {/* Master Stop Button */}
        {isAudioPlaying && (
          <button
            onClick={handleStop}
            className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium border border-rose-200 transition-colors flex items-center justify-center gap-2"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Turn Off All Ambient Sound</span>
          </button>
        )}
      </div>
    </div>
  );
};

