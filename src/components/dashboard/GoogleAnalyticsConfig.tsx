"use client";

import { useState } from "react";
import { GAConfig, validateGAConfig, testGAConnection } from "@/lib/google-analytics";

interface GoogleAnalyticsConfigProps {
  config: GAConfig;
  onUpdate: (config: GAConfig) => void;
}

export function GoogleAnalyticsConfig({
  config,
  onUpdate,
}: GoogleAnalyticsConfigProps) {
  const [propertyId, setPropertyId] = useState(config.propertyId);
  const [credentials, setCredentials] = useState(config.credentials);
  const [errors, setErrors] = useState<string[]>([]);
  const [showCredentials, setShowCredentials] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  const handleSave = () => {
    const newConfig: GAConfig = {
      propertyId: propertyId.trim(),
      credentials: credentials.trim(),
    };

    const validation = validateGAConfig(newConfig);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    onUpdate(newConfig);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    setTestError(null);

    if (!propertyId.trim() || !credentials.trim()) {
      setTestResult("error");
      setTesting(false);
      return;
    }

    // Test the actual connection to Google Analytics
    const result = await testGAConnection({
      propertyId: propertyId.trim(),
      credentials: credentials.trim(),
    });

    setTestResult(result.success ? "success" : "error");
    if (!result.success) {
      setTestError(result.error || "Connection failed");
    } else {
      setTestError(null);
    }
  };

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">📊</span>
        <div>
          <h3 className="text-xl font-semibold text-white">
            Google Analytics Configuration
          </h3>
          <p className="text-neutral-400 text-sm">
            Connect your GA4 property to track website analytics
          </p>
        </div>
      </div>

      {/* Property ID */}
      <div>
        <label className="block text-neutral-300 text-sm font-medium mb-2">
          GA4 Property ID
        </label>
        <input
          type="text"
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          placeholder="e.g., 123456789"
          className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500"
        />
        <p className="text-neutral-500 text-xs mt-1">
          Find this in Google Analytics → Admin → Property Settings
        </p>
      </div>

      {/* Credentials */}
      <div>
        <label className="block text-neutral-300 text-sm font-medium mb-2">
          Service Account Credentials (JSON)
        </label>
        <textarea
          value={credentials}
          onChange={(e) => setCredentials(e.target.value)}
          placeholder='{"type": "service_account", "project_id": "..."}'
          rows={6}
          className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 font-mono text-sm"
        />
        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            onClick={() => setShowCredentials(!showCredentials)}
            className="text-blue-400 text-sm hover:text-blue-300"
          >
            {showCredentials ? "👁️ Hide" : "👁️ Show"} credentials
          </button>
          <span className="text-neutral-500">•</span>
          <a
            href="https://console.cloud.google.com/iam-admin/serviceaccounts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-sm hover:text-blue-300"
          >
            🔗 Create service account
          </a>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
          <h4 className="text-red-400 font-medium mb-2">Configuration Errors:</h4>
          <ul className="list-disc list-inside text-red-300 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Test Result */}
      {testResult && (
        <div
          className={`border rounded-lg p-4 ${
            testResult === "success"
              ? "bg-green-900/30 border-green-700"
              : "bg-red-900/30 border-red-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {testResult === "success" ? "✅" : "❌"}
            </span>
            <div>
              <p
                className={
                  testResult === "success" ? "text-green-400" : "text-red-400"
                }
              >
                {testResult === "success"
                  ? "Connection successful! Data will start syncing."
                  : "Connection failed. Please check your credentials."}
              </p>
              {testError && (
                <p className="text-red-300 text-sm mt-1">{testError}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleTest}
          disabled={testing || !propertyId || !credentials}
          className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {testing ? "⏳ Testing..." : "🧪 Test Connection"}
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
        >
          💾 Save Configuration
        </button>
      </div>

      {/* Help */}
      <div className="bg-neutral-700/50 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">📋 Setup Instructions:</h4>
        <ol className="text-neutral-400 text-sm space-y-2 list-decimal list-inside">
          <li>
            Go to{" "}
            <a
              href="https://console.cloud.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              Google Cloud Console
            </a>{" "}
            and create a project
          </li>
          <li>Enable the Google Analytics Data API</li>
          <li>Create a service account and download the JSON key</li>
          <li>
            In Google Analytics, add the service account email as a viewer
          </li>
          <li>Paste the JSON credentials above</li>
        </ol>
      </div>
    </div>
  );
}
