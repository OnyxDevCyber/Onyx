'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquareDashed, Search, UserCircle2, Bot } from 'lucide-react';
import { db, User } from '@/lib/db';
import { useUser } from '@/context/user-context';

export default function ChatsPage() {
  const { user: currentUser } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load users from "DB"
    const allUsers = db.getUsers();
    // Filter out self
    setUsers(allUsers.filter(u => u.id !== currentUser?.id));
  }, [currentUser]);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen p-4 pb-24 max-w-md mx-auto w-full">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md py-2 mb-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {searchQuery.length > 0 || users.length > 0 ? (
          <motion.div
            key="search-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 px-1">
              {filteredUsers.length > 0 ? 'Contacts' : 'No users found'}
            </h2>
            
            {filteredUsers.map((user) => (
              <Link
                key={user.id}
                href={`/chats/${user.id}`}
                className="block"
              >
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-white/5 active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : user.isBot ? (
                      <Bot className="w-6 h-6 text-white" />
                    ) : (
                      <UserCircle2 className="w-6 h-6 text-zinc-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">{user.name}</p>
                      {user.isBot && (
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-bold text-white uppercase tracking-wide">
                          BOT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 truncate">@{user.username}</p>
                  </div>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white text-black rounded-full hover:bg-zinc-200 transition-colors pointer-events-none">
                    Chat
                  </button>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center flex-1 mt-20 text-center"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full" />
              <div className="relative bg-zinc-900 p-6 rounded-2xl border border-white/5 shadow-2xl">
                <MessageSquareDashed className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
            </div>
            
            <div className="space-y-2 max-w-[280px]">
              <h1 className="text-2xl font-bold tracking-tight text-white">No Messages</h1>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Your inbox is empty. Search for a username above to start chatting.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
