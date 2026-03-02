"use client";

import { AvatarFromName } from "@/components/Avatar";

interface HeaderProps {
  title: string;
  subtitle: string;
  userName?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-neutral-800 border-b border-neutral-700 px-8 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-neutral-400 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-neutral-700 rounded-lg transition-colors relative">
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-white font-medium text-sm">Path Coin User</p>
              <p className="text-neutral-400 text-xs">Demo Account</p>
            </div>
            <AvatarFromName name="Path Coin User" size={40} rounded />
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
            <span>🔄</span>
            Refresh Data
          </button>
        </div>
      </div>
    </header>
  );
}
