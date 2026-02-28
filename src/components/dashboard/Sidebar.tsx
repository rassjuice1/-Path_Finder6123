"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCredits } from "@/lib/CreditContext";

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
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <p className="text-white font-medium text-sm">Admin User</p>
            <p className="text-neutral-500 text-xs">admin@api.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
