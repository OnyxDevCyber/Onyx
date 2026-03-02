'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { db, User } from '@/lib/db';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password?: string) => Promise<void>;
  register: (data: Omit<User, 'id' | 'chatTheme'>) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Load session on mount
  useEffect(() => {
    db.init(); // Ensure bot exists
    const savedId = localStorage.getItem('onyx_session_id');
    
    // Wrap in setTimeout to avoid synchronous state update warning
    setTimeout(() => {
      if (savedId) {
        const users = db.getUsers();
        const found = users.find(u => u.id === savedId);
        if (found) {
          setUser(found);
        }
      }
      setIsLoading(false);
    }, 0);
  }, []);

  // Protect routes
  useEffect(() => {
    if (isLoading) return;
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
    if (!user && !isAuthRoute) {
      router.push('/login');
    } else if (user && isAuthRoute) {
      router.push('/chats');
    }
  }, [user, isLoading, pathname, router]);

  const login = async (identifier: string, password?: string) => {
    // In a real app, verify password. Here we just find the user.
    const found = db.findUser(identifier);
    if (!found) throw new Error('User not found');
    
    // Simple password check (demo)
    if (found.password !== password) throw new Error('Invalid credentials');

    setUser(found);
    localStorage.setItem('onyx_session_id', found.id);
    router.push('/chats');
  };

  const register = async (data: Omit<User, 'id' | 'chatTheme'>) => {
    const newUser: User = {
      ...data,
      id: Date.now().toString(),
      chatTheme: 'onyx',
      isOnline: true,
      lastSeen: 'now'
    };
    
    try {
      db.addUser(newUser);
      setUser(newUser);
      localStorage.setItem('onyx_session_id', newUser.id);
      router.push('/chats');
    } catch (e: any) {
      throw new Error(e.message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('onyx_session_id');
    router.push('/login');
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    db.updateUser(updated);
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
