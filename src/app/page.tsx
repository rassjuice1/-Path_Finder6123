"use client";

import { useState } from "react";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";

// Company branding
const COMPANY_NAME = "Content Distribution @Path_Finder#.Ltd";
const ADMIN_NAME = "Adolo Erysthee";

// Navigation tabs
const tabs = [
  { id: "overview", label: "Dashboard", icon: "📊" },
  { id: "revenue", label: "Revenue", icon: "💰" },
  { id: "transactions", label: "Transactions", icon: "🔄" },
  { id: "analytics", label: "Analytics", icon: "📈" },
];

// Mock revenue stats
const revenueStats = [
  { id: "total-revenue", label: "Total Revenue", value: "$24,850", change: 12.5, icon: "💵", color: "bg-green-900/50" },
  { id: "monthly-revenue", label: "Monthly Revenue", value: "$8,450", change: 8.2, icon: "📅", color: "bg-blue-900/50" },
  { id: "transactions", label: "Total Transactions", value: "2,456", change: 15.3, icon: "🔄", color: "bg-purple-900/50" },
  { id: "customers", label: "Active Customers", value: "1,234", change: 5.7, icon: "👥", color: "bg-orange-900/50" },
];

// Mock recent transactions
const transactions = [
  { id: 1, customer: "John Smith", amount: 299.99, coins: 2999, date: "2 min ago", status: "completed", type: "purchase" },
  { id: 2, customer: "Sarah Johnson", amount: 49.99, coins: 500, date: "15 min ago", status: "completed", type: "subscription" },
  { id: 3, customer: "Mike Wilson", amount: 150.00, coins: 1500, date: "1 hour ago", status: "completed", type: "purchase" },
  { id: 4, customer: "Emma Davis", amount: 75.00, coins: 750, date: "2 hours ago", status: "pending", type: "purchase" },
  { id: 5, customer: "James Brown", amount: 199.99, coins: 2000, date: "3 hours ago", status: "completed", type: "purchase" },
  { id: 6, customer: "Lisa Anderson", amount: 39.99, coins: 400, date: "4 hours ago", status: "completed", type: "subscription" },
  { id: 7, customer: "David Lee", amount: 500.00, coins: 5000, date: "5 hours ago", status: "completed", type: "purchase" },
];

// Revenue by category
const revenueByCategory = [
  { label: "Path Coin Sales", value: 65, color: "bg-yellow-500", amount: "$16,152" },
  { label: "Subscriptions", value: 25, color: "bg-blue-500", amount: "$6,212" },
  { label: "Premium Features", value: 10, color: "bg-purple-500", amount: "$2,485" },
];

// Monthly revenue data
const monthlyRevenue = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5800 },
  { month: "Mar", revenue: 4900 },
  { month: "Apr", revenue: 6200 },
  { month: "May", revenue: 7100 },
  { month: "Jun", revenue: 8450 },
];

const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <ProtectedDashboard>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              📀
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">{COMPANY_NAME}</h1>
              <p className="text-xs text-yellow-400/80">Revenue Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <span>👤</span>
              <span>{ADMIN_NAME}</span>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-full text-sm">
              <span className="text-green-400">●</span> Online
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium transition-all duration-200 rounded-t-lg ${
                  activeTab === tab.id
                    ? "text-yellow-400 border-b-2 border-yellow-400 bg-white/5"
                    : "text-white/60 hover:text-white hover:bg-white/5"
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
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {revenueStats.map((stat) => (
                <div
                  key={stat.id}
                  className={`${stat.color} rounded-2xl p-6 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{stat.icon}</span>
                    <span className={`text-sm font-medium ${stat.change >= 0 ? "text-green-400" : "text-red-400"} flex items-center gap-1`}>
                      {stat.change >= 0 ? "↑" : "↓"} {Math.abs(stat.change)}%
                    </span>
                  </div>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-black/30 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold mb-6">Revenue Trend</h2>
                <div className="h-64 flex items-end justify-between gap-2">
                  {monthlyRevenue.map((month) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-gradient-to-t from-yellow-500 to-orange-500 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                        style={{ height: `${(month.revenue / maxRevenue) * 100}%`, minHeight: "20px" }}
                        title={`$${month.revenue.toLocaleString()}`}
                      />
                      <span className="text-xs text-white/60">{month.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue by Category */}
              <div className="bg-black/30 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold mb-6">Revenue Sources</h2>
                <div className="space-y-4">
                  {revenueByCategory.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{item.label}</span>
                        <span className="text-white/80">{item.amount}</span>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`${item.color} h-full rounded-full transition-all`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/60">Total</span>
                    <span className="text-xl font-bold text-green-400">$24,850</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-black/30 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Transactions</h2>
                <button 
                  onClick={() => setActiveTab("transactions")}
                  className="text-sm text-yellow-400 hover:text-yellow-300"
                >
                  View All →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-white/60 text-sm border-b border-white/10">
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Coins</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 5).map((tx) => (
                      <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-sm font-bold">
                              {tx.customer.charAt(0)}
                            </div>
                            <span>{tx.customer}</span>
                          </div>
                        </td>
                        <td className="py-4 capitalize">{tx.type}</td>
                        <td className="py-4 text-green-400 font-medium">${tx.amount.toFixed(2)}</td>
                        <td className="py-4 text-yellow-400">{tx.coins.toLocaleString()} 🪙</td>
                        <td className="py-4 text-white/60">{tx.date}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tx.status === "completed" 
                              ? "bg-green-500/20 text-green-400" 
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === "revenue" && (
          <div className="space-y-6">
            <div className="bg-black/30 rounded-2xl border border-white/10 p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-2">Revenue Overview</h2>
              <p className="text-white/60 mb-8">Track your earnings from all sources</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-xl p-6 border border-green-500/30">
                  <p className="text-green-400 text-sm mb-2">Total Earnings</p>
                  <p className="text-4xl font-bold">$24,850</p>
                  <p className="text-green-400/60 text-sm mt-2">↑ 12.5% from last month</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 rounded-xl p-6 border border-yellow-500/30">
                  <p className="text-yellow-400 text-sm mb-2">Path Coins Sold</p>
                  <p className="text-4xl font-bold">248,500</p>
                  <p className="text-yellow-400/60 text-sm mt-2">↑ 8.3% from last month</p>
                </div>
                <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-6 border border-blue-500/30">
                  <p className="text-blue-400 text-sm mb-2">Avg. Transaction</p>
                  <p className="text-4xl font-bold">$72.50</p>
                  <p className="text-blue-400/60 text-sm mt-2">↑ 3.2% from last month</p>
                </div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-black/30 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold mb-6">Revenue Breakdown</h2>
              <div className="space-y-4">
                {revenueByCategory.map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span>{item.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold">{item.amount}</span>
                      <span className="text-white/60 ml-2">({item.value}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="bg-black/30 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">All Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-white/60 text-sm border-b border-white/10">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Coins</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 text-white/60">#{tx.id.toString().padStart(4, '0')}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-sm font-bold">
                            {tx.customer.charAt(0)}
                          </div>
                          <span>{tx.customer}</span>
                        </div>
                      </td>
                      <td className="py-4 capitalize">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tx.type === "purchase" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-4 text-green-400 font-medium">${tx.amount.toFixed(2)}</td>
                      <td className="py-4 text-yellow-400">{tx.coins.toLocaleString()} 🪙</td>
                      <td className="py-4 text-white/60">{tx.date}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tx.status === "completed" 
                            ? "bg-green-500/20 text-green-400" 
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Growth Chart */}
              <div className="bg-black/30 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold mb-6">Monthly Growth</h2>
                <div className="h-64 flex items-end justify-between gap-3">
                  {monthlyRevenue.map((month) => (
                    <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-yellow-600 to-orange-500 rounded-t-lg shadow-lg shadow-orange-500/20"
                          style={{ height: `${(month.revenue / maxRevenue) * 180}px` }}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold">${month.revenue.toLocaleString()}</p>
                        <p className="text-xs text-white/60">{month.month}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Summary */}
              <div className="bg-black/30 rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold mb-6">Key Metrics</h2>
                <div className="space-y-6">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/60">Conversion Rate</span>
                      <span className="text-green-400">24.5%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "24.5%" }} />
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/60">Customer Retention</span>
                      <span className="text-blue-400">78.2%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "78.2%" }} />
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/60">Avg. Revenue Per User</span>
                      <span className="text-yellow-400">$20.14</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/60">Monthly Active Users</span>
                      <span className="text-purple-400">1,234</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: "82%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
    </ProtectedDashboard>
  );
}
