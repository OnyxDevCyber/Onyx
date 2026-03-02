'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Palette } from 'lucide-react';
import { useUser } from '@/context/user-context';
import { clsx } from 'clsx';

const THEMES = [
  { id: 'onyx', name: 'Onyx', color: 'bg-zinc-900', border: 'border-zinc-700', description: 'Classic dark mode' },
  { id: 'midnight', name: 'Midnight', color: 'bg-blue-950', border: 'border-blue-800', description: 'Deep blue night' },
  { id: 'forest', name: 'Forest', color: 'bg-emerald-950', border: 'border-emerald-800', description: 'Natural greens' },
  { id: 'crimson', name: 'Crimson', color: 'bg-red-950', border: 'border-red-800', description: 'Bold red accents' },
  { id: 'royal', name: 'Royal', color: 'bg-purple-950', border: 'border-purple-800', description: 'Regal purple tones' },
] as const;

export default function AppearancePage() {
  const router = useRouter();
  const { user, updateUser } = useUser();

  if (!user) return null;

  const currentTheme = user?.chatTheme || 'onyx';

  return (
    <div className="flex flex-col min-h-screen bg-black p-4 pb-24 max-w-md mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 pt-2">
        <button 
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full hover:bg-zinc-900 transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">Appearance</h1>
      </div>

      <div className="space-y-6">
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-zinc-400" />
            <h2 className="text-sm font-medium text-white">Chat Theme</h2>
          </div>
          
          <div className="space-y-2">
            {THEMES.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <motion.button
                  key={theme.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateUser({ chatTheme: theme.id })}
                  className={clsx(
                    "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                    isSelected 
                      ? "bg-white/10 border-white/20" 
                      : "bg-transparent border-transparent hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      "w-10 h-10 rounded-full shadow-lg border-2 border-white/10",
                      theme.color
                    )} />
                    <div className="text-left">
                      <p className={clsx("text-sm font-medium", isSelected ? "text-white" : "text-zinc-300")}>
                        {theme.name}
                      </p>
                      <p className="text-xs text-zinc-500">{theme.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                      <Check size={14} className="text-black" strokeWidth={3} />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="px-4">
          <p className="text-xs text-zinc-600 text-center leading-relaxed">
            This theme will apply to your chat bubbles and accents across the application.
          </p>
        </div>
      </div>
    </div>
  );
}
