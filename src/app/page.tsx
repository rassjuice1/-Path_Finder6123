"use client";

import { useState } from "react";
import { RevenueAnalytics } from "@/components/dashboard/RevenueAnalytics";
import { EmbeddedSite } from "@/components/dashboard/EmbeddedSite";

// Simple navigation tabs
const tabs = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "revenue", label: "Path Coin Revenue", icon: "💰" },
  { id: "analytics", label: "Analytics", icon: "📈" },
  { id: "site", label: "My Site", icon: "🌐" },
];

// Mock stats for the dashboard
const mockStats = [
  { id: "total-revenue", label: "Total Revenue", value: "$12,450", change: 8.5, icon: "💵", color: "bg-green-900/50" },
  { id: "path-coins", label: "Path Coins", value: "24,890", change: 12.3, icon: "🪙", color: "bg-yellow-900/50" },
  { id: "transactions", label: "Transactions", value: "1,234", change: 5.2, icon: "🔄", color: "bg-blue-900/50" },
  { id: "users", label: "Active Users", value: "856", change: 3.1, icon: "👥", color: "bg-purple-900/50" },
];

// Mock transaction data
const mockTransactions = [
  { id: 1, type: "purchase", amount: 500, coins: 5000, date: "2 min ago", status: "completed" },
  { id: 2, type: "subscription", amount: 49.99, coins: 500, date: "15 min ago", status: "completed" },
  { id: 3, type: "purchase", amount: 100, coins: 1000, date: "1 hour ago", status: "completed" },
  { id: 4, type: "referral", amount: 25, coins: 250, date: "2 hours ago", status: "completed" },
  { id: 5, type: "purchase", amount: 250, coins: 2500, date: "3 hours ago", status: "pending" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Header */}
      <header className="bg-neutral-800 border-b border-neutral-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center text-xl">
              🪙
            </div>
            <div>
              <h1 className="text-xl font-bold">Path Coin Dashboard</h1>
              <p className="text-xs text-neutral-400">Revenue Tracker for Creators</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-yellow-600/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium">
              🪙 24,890 Path Coins
            </div>
            <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
              👤
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-neutral-800 border-b border-neutral-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-yellow-400 border-b-2 border-yellow-400 bg-neutral-700/50"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-700/30"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockStats.map((stat) => (
                <div
                  key={stat.id}
                  className={`${stat.color} rounded-xl p-6 border border-neutral-700`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{stat.icon}</span>
                    <span className={`text-sm font-medium ${stat.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {stat.change >= 0 ? "↑" : "↓"} {Math.abs(stat.change)}%
                    </span>
                  </div>
                  <p className="text-neutral-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Transactions */}
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
              <div className="space-y-3">
                {mockTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 bg-neutral-700/30 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === "purchase" ? "bg-green-600/20 text-green-400" :
                        tx.type === "subscription" ? "bg-blue-600/20 text-blue-400" :
                        tx.type === "referral" ? "bg-purple-600/20 text-purple-400" :
                        "bg-yellow-600/20 text-yellow-400"
                      }`}>
                        {tx.type === "purchase" ? "💰" : tx.type === "subscription" ? "📦" : tx.type === "referral" ? "👥" : "🪙"}
                      </div>
                      <div>
                        <p className="font-medium capitalize">{tx.type}</p>
                        <p className="text-sm text-neutral-400">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-400">+{tx.coins} 🪙</p>
                      <p className="text-sm text-neutral-400">${tx.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "revenue" && (
          <RevenueAnalytics />
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Revenue Chart Placeholder */}
              <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
                <h2 className="text-lg font-semibold mb-4">Revenue Over Time</h2>
                <div className="h-64 flex items-center justify-center bg-neutral-700/30 rounded-lg">
                  <div className="text-center text-neutral-400">
                    <div className="text-4xl mb-2">📈</div>
                    <p>Revenue Chart</p>
                    <p className="text-sm">Last 30 days</p>
                  </div>
                </div>
              </div>

              {/* Coin Distribution */}
              <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
                <h2 className="text-lg font-semibold mb-4">Coin Distribution</h2>
                <div className="space-y-4">
                  {[
                    { label: "Purchases", value: 65, color: "bg-green-500" },
                    { label: "Subscriptions", value: 20, color: "bg-blue-500" },
                    { label: "Referrals", value: 10, color: "bg-purple-500" },
                    { label: "Rewards", value: 5, color: "bg-yellow-500" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                        <div
                          className={`${item.color} h-full rounded-full`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "site" && (
          <div className="h-[calc(100vh-200px)] min-h-[500px]">
            <EmbeddedSite domain="path-finder-ltd.site123.me" />
          </div>
        )}
      </main>
    </div>
  );
}
