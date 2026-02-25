"use client";

import { useAuth } from '@/lib/AuthContext';
import { ReactNode } from 'react';
import Image from 'next/image';

interface ProtectedDashboardProps {
  children: ReactNode;
}

export function ProtectedDashboard({ children }: ProtectedDashboardProps) {
  const { user, signOut, isDemo } = useAuth();

  return (
    <>
      {/* User Info Bar */}
      <div className="fixed top-0 right-0 z-50 flex items-center gap-4 p-4">
        {user && (
          <div className="flex items-center gap-3 bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700">
            {user.photoURL ? (
              <Image 
                src={user.photoURL} 
                alt={user.displayName} 
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                {user.displayName?.charAt(0) || 'U'}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-white text-sm font-medium">{user.displayName}</span>
              {isDemo && (
                <span className="text-xs text-yellow-400">Demo Mode</span>
              )}
            </div>
            <button
              onClick={() => signOut()}
              className="ml-2 p-2 hover:bg-gray-700 rounded-full transition-colors"
              title="Sign out"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {children}
    </>
  );
}
