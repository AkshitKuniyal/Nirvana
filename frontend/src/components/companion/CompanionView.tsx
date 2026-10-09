import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Mic,
  MicOff,
  EyeOff,
  Sparkles,
  PhoneCall,
  PhoneOff,
  Wind,
  BookOpen,
  Volume2,
  Compass,
  Radio,
  Settings2,
  VolumeX,
} from "lucide-react";
import { api, ChatMessage } from "../../utils/api";

interface CompanionViewProps {
  onNavigate: (view: string) => void;
  openAudioModal: () => void;
}

const CURATED_VOICES = [
  { id: "Luna", name: "Luna", label: "Calm & Relaxing (Female)" },
  { id: "Serena", name: "Serena", label: "Soft & Nurturing (Female)" },
  { id: "Evelyn", name: "Evelyn", label: "Gentle & Intimate (Female)" },
  { id: "Gareth", name: "Gareth", label: "Grounded & Gentle (Male)" },
  { id: "Dennis", name: "Dennis", label: "Warm & Friendly (Male)" },
];

export const CompanionView: React.FC<CompanionViewProps> = ({
  onNavigate,
  openAudioModal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "companion",
      content:
        "I'm right here with you. There's no hurry, and no need to explain everything from the beginning. What feels heavy or present for you right now?",
      suggested_actions: [
        { label: "I don't want to talk right now", action: "quiet_mode" },
        { label: "Breathe for a moment", action: "breathing" },
        { label: "Unpack a thought", action: "journal" },
      ],
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Live 1-on-1 Voice Call States
  const [isLiveCall, setIsLiveCall] = useState(false);
  const [callStatus, setCallStatus] = useState<"listening" | "thinking" | "speaking" | "idle">("idle");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("Luna");
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [dontRememberNext, setDontRememberNext] = useState(false);
  const [memoryNotification, setMemoryNotification] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const isLiveCallRef = useRef<boolean>(false);
  const callStatusRef = useRef<string>("idle");

  // Keep refs in sync for asynchronous callbacks
  useEffect(() => {
    isLiveCallRef.current = isLiveCall;
  }, [isLiveCall]);

  useEffect(() => {
    callStatusRef.current = callStatus;
  }, [callStatus]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, callStatus]);

  // Check for prefilled thought from Home
  useEffect(() => {
    const initialThought = sessionStorage.getItem("nirvana_initial_msg");
    if (initialThought) {
      sessionStorage.removeItem("nirvana_initial_msg");
      handleSend(initialThought);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
      stopSpeechRecognition();
    };
  }, []);

  const stopAllAudio = () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
      activeAudioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Play audio response (Inworld AI MP3 base64 or browser Web Speech fallback)
  const playCompanionAudio = useCallback(
    (text: string, audioBase64?: string): Promise<void> => {
      return new Promise((resolve) => {
        stopAllAudio();
        setCallStatus("speaking");

        // Safety timeout: always resolve within a bounded time so the mic loop never hangs
        const safetyMs = Math.min(14000, Math.max(3000, text.length * 80));
        let settled = false;
        const safetyTimer = setTimeout(() => {
          if (!settled) {
            settled = true;
            resolve();
          }
        }, safetyMs);

        const done = () => {
          if (!settled) {
            settled = true;
            clearTimeout(safetyTimer);
            resolve();
          }
        };

        // 1. If authentic Inworld AI MP3 audio was returned
        if (audioBase64) {
          try {
            const audioUrl = `data:audio/mp3;base64,${audioBase64}`;
            const audio = new Audio(audioUrl);
            activeAudioRef.current = audio;

            audio.onended = () => {
              activeAudioRef.current = null;
              done();
            };

            audio.onerror = () => {
              activeAudioRef.current = null;
              // Fallback to browser synthesis if audio failed
              fallbackSpeechSynthesis(text, done);
            };

            audio.play().catch(() => {
              fallbackSpeechSynthesis(text, done);
            });
            return;
          } catch (e) {
            console.warn("Audio playback error, falling back to speech synthesis:", e);
          }
        }

        // 2. Browser Web Speech API fallback
        fallbackSpeechSynthesis(text, done);
      });
    },
    []
  );

  const fallbackSpeechSynthesis = (text: string, onDone: () => void) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.93;
      utterance.pitch = 1.0;
      utterance.onend = () => onDone();
      utterance.onerror = () => onDone();
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(onDone, 2000);
    }
  };

  // Safe Speech Recognition management
  const stopSpeechRecognition = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
  };

  const startListeningLoop = useCallback(() => {
    if (!isLiveCallRef.current) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      setIsLiveCall(false);
      return;
    }

    stopSpeechRecognition();
    setCallStatus("listening");
    setLiveTranscript("");

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      let accumulatedFinal = "";

      recognition.onstart = () => {
        if (isLiveCallRef.current) {
          setCallStatus("listening");
        }
      };

      recognition.onresult = (event: any) => {
        if (!isLiveCallRef.current || callStatusRef.current === "speaking") return;

        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            accumulatedFinal += " " + trans;
          } else {
            interim += trans;
          }
        }

        const currentSaid = (accumulatedFinal + " " + interim).trim();
        setLiveTranscript(currentSaid);

        // Reset silence timer on every new speech token (Voice Activity Detection)
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        // When user pauses for ~1100ms, automatically trigger companion turn!
        if (currentSaid.length > 2) {
          silenceTimerRef.current = setTimeout(() => {
            const spokenText = currentSaid;
            setLiveTranscript("");
            accumulatedFinal = "";
            stopSpeechRecognition();
            handleSend(spokenText, true);
          }, 1100);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === "no-speech") {
          // Normal background silence, continue listening quietly
          return;
        }
        if (isLiveCallRef.current && callStatusRef.current === "listening") {
          setTimeout(() => {
            if (isLiveCallRef.current && callStatusRef.current === "listening") {
              startListeningLoop();
            }
          }, 600);
        }
      };

      recognition.onend = () => {
        // Automatically resurrect listening if call is still active and companion is not speaking
        if (isLiveCallRef.current && callStatusRef.current === "listening") {
          setTimeout(() => {
            if (isLiveCallRef.current && callStatusRef.current === "listening") {
              startListeningLoop();
            }
          }, 400);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn("Speech recognition initialization note:", e);
    }
  }, []);

  // Main Send turn handler (Text or Real-Time Voice)
  const handleSend = async (customText?: string, isFromVoice: boolean = false) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    const useVoice = isFromVoice || isLiveCall;
    if (useVoice) {
      setCallStatus("thinking");
    }

    try {
      const res = await api.sendMessage(
        textToSend.trim(),
        messages.slice(-8),
        !dontRememberNext,
        {},
        useVoice,
        selectedVoice
      );

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "companion",
        content: res.message || res.reply,
        suggested_actions: res.suggested_actions,
        action_type: res.action_type,
        resources: res.resources,
        follow_up_memories: res.follow_up_memories,
      };

      setMessages((prev) => [...prev, botMsg]);

      if (res.extracted_memory || res.memory_saved) {
        const memText = res.extracted_memory?.fact || res.memory_saved || "";
        setMemoryNotification(`Gently remembered: "${memText.slice(0, 48)}..."`);
        setTimeout(() => setMemoryNotification(null), 5000);
      }

      if (dontRememberNext) {
        setDontRememberNext(false);
      }

      // If voice conversation is active, speak naturally and auto-listen after speech ends!
      if (useVoice && (res.message || res.reply)) {
        await playCompanionAudio(res.message || res.reply, res.audio_base64);

        // Turn loop: Resume listening immediately without requiring user to touch mic!
        if (isLiveCallRef.current) {
          startListeningLoop();
        } else {
          setCallStatus("idle");
        }
      }
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "companion",
        content: "I am taking a slow breath right here with you. Please give me a small moment.",
      };
      setMessages((prev) => [...prev, errorMsg]);

      if (useVoice && isLiveCallRef.current) {
        setTimeout(() => {
          if (isLiveCallRef.current) startListeningLoop();
        }, 1500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Live 1-on-1 Voice Call
  const toggleLiveCall = async () => {
    if (isLiveCall) {
      // End Call
      setIsLiveCall(false);
      setCallStatus("idle");
      stopAllAudio();
      stopSpeechRecognition();
      setLiveTranscript("");
    } else {
      // Request mic permission and unlock browser autoplay before starting
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        console.warn("Mic permission denied:", err);
        alert("Please allow microphone access to use live voice conversation.");
        return;
      }
      // Unlock browser autoplay policy with a silent audio snippet
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const buf = ctx.createBuffer(1, 1, 22050);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start(0);
        setTimeout(() => ctx.close(), 200);
      } catch (_) {}

      // Start Real-Time 1-on-1 Conversation
      setIsLiveCall(true);
      setCallStatus("listening");
      stopAllAudio();
      setTimeout(() => {
        startListeningLoop();
      }, 200);
    }
  };

  // Interrupt current response
  const interruptSpeaking = () => {
    stopAllAudio();
    if (isLiveCall) {
      startListeningLoop();
    } else {
      setCallStatus("idle");
    }
  };

  const handleActionClick = (action: string) => {
    if (action === "breathing") onNavigate("wellness");
    else if (action === "journal") onNavigate("journal");
    else if (action === "calm_sounds") openAudioModal();
    else if (action === "quiet_mode") {
      handleSend("I don't want to talk right now.");
    } else if (action === "gita") onNavigate("gita");
  };

  return (
    <div className="w-full h-full px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col overflow-hidden pt-4 pb-4">
      {/* 1. Header with Real-Time Call Toggle */}
      <div className="bg-white dark:bg-[#181B24] rounded-3xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm relative">
            <Sparkles className="w-5 h-5" />
            {isLiveCall && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#181B24] animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                Your Space
              </h2>
              {isLiveCall ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Voice Active · Inworld AI
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Here with you
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {isLiveCall
                ? "Hands-free continuous conversation — speak anytime"
                : "Attentive, quiet, and holding space"}
            </p>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          {/* Main 1-on-1 Voice Call Button */}
          <button
            onClick={toggleLiveCall}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-sm ${
              isLiveCall
                ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
            title={isLiveCall ? "End Live Voice Call" : "Start Hands-Free 1-on-1 Talking"}
          >
            {isLiveCall ? (
              <>
                <PhoneOff className="w-3.5 h-3.5" />
                <span>End Call</span>
              </>
            ) : (
              <>
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Live Voice Call</span>
              </>
            )}
          </button>

          {/* Voice Selector Settings */}
          <div className="relative">
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className="p-2 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
              title="Voice Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            {showVoiceSettings && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1C202C] rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-3 z-50 space-y-2">
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block px-1">
                  Inworld Companion Voice
                </span>
                <div className="space-y-1">
                  {CURATED_VOICES.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVoice(v.id);
                        setShowVoiceSettings(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        selectedVoice === v.id
                          ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold"
                          : "hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                      }`}
                    >
                      <div>
                        <div className="font-medium">{v.name}</div>
                        <div className="text-[10px] text-stone-400 dark:text-stone-500">{v.label}</div>
                      </div>
                      {selectedVoice === v.id && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Privacy Forget Next */}
          <button
            onClick={() => setDontRememberNext(!dontRememberNext)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
              dontRememberNext
                ? "border-amber-200 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100"
            }`}
            title="When active, the next message is kept private and not stored in long-term memory"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {dontRememberNext ? "Don't Remember" : "Memory On"}
            </span>
          </button>
        </div>
      </div>

      {/* Memory Toast */}
      {memoryNotification && (
        <div className="my-2 p-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <span>{memoryNotification}</span>
          <button
            onClick={() => onNavigate("memory")}
            className="text-indigo-600 dark:text-indigo-400 underline ml-3 font-medium"
          >
            View Memory
          </button>
        </div>
      )}

      {/* 2. LIVE VOICE CALL PRESENCE ORB (Appears during Live Call) */}
      {isLiveCall && (
        <div className="my-4 py-8 px-6 bg-gradient-to-b from-indigo-50/70 via-white to-stone-50/50 dark:from-indigo-950/20 dark:via-[#151822] dark:to-[#12151D] rounded-3xl border border-indigo-100 dark:border-indigo-900/30 shadow-editorial flex flex-col items-center justify-center text-center relative overflow-hidden transition-all">
          {/* Ambient Glow */}
          <div
            className={`absolute w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-700 ${
              callStatus === "speaking"
                ? "bg-amber-400"
                : callStatus === "listening"
                ? "bg-indigo-500 scale-110"
                : "bg-violet-400"
            }`}
          />

          {/* Central Pulsing Audio Orb */}
          <div className="relative mb-5 flex items-center justify-center">
            {/* Outer animated rings */}
            <div
              className={`absolute w-36 h-36 rounded-full border border-indigo-400/30 dark:border-indigo-500/20 transition-all duration-500 ${
                callStatus === "listening"
                  ? "animate-ping opacity-25"
                  : callStatus === "speaking"
                  ? "scale-110 opacity-40 animate-pulse"
                  : "opacity-10"
              }`}
            />
            <div
              className={`absolute w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-md transition-all duration-500 ${
                callStatus === "speaking" ? "scale-125" : "scale-100"
              }`}
            />

            {/* Inner Interactive Orb */}
            <button
              onClick={callStatus === "speaking" ? interruptSpeaking : undefined}
              className={`relative z-10 w-24 h-24 rounded-full shadow-2xl flex flex-col items-center justify-center border-2 transition-all duration-500 ${
                callStatus === "speaking"
                  ? "bg-gradient-to-br from-indigo-600 to-violet-700 border-amber-300 text-white cursor-pointer scale-105"
                  : callStatus === "thinking"
                  ? "bg-gradient-to-br from-violet-600 to-indigo-700 border-indigo-300 text-white animate-spin-slow"
                  : "bg-gradient-to-br from-indigo-500 to-indigo-600 border-white text-white scale-100"
              }`}
              title={callStatus === "speaking" ? "Tap to interrupt" : "Nirvana Presence"}
            >
              {callStatus === "speaking" ? (
                <Volume2 className="w-8 h-8 animate-pulse text-amber-200" />
              ) : callStatus === "listening" ? (
                <Mic className="w-8 h-8 animate-pulse" />
              ) : (
                <Sparkles className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* Real-Time Live Status Pill */}
          <div className="space-y-1.5 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur border border-stone-200 dark:border-stone-800 text-xs font-semibold shadow-sm">
              <span
                className={`w-2 h-2 rounded-full ${
                  callStatus === "speaking"
                    ? "bg-amber-500 animate-pulse"
                    : callStatus === "listening"
                    ? "bg-emerald-500 animate-ping"
                    : "bg-indigo-500 animate-spin"
                }`}
              />
              <span className="text-stone-800 dark:text-stone-200">
                {callStatus === "speaking"
                  ? `Nirvana Speaking (${selectedVoice})`
                  : callStatus === "thinking"
                  ? "Reflecting on your words..."
                  : "Listening to your voice..."}
              </span>
            </div>

            {/* Live Real-time transcript preview */}
            {liveTranscript ? (
              <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300 max-w-lg mx-auto italic px-4 py-1.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 animate-in fade-in">
                "{liveTranscript}"
              </p>
            ) : (
              <p className="text-xs text-stone-500 dark:text-stone-400 font-light max-w-sm mx-auto">
                {callStatus === "speaking"
                  ? "Tap the orb anytime to interrupt and speak"
                  : "Speak freely. When you pause, Nirvana naturally responds."}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 3. Spacious Conversation Stream */}
      <div className="flex-1 min-h-0 overflow-y-auto py-4 space-y-4 pr-1 sm:pr-2">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          const isSafety = msg.action_type === "SAFETY_MODE";

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-2`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[88%] sm:max-w-[76%] p-5 sm:p-6 rounded-3xl text-sm sm:text-base leading-relaxed ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-tr-sm shadow-sm"
                    : isSafety
                    ? "border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 rounded-tl-sm shadow-sm"
                    : "bg-white dark:bg-[#181B24] text-stone-900 dark:text-stone-100 rounded-tl-sm border border-stone-200 dark:border-stone-800 shadow-sm"
                }`}
              >
                {/* Content */}
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Suggested Action Chips */}
                {!isUser && msg.suggested_actions && msg.suggested_actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                    {msg.suggested_actions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(act.action)}
                        className="px-3 py-1.5 rounded-full bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-xs font-medium text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {act.action === "breathing" && <Wind className="w-3 h-3 text-indigo-600" />}
                        {act.action === "journal" && <BookOpen className="w-3 h-3 text-amber-600" />}
                        {act.action === "calm_sounds" && <Volume2 className="w-3 h-3 text-indigo-600" />}
                        {act.action === "gita" && <Compass className="w-3 h-3 text-rose-600" />}
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && !isLiveCall && (
          <div className="flex items-center gap-2 text-xs text-stone-500 pl-3 py-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="font-light">Nirvana is reflecting...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Bottom Input Bar */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isLiveCall
                ? "Live voice active — speak aloud or type here..."
                : "Share what's on your mind, or start Live Voice Call above..."
            }
            className="w-full py-4 pl-5 pr-28 rounded-3xl bg-white dark:bg-[#181B24] border border-stone-200 dark:border-stone-800 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
          />

          <div className="absolute right-2.5 flex items-center gap-1.5">
            {/* Quick Mic trigger / Live Call Switch */}
            <button
              type="button"
              onClick={toggleLiveCall}
              className={`p-2 rounded-2xl transition-all cursor-pointer ${
                isLiveCall
                  ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                  : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800"
              }`}
              title={isLiveCall ? "Live Call Active (Tap to end)" : "Start Real-Time Voice Call"}
            >
              {isLiveCall ? <Radio className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
                inputText.trim() && !isLoading
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
