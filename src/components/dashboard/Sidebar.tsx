"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCredits } from "@/lib/CreditContext";
import { useAuth } from "@/lib/AuthContext";
import Image from "next/image";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
}

const navItems: NavItem[] = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "ai-agent", label: "AI Agent", icon: "🤖" },
  { id: "social", label: "Social Media", icon: "🌐" },
  { id: "revenue", label: "Revenue", icon: "💰" },
  { id: "endpoints", label: "Endpoints", icon: "🔗" },
  { id: "requests", label: "Requests", icon: "📨" },
  { id: "responses", label: "Responses", icon: "📋" },
  { id: "analytics", label: "Analytics", icon: "📈" },
  { id: "errors", label: "Errors", icon: "🚨" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const router = useRouter();
  const { credits, tier } = useCredits();
  const { user, isDemo, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const handleNavigation = (item: NavItem) => {
    if (item.href) {
      router.push(item.href);
    } else {
      onTabChange(item.id);
    }
  };

  return (
    <aside className="w-64 bg-neutral-800 border-r border-neutral-700 min-h-screen flex flex-col">
      <div className="p-6 border-b border-neutral-700">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          API Dashboard
        </h1>
      </div>
      
      {/* Credits Display */}
      <div className="px-4 py-3 mx-4 mb-4 bg-indigo-900/30 rounded-lg border border-indigo-500/30">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-indigo-400 font-medium">Credits</span>
          <span className="text-xs text-gray-500 capitalize">{tier} Plan</span>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-xl font-bold text-white">
            {credits?.remainingCredits ?? 10}
          </span>
          <button 
            onClick={() => router.push('/pricing')}
            className="text-xs text-indigo-400 hover:text-indigo-300"
          >
            + Get More
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white"
                    : "text-neutral-400 hover:bg-neutral-700 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
          
          {/* Pricing Link */}
          <li className="pt-4 mt-4 border-t border-neutral-700">
            <button
              onClick={() => router.push('/pricing')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all duration-200"
            >
              <span className="text-lg">💎</span>
              <span className="font-medium">Pricing</span>
            </button>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-neutral-700">
        <div className="flex items-center gap-3 px-4 py-3">
          <Image 
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=4F46E5&color=fff`}
            alt={user?.displayName || 'User'}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">{user?.displayName || 'User'}</p>
            <p className="text-neutral-500 text-xs truncate">{user?.email || 'No email'}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400 hover:text-white"
            title="Sign out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
        {isDemo && (
          <div className="mx-4 mt-2 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg">
            <p className="text-amber-400 text-xs font-medium">
              ⚠️ Demo Mode - Sign in to save data
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
