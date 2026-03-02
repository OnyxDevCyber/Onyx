'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, MoreVertical, Phone, Video, Bot, UserCircle2, Check, CheckCheck } from 'lucide-react';
import { useUser } from '@/context/user-context';
import { CallOverlay } from '@/components/call-overlay';
import { clsx } from 'clsx';
import { db, User } from '@/lib/db';
import { soundManager } from '@/lib/sounds';

const THEME_STYLES = {
  onyx: 'bg-zinc-900 text-white',
  midnight: 'bg-blue-600 text-white',
  forest: 'bg-emerald-600 text-white',
  crimson: 'bg-red-600 text-white',
  royal: 'bg-purple-600 text-white',
};

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useUser();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ id: number; text: string; isMe: boolean; time: string; status: 'sent' | 'read' }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  // Initialize chatUser directly from DB to avoid useEffect state update warning
  const [chatUser, setChatUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null; // Safety for SSR
    const users = db.getUsers();
    return users.find(u => u.id === (params.id as string)) || null;
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const userId = params.id as string;

  // We can keep this useEffect to update if userId changes, but it won't trigger on initial render now
  useEffect(() => {
    const users = db.getUsers();
    const found = users.find(u => u.id === userId);
    if (found) {
      // Wrap in setTimeout to avoid synchronous state update warning during render
      setTimeout(() => {
        setChatUser(found);
      }, 0);
    }
  }, [userId]);

  useEffect(() => {
    // Scroll to bottom on new message
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleEndCall = () => {
    setCallType(null);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = () => {
    if (!message.trim()) return;
    
    const newMsg = { 
      id: Date.now(), 
      text: message, 
      isMe: true, 
      time: getCurrentTime(),
      status: 'sent' as const
    };
    
    setMessages(prev => [...prev, newMsg]);
    setMessage('');

    // Simulate bot response
    if (chatUser?.isBot) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          text: `I am Onyx Bot. I received: "${newMsg.text}"`, 
          isMe: false,
          time: getCurrentTime(),
          status: 'read'
        }]);
        // Play incoming sound for message (optional, but requested "pleasant sound")
        // soundManager.playIncoming(); // Maybe too annoying for every message
      }, 2000);
    }
  };

  if (!currentUser || !chatUser) return <div className="bg-black h-screen" />;

  const themeBubbleClass = THEME_STYLES[currentUser.chatTheme] || THEME_STYLES.onyx;

  return (
    <div className="flex flex-col h-screen bg-black">
      <CallOverlay 
        isOpen={!!callType} 
        type={callType || 'audio'} 
        user={chatUser} 
        onEnd={handleEndCall} 
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                 {chatUser.avatarUrl ? (
                    <img src={chatUser.avatarUrl} alt={chatUser.name} className="w-full h-full object-cover" />
                 ) : chatUser.isBot ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <UserCircle2 className="w-5 h-5 text-zinc-400" />
                  )}
              </div>
              {chatUser.isOnline && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full" />
              )}
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-none">{chatUser.name}</h1>
              <p className="text-[10px] text-zinc-400 mt-1 font-medium">
                {isTyping ? (
                  <span className="text-green-500 animate-pulse">typing...</span>
                ) : chatUser.isOnline ? (
                  <span className="text-green-500">Online</span>
                ) : (
                  <span>Last seen {chatUser.lastSeen || 'recently'}</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setCallType('audio')}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <Phone size={18} />
          </button>
          <button 
            onClick={() => setCallType('video')}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <Video size={18} />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain"
      >
        <div className="flex flex-col items-center justify-center py-8 opacity-50">
          <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-3">
             {chatUser.avatarUrl ? (
                <img src={chatUser.avatarUrl} alt={chatUser.name} className="w-full h-full object-cover rounded-full" />
             ) : chatUser.isBot ? (
                <Bot className="w-8 h-8 text-zinc-600" />
              ) : (
                <UserCircle2 className="w-8 h-8 text-zinc-600" />
              )}
          </div>
          <p className="text-xs text-zinc-500">This is the beginning of your history with {chatUser.name}</p>
        </div>

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
              "flex w-full",
              msg.isMe ? "justify-end" : "justify-start"
            )}
          >
            <div className={clsx(
              "max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed break-words relative group",
              msg.isMe 
                ? `${themeBubbleClass} rounded-br-sm` 
                : "bg-zinc-900 text-white rounded-bl-sm"
            )}>
              <span className="block mb-1">{msg.text}</span>
              <div className={clsx(
                "flex items-center justify-end gap-1 text-[9px] opacity-70",
                msg.isMe ? "text-white/80" : "text-zinc-400"
              )}>
                <span>{msg.time}</span>
                {msg.isMe && (
                  <CheckCheck size={12} className="text-white" />
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-zinc-900 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black border-t border-white/10 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2 bg-zinc-900 rounded-full px-4 py-2 border border-zinc-800 focus-within:border-zinc-700 transition-colors">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message..."
            className="flex-1 bg-transparent text-white text-sm placeholder-zinc-500 focus:outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={!message.trim()}
            className={clsx(
              "p-1.5 rounded-full transition-all",
              message.trim() ? "bg-white text-black scale-100" : "bg-zinc-800 text-zinc-600 scale-90"
            )}
          >
            <Send size={14} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}
