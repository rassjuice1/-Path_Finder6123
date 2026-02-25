"use client";

interface ChartProps {
  title: string;
  children: React.ReactNode;
}

function ChartContainer({ title, children }: ChartProps) {
  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function RequestChart() {
  const data = [
    { label: "00:00", value: 120 },
    { label: "04:00", value: 80 },
    { label: "08:00", value: 450 },
    { label: "12:00", value: 890 },
    { label: "16:00", value: 1200 },
    { label: "20:00", value: 750 },
    { label: "24:00", value: 320 },
  ];

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <ChartContainer title="📈 Requests Over Time">
      <div className="flex items-end justify-between h-48 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-blue-600 rounded-t hover:bg-blue-500 transition-colors cursor-pointer relative group"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                minHeight: "4px",
              }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.value} requests
              </div>
            </div>
            <span className="text-neutral-500 text-xs">{item.label}</span>
          </div>
        ))}
      </div>
    </ChartContainer>
  );
}

export function StatusCodeChart() {
  const data = [
    { label: "200 OK", value: 8500, color: "bg-green-500" },
    { label: "201 Created", value: 1200, color: "bg-green-400" },
    { label: "204 No Content", value: 800, color: "bg-green-300" },
    { label: "400 Bad Request", value: 450, color: "bg-orange-500" },
    { label: "401 Unauthorized", value: 280, color: "bg-orange-400" },
    { label: "404 Not Found", value: 350, color: "bg-orange-300" },
    { label: "500 Server Error", value: 120, color: "bg-red-500" },
  ];

  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <ChartContainer title="🥧 Status Code Distribution">
      <div className="flex gap-6">
        <div className="flex-1 space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-neutral-400 text-sm flex-1">
                {item.label}
              </span>
              <span className="text-white font-medium">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
              <span className="text-neutral-500 text-sm w-16 text-right">
                {item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="w-32 h-32 rounded-full border-8 border-neutral-700 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {(total / 1000).toFixed(1)}k
            </p>
            <p className="text-neutral-500 text-xs">Total</p>
          </div>
        </div>
      </div>
    </ChartContainer>
  );
}

export function ResponseTimeChart() {
  const data = [
    { label: "GET /users", avg: 45, p95: 120, p99: 250 },
    { label: "POST /users", avg: 180, p95: 350, p99: 520 },
    { label: "GET /posts", avg: 65, p95: 180, p99: 320 },
    { label: "POST /auth", avg: 220, p95: 450, p99: 680 },
    { label: "GET /data", avg: 35, p95: 90, p99: 180 },
  ];

  return (
    <ChartContainer title="⏱️ Response Times (ms)">
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="text-neutral-400 text-sm">{item.label}</span>
              <span className="text-white text-sm">
                avg: {item.avg}ms | p95: {item.p95}ms | p99: {item.p99}ms
              </span>
            </div>
            <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </ChartContainer>
  );
}
