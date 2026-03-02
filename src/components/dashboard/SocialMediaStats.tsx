"use client";

import { useState, useEffect } from "react";

interface GAConfig {
  propertyId: string;
  credentials: string;
}

interface SocialSource {
  source: string;
  sessions: number;
  users: number;
  engagementRate: number;
}

interface TrafficData {
  date: string;
  pageviews: number;
  users: number;
}

interface SocialMediaStatsProps {
  config: GAConfig;
}

function getSocialSourceDisplayName(source: string): string {
  const names: Record<string, string> = {
    google: '🔍 Google Search',
    direct: '🔗 Direct',
    facebook: '📘 Facebook',
    twitter: '🐦 Twitter/X',
    instagram: '📸 Instagram',
    linkedin: '💼 LinkedIn',
    youtube: '▶️ YouTube',
    tiktok: '🎵 TikTok',
    reddit: '🤖 Reddit',
    pinterest: '📌 Pinterest',
  };
  
  return names[source] || source;
}

export function SocialMediaStats({ config }: SocialMediaStatsProps) {
  const [metrics, setMetrics] = useState<{
    activeUsers: number;
    sessions: number;
    pageviews: number;
    bounceRate: number;
    avgSessionDuration: number;
    newUsers: number;
  } | null>(null);
  const [sources, setSources] = useState<SocialSource[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!config.propertyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Build query params
        const params = new URLSearchParams({
          propertyId: config.propertyId,
          credentials: config.credentials,
        });

        // Fetch all data in parallel
        const [metricsRes, sourcesRes, trafficRes] = await Promise.all([
          fetch(`/api/ga?action=metrics&${params}`),
          fetch(`/api/ga?action=sources&${params}`),
          fetch(`/api/ga?action=traffic&${params}&days=7`),
        ]);

        if (!metricsRes.ok || !sourcesRes.ok || !trafficRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const metricsData = await metricsRes.json();
        const sourcesData = await sourcesRes.json();
        const traffic = await trafficRes.json();

        setMetrics(metricsData);
        setSources(sourcesData);
        setTrafficData(traffic);
        setError(null);
      } catch (err) {
        setError("Failed to load Google Analytics data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [config]);

  if (loading) {
    return (
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-neutral-700 rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-neutral-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-800 border border-red-700 rounded-xl p-6">
        <div className="flex items-center gap-3 text-red-400">
          <span className="text-2xl">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const maxSessions = Math.max(...sources.map((s) => s.sessions), 1);

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 hover:border-blue-500 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-neutral-400 text-sm">Active Users</span>
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {metrics?.activeUsers.toLocaleString()}
          </p>
          <p className="text-green-400 text-sm mt-1">↑ 12.5% from last week</p>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 hover:border-green-500 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-neutral-400 text-sm">Total Sessions</span>
            <span className="text-2xl">🖱️</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {metrics?.sessions.toLocaleString()}
          </p>
          <p className="text-green-400 text-sm mt-1">↑ 8.3% from last week</p>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 hover:border-purple-500 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-neutral-400 text-sm">Page Views</span>
            <span className="text-2xl">📄</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {metrics?.pageviews.toLocaleString()}
          </p>
          <p className="text-green-400 text-sm mt-1">↑ 15.2% from last week</p>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-5 hover:border-orange-500 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-neutral-400 text-sm">Bounce Rate</span>
            <span className="text-2xl">↩️</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {metrics?.bounceRate.toFixed(1)}%
          </p>
          <p className="text-green-400 text-sm mt-1">↓ 3.2% from last week</p>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          📊 Traffic Over Time (Last 7 Days)
        </h3>
        <div className="flex items-end justify-between h-48 gap-2">
          {trafficData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:from-blue-500 hover:to-blue-300 transition-colors cursor-pointer relative group"
                style={{
                  height: `${(day.pageviews / 25000) * 100}%`,
                  minHeight: "4px",
                }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {day.pageviews.toLocaleString()} views
                </div>
              </div>
              <span className="text-neutral-500 text-xs">
                {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media Sources */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          🌐 Social Media & Traffic Sources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sessions by source */}
          <div>
            <h4 className="text-neutral-400 text-sm mb-3">Sessions by Source</h4>
            <div className="space-y-3">
              {sources.map((source, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-32 text-neutral-300 text-sm truncate">
                    {getSocialSourceDisplayName(source.source)}
                  </div>
                  <div className="flex-1 h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${(source.sessions / maxSessions) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right text-white text-sm">
                    {source.sessions.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement by source */}
          <div>
            <h4 className="text-neutral-400 text-sm mb-3">Engagement Rate by Source</h4>
            <div className="space-y-3">
              {sources
                .sort((a, b) => b.engagementRate - a.engagementRate)
                .map((source, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-32 text-neutral-300 text-sm truncate">
                      {getSocialSourceDisplayName(source.source)}
                    </div>
                    <div className="flex-1 h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          source.engagementRate >= 65
                            ? "bg-green-500"
                            : source.engagementRate >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${source.engagementRate}%` }}
                      ></div>
                    </div>
                    <div className="w-16 text-right text-white text-sm">
                      {source.engagementRate.toFixed(1)}%
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
