"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockUser, MockUser } from './firebase';

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
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
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Check if it's a demo user
        if (parsedUser.provider === 'demo' || parsedUser.uid === 'demo-user-123') {
          setIsDemo(true);
        }
      } catch (e) {
        console.error('Failed to parse saved user');
      }
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { auth, googleProvider } = await import('./firebase');
      if (auth && googleProvider) {
        const { signInWithPopup } = await import('firebase/auth');
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        const userData: MockUser = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'User',
          photoURL: user.photoURL || '',
          provider: 'google'
        };
        
        setUser(userData);
        setIsDemo(false);
        localStorage.setItem('dashboard_user', JSON.stringify(userData));
      }
    } catch (error: any) {
      console.log('Firebase auth not configured, using demo mode', error.message);
      setUser(mockUser);
      setIsDemo(true);
      localStorage.setItem('dashboard_user', JSON.stringify(mockUser));
    } finally {
      setLoading(false);
    }
  };

  const signInWithTwitter = async () => {
    setLoading(true);
    try {
      const { auth, twitterProvider } = await import('./firebase');
      if (auth && twitterProvider) {
        const { signInWithPopup } = await import('firebase/auth');
        const result = await signInWithPopup(auth, twitterProvider);
        const user = result.user;
        
        const userData: MockUser = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Twitter User',
          photoURL: user.photoURL || '',
          provider: 'twitter'
        };
        
        setUser(userData);
        setIsDemo(false);
        localStorage.setItem('dashboard_user', JSON.stringify(userData));
      }
    } catch (error: any) {
      console.log('Twitter auth not configured, using demo mode', error.message);
      setUser(mockUser);
      setIsDemo(true);
      localStorage.setItem('dashboard_user', JSON.stringify(mockUser));
    } finally {
      setLoading(false);
    }
  };

  const signInWithGitHub = async () => {
    setLoading(true);
    try {
      const { auth, githubProvider } = await import('./firebase');
      if (auth && githubProvider) {
        const { signInWithPopup } = await import('firebase/auth');
        const result = await signInWithPopup(auth, githubProvider);
        const user = result.user;
        
        const userData: MockUser = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'GitHub User',
          photoURL: user.photoURL || '',
          provider: 'github'
        };
        
        setUser(userData);
        setIsDemo(false);
        localStorage.setItem('dashboard_user', JSON.stringify(userData));
      }
    } catch (error: any) {
      console.log('GitHub auth not configured, using demo mode', error.message);
      setUser(mockUser);
      setIsDemo(true);
      localStorage.setItem('dashboard_user', JSON.stringify(mockUser));
    } finally {
      setLoading(false);
    }
  };

  const signInWithLinkedIn = async () => {
    setLoading(true);
    try {
      const { auth, linkedInProvider } = await import('./firebase');
      if (auth && linkedInProvider) {
        const { signInWithPopup } = await import('firebase/auth');
        const result = await signInWithPopup(auth, linkedInProvider);
        const user = result.user;
        
        const userData: MockUser = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'LinkedIn User',
          photoURL: user.photoURL || '',
          provider: 'linkedin'
        };
        
        setUser(userData);
        setIsDemo(false);
        localStorage.setItem('dashboard_user', JSON.stringify(userData));
      }
    } catch (error: any) {
      console.log('LinkedIn auth not configured, using demo mode', error.message);
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
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithGoogle, 
      signInWithTwitter,
      signInWithGitHub,
      signInWithLinkedIn,
      signInWithProvider, 
      signOut, 
      isDemo 
    }}>
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
