'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { UserCircle, Edit2, Check, X, Camera, Palette, ChevronRight, Info } from 'lucide-react';
import { useUser } from '@/context/user-context';
import { clsx } from 'clsx';

export default function ProfilePage() {
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for the form
  const [formData, setFormData] = useState(user);

  // Update formData when user changes (e.g. initial load)
  if (user && !formData) {
    setFormData(user);
  }

  if (!user || !formData) return null;

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 pb-24 max-w-md mx-auto w-full">
      <div className="w-full flex justify-end mb-4 h-10">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div 
              key="actions"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex gap-2"
            >
              <button 
                onClick={handleCancel}
                className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <button 
                onClick={handleSave}
                className="p-2 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors"
              >
                <Check size={20} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="edit"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
            >
              <Edit2 size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        layout
        className="flex flex-col items-center gap-6 w-full"
      >
        {/* Avatar Section */}
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-zinc-900 border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
            {formData.avatarUrl ? (
              <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="w-20 h-20 text-zinc-700" strokeWidth={1} />
            )}
          </div>
          
          {isEditing && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-0 right-0 p-2.5 bg-white text-black rounded-full shadow-lg hover:bg-zinc-200 transition-colors"
              onClick={() => {
                // Simulating avatar upload/change
                const randomId = Math.floor(Math.random() * 1000);
                setFormData({ ...formData, avatarUrl: `https://picsum.photos/seed/${randomId}/200/200` });
              }}
            >
              <Camera size={16} />
            </motion.button>
          )}
        </div>

        {/* Form Fields */}
        <div className="w-full space-y-6 mt-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider ml-1">Display Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
              />
            ) : (
              <h2 className="text-2xl font-bold text-white text-center">{user.name}</h2>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider ml-1">Username</label>
            {isEditing ? (
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-zinc-500">@</span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
            ) : (
              <p className="text-zinc-500 text-center">@{user.username}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider ml-1">Bio</label>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors resize-none"
              />
            ) : (
              <p className="text-zinc-400 text-center text-sm leading-relaxed max-w-xs mx-auto">
                {user.bio || "No bio yet."}
              </p>
            )}
          </div>

          {/* Settings Links */}
          {!isEditing && (
            <div className="w-full pt-6 border-t border-white/5 space-y-2">
              <Link href="/profile/appearance" className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-zinc-800 text-white group-hover:bg-white group-hover:text-black transition-colors">
                    <Palette size={18} />
                  </div>
                  <span className="text-sm font-medium text-white">Appearance</span>
                </div>
                <ChevronRight size={16} className="text-zinc-500" />
              </Link>

              <Link href="/profile/about" className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-zinc-800 text-white group-hover:bg-white group-hover:text-black transition-colors">
                    <Info size={18} />
                  </div>
                  <span className="text-sm font-medium text-white">About App</span>
                </div>
                <ChevronRight size={16} className="text-zinc-500" />
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
