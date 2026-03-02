'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useUser } from '@/context/user-context';

export default function LoginPage() {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter">Onyx</h1>
          <p className="text-zinc-400">Welcome back.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-medium rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="text-white hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
