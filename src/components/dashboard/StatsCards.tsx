"use client";

interface StatCard {
  id: string;
  label: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
}

interface StatsCardsProps {
  stats: StatCard[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-neutral-600 transition-colors"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${stat.color}`}
            >
              {stat.icon}
            </div>
            <span
              className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.change >= 0
                  ? "bg-green-900/50 text-green-400"
                  : "bg-red-900/50 text-red-400"
              }`}
            >
              {stat.change >= 0 ? "↑" : "↓"} {Math.abs(stat.change)}%
            </span>
          </div>
          <p className="text-neutral-400 text-sm mb-1">{stat.label}</p>
          <p className="text-3xl font-bold text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
