'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, User } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

export function BottomNav() {
  const pathname = usePathname();

  // Hide bottom nav in specific chat rooms (e.g. /chats/1)
  // But show it on the main /chats list
  const isChatRoom = pathname.startsWith('/chats/') && pathname.split('/').length > 2;

  if (isChatRoom) return null;

  const tabs = [
    {
      name: 'Chats',
      href: '/chats',
      icon: MessageSquare,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
      <nav className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className="relative flex flex-col items-center justify-center w-full h-full"
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-white/5 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className={clsx(
                "relative z-10 flex flex-col items-center gap-1 transition-colors duration-200",
                isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              )}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium tracking-wide uppercase">{tab.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
