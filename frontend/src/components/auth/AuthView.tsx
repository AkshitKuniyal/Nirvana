import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Heart,
  ArrowLeft,
} from "lucide-react";

interface AuthViewProps {
  onSuccess: (user: { name: string; email: string; isGuest?: boolean }) => void;
  onBackToLanding: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onSuccess,
  onBackToLanding,
}) => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup" && !name.trim()) {
      setError("Please tell us what name or nickname you prefer.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    // Simulating gentle auth response (stores in local session / Supabase ready)
    setTimeout(() => {
      const displayName = mode === "signup" ? name.trim() : email.split("@")[0];
      const authUser = {
        name: displayName,
        email: email.trim(),
        isGuest: false,
      };
      localStorage.setItem("nirvana_user", JSON.stringify(authUser));
      localStorage.setItem("nirvana_has_visited", "true");
      setIsLoading(false);
      onSuccess(authUser);
    }, 600);
  };

  const handleGuestEntry = () => {
    setIsLoading(true);
    setTimeout(() => {
      const guestUser = {
        name: "Friend",
        email: "guest@nirvana.space",
        isGuest: true,
      };
      localStorage.setItem("nirvana_user", JSON.stringify(guestUser));
      localStorage.setItem("nirvana_has_visited", "true");
      setIsLoading(false);
      onSuccess(guestUser);
    }, 400);
  };

  return (
    <div className="relative min-h-screen nirvana-light-bg flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Bar with Back Link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-sm text-[#6F6B7A] hover:text-[#242330] transition-colors group px-3 py-1.5 rounded-full hover:bg-white/60"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to overview</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-[#4F46E5] font-medium bg-[#EEF2FF]/70 px-3 py-1 rounded-full border border-[#4F46E5]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Your Sanctuary</span>
        </div>
      </div>

      {/* Main Glass Card */}
      <div className="max-w-md w-full mx-auto my-auto">
        <div className="nirvana-glass rounded-3xl p-8 sm:p-10 shadow-glass border border-white/80 relative overflow-hidden">
          {/* Subtle Ambient Glows Inside Card */}
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#EEF2FF] rounded-full blur-2xl pointer-events-none opacity-80" />
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#FFD5C2]/40 rounded-full blur-2xl pointer-events-none opacity-70" />

          {/* Logo & Greeting */}
          <div className="text-center relative z-10 mb-8">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#B8A7FF] flex items-center justify-center shadow-sm mb-4">
              <svg
                className="w-6 h-6 text-white"
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
            <h1 className="font-serif text-2xl sm:text-3xl text-[#242330] font-semibold tracking-tight">
              {mode === "signin" ? "Welcome back." : "Create your space."}
            </h1>
            <p className="text-sm text-[#6F6B7A] mt-2 font-light">
              {mode === "signin"
                ? "Step back into a calmer, private space that listens."
                : "A personal sanctuary designed to help you slow down and reflect."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-white/70 p-1 mb-6 border border-white/80 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all ${
                mode === "signin"
                  ? "bg-white text-[#242330] shadow-sm border border-black/5 font-semibold"
                  : "text-[#6F6B7A] hover:text-[#242330]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-medium rounded-xl transition-all ${
                mode === "signup"
                  ? "bg-white text-[#242330] shadow-sm border border-black/5 font-semibold"
                  : "text-[#6F6B7A] hover:text-[#242330]"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-[#FFD5C2]/40 border border-[#FFD5C2] text-xs text-[#242330] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-medium text-[#6F6B7A] mb-1.5 pl-1">
                  What should Nirvana call you?
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#9E9AA7] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name or nickname"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/80 border border-[#E2DEEE] text-sm text-[#242330] placeholder-[#9E9AA7] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#6F6B7A] mb-1.5 pl-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9E9AA7] absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/80 border border-[#E2DEEE] text-sm text-[#242330] placeholder-[#9E9AA7] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6F6B7A] mb-1.5 pl-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9E9AA7] absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/80 border border-[#E2DEEE] text-sm text-[#242330] placeholder-[#9E9AA7] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#9E9AA7] hover:text-[#6F6B7A]"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>Preparing your sanctuary...</span>
                </span>
              ) : (
                <>
                  <span>
                    {mode === "signin" ? "Enter Sanctuary" : "Create My Space"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2DEEE]/70" />
            </div>
            <span className="relative px-3 bg-white/70 text-xs text-[#9E9AA7] font-light">
              or continue privately
            </span>
          </div>

          {/* Instant Guest Access Button */}
          <button
            type="button"
            onClick={handleGuestEntry}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-white/80 hover:bg-white border border-[#E2DEEE] text-xs font-medium text-[#242330] shadow-sm hover:border-[#4F46E5]/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-[#4F46E5] group-hover:scale-110 transition-transform" />
            <span>Continue as Guest (No signup required)</span>
          </button>

          {/* Privacy reassurance footnote */}
          <div className="mt-8 pt-4 border-t border-white/60 flex items-center justify-center gap-2 text-[11px] text-[#6F6B7A]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span>Encrypted · Private by design · No ads</span>
          </div>
        </div>
      </div>

      {/* Footer reassurance */}
      <div className="max-w-md w-full mx-auto text-center mt-6">
        <p className="text-xs text-[#9E9AA7] font-light">
          "A calmer space for your mind."
        </p>
      </div>
    </div>
  );
};


