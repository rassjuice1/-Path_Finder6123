"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockUser, MockUser } from './firebase';

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithProvider: (provider: string, email: string, displayName: string) => void;
  signOut: () => Promise<void>;
  isDemo: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('dashboard_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user');
      }
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      // Try to use Firebase Google Sign-In
      const { auth, googleProvider } = await import('./firebase');
      if (auth && googleProvider) {
        const { signInWithPopup } = await import('firebase/auth');
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        const userData: MockUser = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || ''
        };
        
        setUser(userData);
        setIsDemo(false);
        localStorage.setItem('dashboard_user', JSON.stringify(userData));
      }
    } catch (error: any) {
      console.log('Firebase auth not configured, using demo mode', error.message);
      // Fall back to demo mode
      setUser(mockUser);
      setIsDemo(true);
      localStorage.setItem('dashboard_user', JSON.stringify(mockUser));
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = (provider: string, email: string, displayName: string) => {
    const userData: MockUser = {
      uid: `demo_${provider}_user`,
      email,
      displayName,
      photoURL: '',
      provider
    };
    setUser(userData);
    setIsDemo(true);
    localStorage.setItem('dashboard_user', JSON.stringify(userData));
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { auth } = await import('./firebase');
      if (auth) {
        const { signOut: firebaseSignOut } = await import('firebase/auth');
        await firebaseSignOut(auth);
      }
    } catch (error) {
      console.log('Firebase sign out error (expected in demo mode)');
    }
    setUser(null);
    setIsDemo(true);
    localStorage.removeItem('dashboard_user');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithProvider, signOut, isDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
