"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { APIResponseViewer } from "@/components/dashboard/APIResponseViewer";
import { EndpointsTable } from "@/components/dashboard/EndpointsTable";
import { RequestChart, StatusCodeChart, ResponseTimeChart } from "@/components/dashboard/Charts";
import { APISettings } from "@/components/dashboard/APISettings";
import { SocialMediaStats } from "@/components/dashboard/SocialMediaStats";
import { GoogleAnalyticsConfig } from "@/components/dashboard/GoogleAnalyticsConfig";
import { ErrorTracker } from "@/components/dashboard/ErrorTracker";
import { ProtectedDashboard } from "@/components/dashboard/ProtectedDashboard";
import { RevenueAnalytics } from "@/components/dashboard/RevenueAnalytics";
import { useAuth } from "@/lib/AuthContext";

// Mock data for the dashboard
const mockStats = [
  {
    id: "total-requests",
    label: "Total Requests",
    value: "1.2M",
    change: 12.5,
    icon: "📨",
    color: "bg-blue-900/50",
  },
  {
    id: "success-rate",
    label: "Success Rate",
    value: "99.2%",
    change: 0.8,
    icon: "✅",
    color: "bg-green-900/50",
  },
  {
    id: "avg-response",
    label: "Avg Response Time",
    value: "145ms",
    change: -5.2,
    icon: "⏱️",
    color: "bg-purple-900/50",
  },
  {
    id: "active-endpoints",
    label: "Active Endpoints",
    value: "24",
    change: 4,
    icon: "🔗",
    color: "bg-orange-900/50",
  },
];

const mockResponses = [
  {
    id: "1",
    endpoint: "/api/v1/users",
    method: "GET",
    status: 200,
    time: 45,
    size: "2.3 KB",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    endpoint: "/api/v1/posts",
    method: "POST",
    status: 201,
    time: 180,
    size: "1.1 KB",
    timestamp: "3 min ago",
  },
  {
    id: "3",
    endpoint: "/api/v1/users/123",
    method: "GET",
    status: 200,
    time: 38,
    size: "4.5 KB",
    timestamp: "5 min ago",
  },
  {
    id: "4",
    endpoint: "/api/v1/auth/login",
    method: "POST",
    status: 200,
    time: 220,
    size: "0.8 KB",
    timestamp: "8 min ago",
  },
  {
    id: "5",
    endpoint: "/api/v1/data",
    method: "GET",
    status: 404,
    time: 12,
    size: "0.2 KB",
    timestamp: "10 min ago",
  },
];

const mockEndpoints = [
  {
    id: "1",
    path: "/api/v1/users",
    method: "GET",
    description: "Get all users",
    status: "active" as const,
    requests: 45600,
    avgTime: 45,
  },
  {
    id: "2",
    path: "/api/v1/users",
    method: "POST",
    description: "Create a new user",
    status: "active" as const,
    requests: 12300,
    avgTime: 180,
  },
  {
    id: "3",
    path: "/api/v1/users/:id",
    method: "GET",
    description: "Get user by ID",
    status: "active" as const,
    requests: 89200,
    avgTime: 38,
  },
  {
    id: "4",
    path: "/api/v1/users/:id",
    method: "PUT",
    description: "Update user",
    status: "active" as const,
    requests: 15600,
    avgTime: 95,
  },
  {
    id: "5",
    path: "/api/v1/users/:id",
    method: "DELETE",
    description: "Delete user",
    status: "deprecated" as const,
    requests: 2300,
    avgTime: 65,
  },
  {
    id: "6",
    path: "/api/v1/auth/login",
    method: "POST",
    description: "User authentication",
    status: "active" as const,
    requests: 67800,
    avgTime: 220,
  },
];

const tabInfo: Record<string, { title: string; subtitle: string }> = {
  overview: {
    title: "Dashboard Overview",
    subtitle: "Monitor your API performance and usage",
  },
  social: {
    title: "Social Media Analytics",
    subtitle: "Track traffic from social media platforms",
  },
  revenue: {
    title: "Revenue Analytics",
    subtitle: "Track income from subscriptions, data packages, and API usage",
  },
  endpoints: {
    title: "API Endpoints",
    subtitle: "Manage and monitor your API endpoints",
  },
  requests: {
    title: "Request Logs",
    subtitle: "View all incoming API requests",
  },
  responses: {
    title: "Response Viewer",
    subtitle: "Inspect API responses",
  },
  analytics: {
    title: "Analytics",
    subtitle: "Detailed performance analytics",
  },
  errors: {
    title: "Error Tracker",
    subtitle: "Monitor and resolve application errors",
  },
  settings: {
    title: "Settings",
    subtitle: "Configure your API connection",
  },
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [apiBaseUrl, setApiBaseUrl] = useState("https://api.example.com/v1");
  const [apiKey, setApiKey] = useState("sk_live_xxxxxxxxxxxxxxxxxxxxx");
  const [gaConfig, setGaConfig] = useState({ propertyId: "", credentials: "" });
  const [errorCount, setErrorCount] = useState(0);

  const handleApiUpdate = (baseUrl: string, key: string) => {
    setApiBaseUrl(baseUrl);
    setApiKey(key);
    console.log("API Updated:", { baseUrl, key });
  };

  const handleGAUpdate = (config: { propertyId: string; credentials: string }) => {
    setGaConfig(config);
    console.log("GA Config Updated:", config);
  };

  const handleErrorCountChange = (count: number) => {
    setErrorCount(count);
  };

  return (
    <ProtectedDashboard>
    <div className="flex min-h-screen bg-neutral-900">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1">
        <Header
          title={tabInfo[activeTab].title}
          subtitle={tabInfo[activeTab].subtitle}
        />
        <div className="p-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <StatsCards stats={mockStats} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RequestChart />
                <StatusCodeChart />
              </div>
              <APIResponseViewer responses={mockResponses} />
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-8">
              <GoogleAnalyticsConfig config={gaConfig} onUpdate={handleGAUpdate} />
              {gaConfig.propertyId && <SocialMediaStats config={gaConfig} />}
            </div>
          )}

          {activeTab === "revenue" && (
            <div className="space-y-8">
              <RevenueAnalytics />
            </div>
          )}

          {activeTab === "endpoints" && (
            <div className="space-y-8">
              <StatsCards stats={mockStats} />
              <EndpointsTable endpoints={mockEndpoints} />
            </div>
          )}

          {activeTab === "requests" && (
            <div className="space-y-8">
              <StatsCards stats={mockStats} />
              <APIResponseViewer responses={mockResponses} />
            </div>
          )}

          {activeTab === "responses" && (
            <div className="space-y-8">
              <APIResponseViewer responses={mockResponses} />
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-8">
              <StatsCards stats={mockStats} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RequestChart />
                <StatusCodeChart />
              </div>
              <ResponseTimeChart />
            </div>
          )}

          {activeTab === "errors" && (
            <div className="space-y-8">
              <ErrorTracker onErrorCountChange={handleErrorCountChange} />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-2xl space-y-8">
              <APISettings
                baseUrl={apiBaseUrl}
                apiKey={apiKey}
                onUpdate={handleApiUpdate}
              />
              <GoogleAnalyticsConfig config={gaConfig} onUpdate={handleGAUpdate} />
            </div>
          )}
        </div>
      </main>
      </div>
    </ProtectedDashboard>
  );
}
