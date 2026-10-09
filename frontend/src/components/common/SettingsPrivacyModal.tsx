import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  Download,
  Trash2,
  Compass,
  Eye,
  User,
  CheckCircle,
  AlertOctagon,
  Lock,
} from "lucide-react";
import { api } from "../../utils/api";

interface SettingsPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  spiritualEnabled: boolean;
  setSpiritualEnabled: (val: boolean) => void;
  onDataPurged: () => void;
  currentUser?: { name: string; email: string; isGuest?: boolean } | null;
}

export const SettingsPrivacyModal: React.FC<SettingsPrivacyModalProps> = ({
  isOpen,
  onClose,
  spiritualEnabled,
  setSpiritualEnabled,
  onDataPurged,
  currentUser,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await api.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nirvana-sanctuary-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMessage("All personal data exported to JSON successfully.");
    } catch (e) {
      alert("Failed to export data.");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePurge = async () => {
    if (
      !window.confirm(
        "PERMANENT ACTION: This will irrevocably erase all your memories, journal entries, mood logs, and saved verses. Proceed?",
      )
    )
      return;

    setIsPurging(true);
    try {
      await api.purgeAllData();
      onDataPurged();
    } catch (e) {
      alert("Failed to purge data.");
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="nirvana-glass rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-white/90 shadow-glass-modal space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2DEEE]/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#4F46E5]" />
            <h3 className="font-serif text-lg font-medium text-[#1C1917] dark:text-[#F1EFE8]">
              Privacy & Preferences
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#9E9AA7] hover:text-[#1C1917] dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Context */}
        {currentUser && (
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-white/10 border border-[#E7E5E4] dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#EEF2FF] dark:bg-[#45423E] text-[#4F46E5] dark:text-[#4F46E5] font-semibold text-xs flex items-center justify-center">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1C1917] dark:text-[#F1EFE8]">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-[#57534E] dark:text-[#A3A19C]">
                  {currentUser.isGuest ? "Guest Session" : currentUser.email}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-medium text-[#4F46E5] bg-[#EDF8F3] px-2.5 py-1 rounded-full border border-[#C9EBDD]">
              Active
            </span>
          </div>
        )}

        {/* Notification / Feedback */}
        {statusMessage && (
          <div className="p-3 rounded-2xl bg-[#EDF8F3] border border-[#C9EBDD] text-xs text-[#2D7354] flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Preference 1: Spiritual Guidance */}
        <div className="nirvana-glass rounded-2xl p-4 sm:p-5 border border-white/80 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#977313]" />
              <h4 className="text-sm font-medium text-[#1C1917] dark:text-[#F1EFE8]">
                Spiritual & Gita Reflections
              </h4>
            </div>
            <p className="text-xs text-[#57534E] dark:text-[#A3A19C] font-light leading-relaxed">
              Allow companion to gently offer timeless Bhagavad Gita thoughts
              when you unpack feelings of deep uncertainty or career anxiety.
            </p>
          </div>
          <button
            onClick={() => setSpiritualEnabled(!spiritualEnabled)}
            className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer shrink-0 ${
              spiritualEnabled ? "bg-[#4F46E5]" : "bg-[#E2DEEE]"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                spiritualEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Preference 2: Data Export */}
        <div className="nirvana-glass rounded-2xl p-4 sm:p-5 border border-white/80 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-[#4F46E5]" />
              <h4 className="text-sm font-medium text-[#1C1917] dark:text-[#F1EFE8]">
                Export Sanctuary Data
              </h4>
            </div>
            <p className="text-xs text-[#57534E] dark:text-[#A3A19C] font-light">
              Download all your private journals, memories, and mood logs as an
              offline JSON archive.
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#1E1935] border border-[#E7E5E4] dark:border-[#4F46E5]/25 hover:border-[#4F46E5] text-xs font-medium text-[#1C1917] dark:text-[#F1EFE8] hover:text-[#4F46E5] dark:hover:text-[#4F46E5] transition-all shrink-0 cursor-pointer"
          >
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>

        {/* Preference 3: Full Purge (Right to be Forgotten) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertOctagon className="w-4 h-4" />
            <h4 className="text-sm font-semibold">Irrevocable Data Purge</h4>
          </div>
          <p className="text-xs text-rose-800 font-light leading-relaxed">
            Erase all memories, reflections, journal entries, and reset Nirvana
            completely. This cannot be undone.
          </p>
          <button
            onClick={handlePurge}
            disabled={isPurging}
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>
              {isPurging ? "Purging everything..." : "Erase All Sanctuary Data"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

