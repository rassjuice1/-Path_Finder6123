"use client";

import { useState } from "react";

interface APISettingsProps {
  baseUrl: string;
  apiKey: string;
  onUpdate: (baseUrl: string, apiKey: string) => void;
}

export function APISettings({ baseUrl, apiKey, onUpdate }: APISettingsProps) {
  const [url, setUrl] = useState(baseUrl);
  const [key, setKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate(url, key);
    setIsEditing(false);
  };

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>⚙️</span> API Configuration
        </h3>
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isEditing
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isEditing ? "Save Changes" : "Edit Configuration"}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-neutral-400 text-sm mb-2">
            Base URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-neutral-400 text-sm mb-2">
            API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 pr-12 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              {showKey ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-700">
          <div>
            <label className="block text-neutral-400 text-sm mb-2">
              Timeout (ms)
            </label>
            <input
              type="number"
              defaultValue={30000}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-neutral-400 text-sm mb-2">
              Retry Attempts
            </label>
            <input
              type="number"
              defaultValue={3}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <span className="text-neutral-400 text-sm">Status:</span>
          <span className="flex items-center gap-2 text-green-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Connected
          </span>
        </div>
      </div>
    </div>
  );
}
