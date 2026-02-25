"use client";

import { useState } from "react";

interface ResponseData {
  id: string;
  endpoint: string;
  method: string;
  status: number;
  time: number;
  size: string;
  timestamp: string;
}

interface APIResponseViewerProps {
  responses: ResponseData[];
}

export function APIResponseViewer({ responses }: APIResponseViewerProps) {
  const [selectedResponse, setSelectedResponse] = useState<ResponseData | null>(
    responses[0] || null
  );

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

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-400";
    if (status >= 300 && status < 400) return "text-yellow-400";
    if (status >= 400 && status < 500) return "text-orange-400";
    if (status >= 500) return "text-red-400";
    return "text-neutral-400";
  };

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-neutral-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>📋</span> Recent API Responses
        </h3>
        <span className="text-neutral-400 text-sm">
          Showing {responses.length} requests
        </span>
      </div>
      <div className="flex">
        {/* Response List */}
        <div className="w-1/2 border-r border-neutral-700 max-h-96 overflow-y-auto">
          {responses.map((response) => (
            <button
              key={response.id}
              onClick={() => setSelectedResponse(response)}
              className={`w-full p-4 text-left border-b border-neutral-700 hover:bg-neutral-700/50 transition-colors ${
                selectedResponse?.id === response.id
                  ? "bg-neutral-700"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${getMethodColor(
                    response.method
                  )}`}
                >
                  {response.method}
                </span>
                <span className={`text-sm font-mono ${getStatusColor(response.status)}`}>
                  {response.status}
                </span>
              </div>
              <p className="text-white text-sm font-mono truncate">
                {response.endpoint}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                <span>{response.time}ms</span>
                <span>{response.size}</span>
                <span>{response.timestamp}</span>
              </div>
            </button>
          ))}
        </div>
        {/* Response Details */}
        <div className="w-1/2 p-4 max-h-96 overflow-y-auto">
          {selectedResponse ? (
            <div>
              <h4 className="text-white font-semibold mb-3">Response Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Endpoint:</span>
                  <span className="text-white font-mono text-sm">
                    {selectedResponse.endpoint}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Method:</span>
                  <span
                    className={`font-bold ${getMethodColor(
                      selectedResponse.method
                    ).replace("bg-", "text-").replace("/50", "")}`}
                  >
                    {selectedResponse.method}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Status:</span>
                  <span className={`font-mono ${getStatusColor(selectedResponse.status)}`}>
                    {selectedResponse.status} OK
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Response Time:</span>
                  <span className="text-white">{selectedResponse.time}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Size:</span>
                  <span className="text-white">{selectedResponse.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Timestamp:</span>
                  <span className="text-white">{selectedResponse.timestamp}</span>
                </div>
              </div>
              <div className="mt-4">
                <h5 className="text-neutral-400 text-sm mb-2">Response Body:</h5>
                <pre className="bg-neutral-900 p-3 rounded-lg text-xs text-green-400 font-mono overflow-x-auto">
                  {JSON.stringify(
                    {
                      success: true,
                      data: {
                        id: selectedResponse.id,
                        message: "Data fetched successfully",
                      },
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-500">
              Select a response to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
