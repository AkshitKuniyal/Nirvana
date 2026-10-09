import React, { useState } from "react";
import {
  MessageCircle,
  BookOpen,
  Wind,
  Compass,
  LineChart,
  Brain,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Shield,
  Menu,
  X,
  Home,
  User,
  LogOut,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  openAudioModal: () => void;
  openSettings: () => void;
  isAudioPlaying: boolean;
  currentUser?: { name?: string; email?: string; isGuest?: boolean } | null;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  openAudioModal,
  openSettings,
  isAudioPlaying,
  currentUser,
  onSignOut,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Sanctuary", icon: Home },
    { id: "companion", label: "Space", icon: MessageCircle },
    { id: "journal", label: "Journal", icon: BookOpen },
    { id: "wellness", label: "Breathe", icon: Wind },
    { id: "gita", label: "Wisdom", icon: Compass },
    { id: "insights", label: "Insights", icon: LineChart },
    { id: "memory", label: "Memory", icon: Brain },
  ];

  return (
    <div className="sticky top-3 sm:top-5 z-40 w-full px-4 sm:px-8 lg:px-12 pointer-events-none mb-6 sm:mb-8">
      <header
        className="w-full backdrop-blur-xl rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between border border-stone-200 dark:border-stone-800 shadow-sm pointer-events-auto transition-colors duration-200"
        style={{ background: "var(--navbar-bg)" }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView("home")}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0 pl-1"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <svg
              className="w-4 h-4 text-white"
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
          <span className="font-display text-base font-bold tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            NIRVANA
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                title={item.label}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/70 dark:hover:bg-stone-800/60"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-white dark:text-stone-900" : "text-stone-400 dark:text-stone-500"}`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 shrink-0 pr-1">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
            className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors cursor-pointer"
            aria-label="Toggle theme mode"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Quick Ambient Audio Toggle */}
          <button
            onClick={openAudioModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
              isAudioPlaying
                ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-sm"
                : "border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100"
            }`}
            title="Calm Ambient Sounds"
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="hidden lg:inline text-xs">Sounds</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0" />
                <span className="hidden lg:inline text-xs">Sounds</span>
              </>
            )}
          </button>

          {/* Privacy & Settings */}
          <button
            onClick={openSettings}
            className="p-1.5 rounded-full text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer"
            title="Privacy & Settings"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* User Profile Avatar / Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center font-semibold text-xs hover:border-stone-400 transition-all cursor-pointer shadow-sm"
              title={currentUser?.name || "Your Profile"}
            >
              {currentUser?.name ? (
                currentUser.name.charAt(0).toUpperCase()
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 rounded-2xl p-2 border border-stone-200 dark:border-stone-800 shadow-lg text-left z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800">
                  <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                    {currentUser?.name || "Sanctuary Friend"}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                    {currentUser?.isGuest
                      ? "Guest Session"
                      : currentUser?.email || "Private"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    openSettings();
                  }}
                  className="w-full mt-1 px-3 py-2 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl flex items-center gap-2 text-left font-medium transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-stone-500" />
                  <span>Privacy & Memories</span>
                </button>
                {onSignOut && (
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onSignOut();
                    }}
                    className="w-full px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl flex items-center gap-2 text-left font-medium transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full mt-2 bg-white dark:bg-stone-900 rounded-2xl p-2.5 border border-stone-200 dark:border-stone-800 shadow-lg pointer-events-auto animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm"
                      : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${isActive ? "text-white dark:text-stone-900" : "text-stone-400"}`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          {/* Mobile Sign Out */}
          {onSignOut && (
            <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
