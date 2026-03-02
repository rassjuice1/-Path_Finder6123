"use client";

import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, CreditCard, FileText, Download, BarChart3, PieChart } from "lucide-react";

interface RevenueMetric {
  id: string;
  label: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

interface Transaction {
  id: string;
  date: string;
  customer: string;
  plan: string;
  amount: number;
  status: "completed" | "pending" | "failed";
}

interface DataPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  downloads: number;
  revenue: number;
}

const mockRevenueMetrics: RevenueMetric[] = [
  {
    id: "total-revenue",
    label: "Total Revenue",
    value: "$12,450",
    change: 18.5,
    icon: "💰",
    color: "bg-green-900/50",
  },
  {
    id: "monthly-recurring",
    label: "Monthly Recurring",
    value: "$3,200",
    change: 12.3,
    icon: "🔄",
    color: "bg-blue-900/50",
  },
  {
    id: "data-packages",
    label: "Data Package Sales",
    value: "$2,850",
    change: 8.7,
    icon: "📦",
    color: "bg-purple-900/50",
  },
  {
    id: "api-usage",
    label: "API Usage Fees",
    value: "$6,400",
    change: 25.2,
    icon: "📡",
    color: "bg-orange-900/50",
  },
];

const mockTransactions: Transaction[] = [
  { id: "1", date: "2026-02-26", customer: "Acme Corp", plan: "Enterprise", amount: 499, status: "completed" },
  { id: "2", date: "2026-02-25", customer: "TechStart Inc", plan: "Pro", amount: 99, status: "completed" },
  { id: "3", date: "2026-02-25", customer: "DataFlow LLC", plan: "Data Pack Basic", amount: 49, status: "completed" },
  { id: "4", date: "2026-02-24", customer: "Analytics Pro", plan: "Enterprise", amount: 499, status: "pending" },
  { id: "5", date: "2026-02-24", customer: "SmallBiz Co", plan: "Basic", amount: 29, status: "completed" },
  { id: "6", date: "2026-02-23", customer: "DataMine Corp", plan: "Data Pack Pro", amount: 149, status: "completed" },
];

const mockDataPackages: DataPackage[] = [
  { id: "1", name: "Industry Trends Report", description: "Quarterly analysis of industry trends", price: 299, downloads: 45, revenue: 13455 },
  { id: "2", name: "Market Size Dataset", description: "Global market size projections 2024-2028", price: 199, downloads: 62, revenue: 12338 },
  { id: "3", name: "Competitor Analysis", description: "Top 50 competitors detailed breakdown", price: 149, downloads: 38, revenue: 5662 },
  { id: "4", name: "Consumer Behavior Data", description: "Consumer spending patterns by region", price: 249, downloads: 28, revenue: 6972 },
];

export function RevenueAnalytics() {
  const [revenueData, setRevenueData] = useState<RevenueMetric[]>(mockRevenueMetrics);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [dataPackages, setDataPackages] = useState<DataPackage[]>(mockDataPackages);

  const totalRevenue = revenueData.reduce((acc, metric) => {
    const numValue = parseFloat(metric.value.replace(/[^0-9.-]/g, ""));
    return acc + numValue;
  }, 0);

  const completedTransactions = transactions.filter(t => t.status === "completed");
  const totalSales = completedTransactions.length;
  const averageOrderValue = completedTransactions.reduce((acc, t) => acc + t.amount, 0) / completedTransactions.length;

  return (
    <div className="space-y-8">
      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockRevenueMetrics.map((metric) => (
          <div
            key={metric.id}
            className={`p-6 rounded-xl ${metric.color} border border-white/10`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{metric.icon}</span>
              <span className={`text-sm font-medium ${metric.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                {metric.change >= 0 ? "+" : ""}{metric.change}%
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
            <div className="text-sm text-gray-400">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue Breakdown Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-800/50 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Revenue by Source
            </h3>
          </div>
          <div className="space-y-4">
            {[
              { label: "Subscription Plans", value: 3200, percentage: 26, color: "bg-blue-500" },
              { label: "Data Packages", value: 2850, percentage: 23, color: "bg-purple-500" },
              { label: "API Usage", value: 6400, percentage: 51, color: "bg-green-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">{item.label}</span>
                  <span className="text-white font-medium">${item.value.toLocaleString()} ({item.percentage}%)</span>
                </div>
                <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-800/50 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Monthly Revenue Trend
            </h3>
          </div>
          <div className="h-40 flex items-end justify-between gap-2">
            {[65, 78, 82, 71, 89, 95, 88, 92, 100, 85, 91, 98].map((height, i) => (
              <div key={i} className="flex-1 bg-blue-600/50 rounded-t hover:bg-blue-500/50 transition-colors" style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>Jan</span>
            <span>Dec</span>
          </div>
        </div>
      </div>

      {/* Transactions & Data Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-neutral-800/50 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Recent Transactions
            </h3>
            <button className="text-sm text-blue-400 hover:text-blue-300">View All</button>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
                <div>
                  <div className="text-white font-medium">{transaction.customer}</div>
                  <div className="text-sm text-gray-400">{transaction.plan} • {transaction.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">${transaction.amount}</div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    transaction.status === "completed" ? "bg-green-500/20 text-green-400" :
                    transaction.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Packages */}
        <div className="bg-neutral-800/50 rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Data Package Sales
            </h3>
            <button className="text-sm text-blue-400 hover:text-blue-300">Manage</button>
          </div>
          <div className="space-y-3">
            {dataPackages.map((pkg) => (
              <div key={pkg.id} className="flex items-center justify-between p-3 bg-neutral-700/30 rounded-lg">
                <div>
                  <div className="text-white font-medium">{pkg.name}</div>
                  <div className="text-sm text-gray-400">{pkg.downloads} downloads</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-semibold">${pkg.revenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">${pkg.price}/each</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monetization Tools */}
      <div className="bg-neutral-800/50 rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Monetization Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-600/20 hover:bg-blue-600/30 rounded-xl border border-blue-500/30 transition-colors text-left">
            <Download className="w-8 h-8 text-blue-400 mb-3" />
            <div className="text-white font-semibold mb-1">Export Data Reports</div>
            <div className="text-sm text-gray-400">Generate PDF/CSV reports for clients</div>
          </button>
          <button className="p-4 bg-purple-600/20 hover:bg-purple-600/30 rounded-xl border border-purple-500/30 transition-colors text-left">
            <FileText className="w-8 h-8 text-purple-400 mb-3" />
            <div className="text-white font-semibold mb-1">Create Data Package</div>
            <div className="text-sm text-gray-400">Bundle your analytics into sellable products</div>
          </button>
          <button className="p-4 bg-green-600/20 hover:bg-green-600/30 rounded-xl border border-green-500/30 transition-colors text-left">
            <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
            <div className="text-white font-semibold mb-1">Upgrade Analytics</div>
            <div className="text-sm text-gray-400">Unlock advanced revenue features</div>
          </button>
        </div>
      </div>
    </div>
  );
}

