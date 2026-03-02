"use client";

import { useState } from "react";

interface EmbeddedSiteProps {
  domain: string;
}

export function EmbeddedSite({ domain }: EmbeddedSiteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const url = `https://${domain}`;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="bg-neutral-800 border-b border-neutral-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔗</span>
          <span className="font-medium text-white">{domain}</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
          >
            Open in New Tab ↗
          </a>
        </div>
      </div>

      {/* Iframe Container */}
      <div className="flex-1 relative bg-white">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-neutral-400">Loading {domain}...</p>
            </div>
          </div>
        )}
        <iframe
          src={url}
          title={domain}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
}
