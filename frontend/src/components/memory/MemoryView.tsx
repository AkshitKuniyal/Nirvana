import React, { useState, useEffect } from "react";
import {
  Brain,
  Trash2,
  Plus,
  Check,
  X,
  ShieldCheck,
  Sparkles,
  Lock,
  MessageCircle,
  BookOpen,
} from "lucide-react";
import { api, MemoryItem } from "../../utils/api";

export const MemoryView: React.FC = () => {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("preference");

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const data = await api.getMemories();
      setMemories(data.memories || []);
    } catch (e) {
      console.log("Error loading memories");
    }
  };

  const handleForget = async (id: string) => {
    try {
      await api.deleteMemory(id);
      setMemories((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      alert("Could not forget memory.");
    }
  };

  const handleClearAll = async () => {
    if (
      !window.confirm(
        "Forget all remembered context? Nirvana will hold space as if meeting you for the first time.",
      )
    )
      return;
    try {
      await api.clearMemories();
      setMemories([]);
    } catch (e) {
      alert("Could not clear memories.");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      const { memory } = await api.addMemory(newCategory, newContent.trim());
      setMemories((prev) => [memory, ...prev]);
      setNewContent("");
      setIsAdding(false);
    } catch (e) {
      alert("Could not add memory.");
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pb-20 space-y-10">
      {/* 1. Header */}
      <div className="zone-cream-peach rounded-4xl p-8 sm:p-12 border border-[#E7E5E4] dark:border-[#4F46E5]/25 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#FAF8F5] text-xs text-[#E07A5F] font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Memory & Privacy Transparency</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-[#1C1917] dark:text-[#F1EFE8] font-normal tracking-tight">
            Your space stays yours.
          </h1>
          <p className="text-sm sm:text-base text-[#57534E] dark:text-slate-300 font-light mt-2 max-w-xl leading-relaxed">
            Nirvana only remembers gentle context to make your space feel
            familiar. You have transparent, one-click control to inspect,
            adjust, or forget any item anytime.
          </p>
        </div>

        {memories.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-5 py-3 rounded-full bg-white dark:bg-[#1E1428] hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs font-bold text-rose-600 dark:text-rose-400 shadow-sm transition-all self-start sm:self-auto cursor-pointer"
          >
            Forget Everything
          </button>
        )}
      </div>

      {/* 2. Three Pillars of Privacy */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/90 dark:bg-[#131826]/90 backdrop-blur-xl rounded-3xl p-5 border border-[#E7E5E4] dark:border-[#232A40] shadow-editorial space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
            <MessageCircle className="w-4 h-4" />
          </div>
          <h3 className="font-display text-sm font-semibold text-[#1C1917] dark:text-[#F1EFE8]">
            Conversations
          </h3>
          <p className="text-xs text-[#57534E] dark:text-slate-300 font-light leading-relaxed">
            Kept confidential. Use the "Don't Remember" button anytime to keep
            thoughts entirely untracked.
          </p>
        </div>

        <div className="bg-white/90 dark:bg-[#131826]/90 backdrop-blur-xl rounded-3xl p-5 border border-[#E7E5E4] dark:border-[#232A40] shadow-editorial space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#FFF4D8] text-[#977313] flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="font-display text-sm font-semibold text-[#1C1917] dark:text-[#F1EFE8]">
            Your Journal
          </h3>
          <p className="text-xs text-[#57534E] dark:text-slate-300 font-light leading-relaxed">
            Private and personal. Stored safely with zero advertising,
            telemetry, or external sharing.
          </p>
        </div>

        <div className="bg-white/90 dark:bg-[#131826]/90 backdrop-blur-xl rounded-3xl p-5 border border-[#E7E5E4] dark:border-[#232A40] shadow-editorial space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#C9EBDD]/60 text-[#2D7354] flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="font-display text-sm font-semibold text-[#1C1917] dark:text-[#F1EFE8]">
            Memory Controls
          </h3>
          <p className="text-xs text-[#57534E] dark:text-slate-300 font-light leading-relaxed">
            Every memory card below has an instant [Forget] button that
            immediately purges it from your space.
          </p>
        </div>
      </div>

      {/* 3. Memory Card Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-serif text-xl font-medium text-[#1C1917] dark:text-[#F1EFE8]">
            What Nirvana Remembers ({memories.length})
          </h2>

          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-medium shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Memory</span>
            </button>
          )}
        </div>

        {/* Add Memory Modal/Form */}
        {isAdding && (
          <form
            onSubmit={handleAdd}
            className="bg-white/90 dark:bg-[#131826]/90 backdrop-blur-xl rounded-3xl p-6 border border-[#E7E5E4] dark:border-[#232A40] shadow-editorial space-y-4 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#4F46E5] uppercase tracking-wider">
                Teach Nirvana something about yourself
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="p-1 text-[#9E9AA7] hover:text-[#242330]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={2}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="e.g. 'I prefer gentle breathing exercises over long meditations', or 'I work as a designer'..."
              className="w-full p-4 rounded-2xl bg-white/80 dark:bg-[#131826]/80 border border-[#E2DEEE] dark:border-[#4F46E5]/25 text-sm text-[#1C1917] dark:text-[#F1EFE8] placeholder-[#9E9AA7] dark:placeholder-[#64748B] focus:outline-none focus:border-[#4F46E5] resize-none font-light"
            />

            <div className="flex items-center justify-between pt-1">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E1935] border border-[#E2DEEE] dark:border-[#4F46E5]/25 text-xs text-[#6F6B7A] dark:text-slate-300"
              >
                <option value="preference">Personal Preference</option>
                <option value="coping_strategy">What Helps Me</option>
                <option value="boundary">Personal Boundary</option>
                <option value="life_context">Life Background</option>
              </select>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-[#6F6B7A] dark:text-slate-300 hover:bg-white dark:hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#4F46E5] text-white text-xs font-medium shadow-sm"
                >
                  Save Context
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Empty State */}
        {memories.length === 0 ? (
          <div className="nirvana-glass rounded-3xl p-12 text-center border border-white/80 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mb-2">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-medium text-[#1C1917] dark:text-[#F1EFE8]">
              Nothing stored in memory.
            </h3>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-slate-300 font-light max-w-sm mx-auto">
              As you chat in Your Space, Nirvana will only remember helpful
              preferences with your permission.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {memories.map((m) => (
              <div
                key={m.id}
                className="nirvana-glass rounded-3xl p-5 sm:p-6 border border-white/90 shadow-glass flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#2D6A4F] font-medium text-[10px] uppercase tracking-wider">
                      {m.category.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-[#9E9AA7] font-light">
                      {new Date(m.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#1C1917] dark:text-[#F1EFE8] font-light leading-relaxed">
                    "{m.content}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E2DEEE]/50 flex items-center justify-between">
                  <span className="text-[11px] text-[#9E9AA7] dark:text-[#5A5475] font-light">
                    Active in companion context
                  </span>
                  <button
                    onClick={() => handleForget(m.id)}
                    className="flex items-center gap-1 text-xs text-rose-500 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    title="Erase this memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Forget</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


