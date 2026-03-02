'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Smartphone, Shield, Globe } from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();

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
        <h1 className="text-xl font-bold text-white">About App</h1>
      </div>

      <div className="flex flex-col items-center justify-center py-12 space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center shadow-2xl">
           <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
             <div className="w-6 h-6 rounded-full bg-white" />
           </div>
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">Onyx</h2>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/5">
            <span className="text-xs font-medium text-white">Version 1.0 Beta</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-4">
            <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-zinc-800/50 text-zinc-400">
                    <Smartphone size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-white">Onyx Messenger</h3>
                    <p className="text-xs text-zinc-500">Next-gen communication platform</p>
                </div>
            </div>
            
            <div className="h-px bg-white/5" />

            <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-zinc-800/50 text-zinc-400">
                    <Shield size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-white">Privacy First</h3>
                    <p className="text-xs text-zinc-500">Your data stays yours</p>
                </div>
            </div>

             <div className="h-px bg-white/5" />

            <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-zinc-800/50 text-zinc-400">
                    <Globe size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-white">Global Reach</h3>
                    <p className="text-xs text-zinc-500">Connect with anyone, anywhere</p>
                </div>
            </div>
        </div>

        <p className="text-center text-xs text-zinc-600 pt-8">
            © 2026 Onyx Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}
