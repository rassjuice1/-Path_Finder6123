"use client";

interface Endpoint {
  id: string;
  path: string;
  method: string;
  description: string;
  status: "active" | "inactive" | "deprecated";
  requests: number;
  avgTime: number;
}

interface EndpointsTableProps {
  endpoints: Endpoint[];
}

export function EndpointsTable({ endpoints }: EndpointsTableProps) {
  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-blue-900/50 text-blue-400";
      case "POST":
        return "bg-green-900/50 text-green-400";
      case "PUT":
        return "bg-yellow-900/50 text-yellow-400";
      case "DELETE":
        return "bg-red-900/50 text-red-400";
      case "PATCH":
        return "bg-purple-900/50 text-purple-400";
      default:
        return "bg-neutral-700 text-neutral-400";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-900/50 text-green-400";
      case "inactive":
        return "bg-neutral-700 text-neutral-400";
      case "deprecated":
        return "bg-yellow-900/50 text-yellow-400";
      default:
        return "bg-neutral-700 text-neutral-400";
    }
  };

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-neutral-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>🔗</span> API Endpoints
        </h3>
        <button className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-sm rounded-lg transition-colors">
          + Add Endpoint
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Method
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Endpoint
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Requests
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Avg Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-700">
            {endpoints.map((endpoint) => (
              <tr key={endpoint.id} className="hover:bg-neutral-700/30">
                <td className="px-4 py-4">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${getMethodColor(
                      endpoint.method
                    )}`}
                  >
                    {endpoint.method}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-white font-mono text-sm">
                    {endpoint.path}
                  </span>
                </td>
                <td className="px-4 py-4 text-neutral-400 text-sm">
                  {endpoint.description}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadge(
                      endpoint.status
                    )}`}
                  >
                    {endpoint.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-white">
                  {endpoint.requests.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-white">{endpoint.avgTime}ms</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors">
                      👁️
                    </button>
                    <button className="p-1.5 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors">
                      ✏️
                    </button>
                    <button className="p-1.5 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
