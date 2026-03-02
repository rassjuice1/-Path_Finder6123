"use client";

import { useState, useEffect } from "react";

export interface ErrorLog {
  id: string;
  timestamp: Date;
  type: "error" | "warning" | "info";
  message: string;
  source: string;
  stack?: string;
  resolved: boolean;
}

interface ErrorTrackerProps {
  onErrorCountChange?: (count: number) => void;
}

// Sample error data for demonstration - using static dates to avoid hydration mismatch
const mockErrors: ErrorLog[] = [
  {
    id: "1",
    timestamp: new Date("2026-03-02T12:00:00Z"),
    type: "error",
    message: "Failed to fetch user data from API endpoint",
    source: "UserService.getUser()",
    stack: "TypeError: Cannot read property 'data' of undefined\n    at UserService.getUser (user.service.ts:45)\n    at UserController.get (user.controller.ts:23)",
    resolved: false,
  },
  {
    id: "2",
    timestamp: new Date("2026-03-02T11:45:00Z"),
    type: "warning",
    message: "API response time exceeded 5 seconds",
    source: "APIMiddleware.timeout",
    resolved: false,
  },
  {
    id: "3",
    timestamp: new Date("2026-03-02T11:30:00Z"),
    type: "error",
    message: "Database connection pool exhausted",
    source: "DatabaseService.pool",
    stack: "Error: Pool connection limit reached\n    at DatabaseService.query (db.service.ts:78)",
    resolved: true,
  },
  {
    id: "4",
    timestamp: new Date("2026-03-02T11:15:00Z"),
    type: "warning",
    message: "Rate limit threshold approaching for IP 192.168.1.1",
    source: "RateLimiter.check",
    resolved: false,
  },
  {
    id: "5",
    timestamp: new Date("2026-03-02T11:00:00Z"),
    type: "info",
    message: "Scheduled maintenance window starting",
    source: "SystemScheduler",
    resolved: true,
  },
];

export function ErrorTracker({ onErrorCountChange }: ErrorTrackerProps) {
  const [errors, setErrors] = useState<ErrorLog[]>(mockErrors);
  const [filter, setFilter] = useState<"all" | "error" | "warning" | "info">("all");
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);

  const filteredErrors = errors.filter((err) =>
    filter === "all" ? true : err.type === filter
  );

  const unresolvedCount = errors.filter((e) => !e.resolved).length;

  useEffect(() => {
    onErrorCountChange?.(unresolvedCount);
  }, [unresolvedCount, onErrorCountChange]);

  const resolveError = (id: string) => {
    setErrors((prev) =>
      prev.map((err) => (err.id === id ? { ...err, resolved: true } : err))
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-900/50 text-red-400 border-red-700";
      case "warning":
        return "bg-yellow-900/50 text-yellow-400 border-yellow-700";
      case "info":
        return "bg-blue-900/50 text-blue-400 border-blue-700";
      default:
        return "bg-neutral-700 text-neutral-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "📌";
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Error Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-neutral-800 border border-red-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400 text-sm">Critical Errors</span>
            <span className="text-2xl">❌</span>
          </div>
          <p className="text-2xl font-bold text-red-400">
            {errors.filter((e) => e.type === "error" && !e.resolved).length}
          </p>
        </div>
        <div className="bg-neutral-800 border border-yellow-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400 text-sm">Warnings</span>
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400">
            {errors.filter((e) => e.type === "warning" && !e.resolved).length}
          </p>
        </div>
        <div className="bg-neutral-800 border border-blue-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400 text-sm">Info</span>
            <span className="text-2xl">ℹ️</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">
            {errors.filter((e) => e.type === "info" && !e.resolved).length}
          </p>
        </div>
        <div className="bg-neutral-800 border border-green-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-400 text-sm">Resolved</span>
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-2xl font-bold text-green-400">
            {errors.filter((e) => e.resolved).length}
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "error", "warning", "info"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {filter === "all" ? "" : ` (${errors.filter((e) => e.type === f).length})`}
          </button>
        ))}
      </div>

      {/* Error List */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-700">
          <h3 className="text-lg font-semibold text-white">Error Logs</h3>
        </div>
        <div className="divide-y divide-neutral-700 max-h-96 overflow-y-auto">
          {filteredErrors.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">
              No {filter === "all" ? "" : filter} errors found
            </div>
          ) : (
            filteredErrors.map((error) => (
              <div
                key={error.id}
                onClick={() => setSelectedError(error)}
                className={`p-4 cursor-pointer hover:bg-neutral-750 transition-colors ${
                  error.resolved ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{getTypeIcon(error.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${getTypeColor(
                          error.type
                        )}`}
                      >
                        {error.type.toUpperCase()}
                      </span>
                      <span className="text-neutral-500 text-xs">
                        {formatTimestamp(error.timestamp)}
                      </span>
                      {error.resolved && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-400 border border-green-700">
                          RESOLVED
                        </span>
                      )}
                    </div>
                    <p className="text-white font-medium truncate">{error.message}</p>
                    <p className="text-neutral-500 text-sm">{error.source}</p>
                  </div>
                  {!error.resolved && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resolveError(error.id);
                      }}
                      className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Error Detail Modal */}
      {selectedError && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedError(null)}
        >
          <div
            className="bg-neutral-800 border border-neutral-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTypeIcon(selectedError.type)}</span>
                  <h3 className="text-xl font-semibold text-white">Error Details</h3>
                </div>
                <button
                  onClick={() => setSelectedError(null)}
                  className="text-neutral-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              <div>
                <label className="text-neutral-500 text-sm">Type</label>
                <p
                  className={`text-sm px-2 py-1 rounded-full border w-fit ${getTypeColor(
                    selectedError.type
                  )}`}
                >
                  {selectedError.type.toUpperCase()}
                </p>
              </div>
              <div>
                <label className="text-neutral-500 text-sm">Timestamp</label>
                <p className="text-white">
                  {selectedError.timestamp.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-neutral-500 text-sm">Source</label>
                <p className="text-white">{selectedError.source}</p>
              </div>
              <div>
                <label className="text-neutral-500 text-sm">Message</label>
                <p className="text-white">{selectedError.message}</p>
              </div>
              {selectedError.stack && (
                <div>
                  <label className="text-neutral-500 text-sm">Stack Trace</label>
                  <pre className="bg-neutral-900 p-4 rounded-lg text-red-400 text-sm overflow-x-auto">
                    {selectedError.stack}
                  </pre>
                </div>
              )}
              <div>
                <label className="text-neutral-500 text-sm">Status</label>
                <p className="text-white">
                  {selectedError.resolved ? "✅ Resolved" : "❌ Unresolved"}
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-neutral-700 flex justify-end gap-2">
              <button
                onClick={() => setSelectedError(null)}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
              {!selectedError.resolved && (
                <button
                  onClick={() => {
                    resolveError(selectedError.id);
                    setSelectedError(null);
                  }}
                  className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
