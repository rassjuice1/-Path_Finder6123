"use client";

import { useState } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "social", label: "Social Media", icon: "🌐" },
  { id: "endpoints", label: "Endpoints", icon: "🔗" },
  { id: "requests", label: "Requests", icon: "📨" },
  { id: "responses", label: "Responses", icon: "📋" },
  { id: "analytics", label: "Analytics", icon: "📈" },
  { id: "errors", label: "Errors", icon: "🚨" },
  { id: "ai-agent", label: "AI Fix Agent", icon: "🤖" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-neutral-800 border-r border-neutral-700 min-h-screen flex flex-col">
      <div className="p-6 border-b border-neutral-700">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          API Dashboard
        </h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
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
