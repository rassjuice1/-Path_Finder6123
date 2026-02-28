"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AnalysisResult {
  type: "info" | "warning" | "error" | "success" | "fix";
  title: string;
  description: string;
  action?: string;
}

const systemPrompt = `You are an AI assistant for an API Dashboard. Your role is to:
1. Analyze dashboard metrics and provide insights
2. Identify issues and suggest fixes
3. Help optimize API performance
4. Answer questions about the dashboard features
5. Provide actionable recommendations

Always be helpful, concise, and technical. Format responses clearly with bullet points when needed.`;

const quickActions = [
  { id: "analyze-performance", label: "Analyze Performance", icon: "📊" },
  { id: "check-errors", label: "Check for Errors", icon: "🔍" },
  { id: "optimize-endpoints", label: "Optimize Endpoints", icon: "⚡" },
  { id: "security-scan", label: "Security Scan", icon: "🔒" },
  { id: "generate-report", label: "Generate Report", icon: "📝" },
  { id: "fix-issues", label: "Auto-Fix Issues", icon: "🔧" },
];

export function AIAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI Dashboard Assistant. I can help you analyze performance, identify issues, and optimize your API. What would you like me to help you with?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [messageId, setMessageId] = useState(2);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeDashboard = async (action: string) => {
    setIsLoading(true);
    
    const newId = messageId;
    const nextId = messageId + 1;
    setMessageId(nextId);
    
    const userMessage: Message = {
      id: newId.toString(),
      role: "user",
      content: getActionPrompt(action),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI analysis with realistic responses
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const results = generateAnalysis(action);
    setAnalysisResults(results);

    const assistantMessage: Message = {
      id: nextId.toString(),
      role: "assistant",
      content: generateResponse(action, results),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const getActionPrompt = (action: string): string => {
    const prompts: Record<string, string> = {
      "analyze-performance": "Analyze the dashboard performance metrics",
      "check-errors": "Check for any errors in the system",
      "optimize-endpoints": "Suggest optimizations for API endpoints",
      "security-scan": "Run a security scan on the dashboard",
      "generate-report": "Generate a comprehensive report",
      "auto-fix": "Automatically fix identified issues",
    };
    return prompts[action] || "Help me with my dashboard";
  };

  const generateAnalysis = (action: string): AnalysisResult[] => {
    const analyses: Record<string, AnalysisResult[]> = {
      "analyze-performance": [
        {
          type: "success",
          title: "API Response Time",
          description: "Average response time is 145ms, which is excellent for production APIs.",
        },
        {
          type: "info",
          title: "Request Volume",
          description: "1.2M requests processed with 99.2% success rate - very healthy traffic.",
        },
        {
          type: "warning",
          title: "Endpoint /api/v1/auth/login",
          description: "220ms average response time - 52% slower than other endpoints. Consider caching authentication tokens.",
          action: "Implement token caching for /api/v1/auth/login",
        },
        {
          type: "success",
          title: "Success Rate",
          description: "99.2% success rate exceeds industry standard of 99%.",
        },
      ],
      "check-errors": [
        {
          type: "success",
          title: "No Critical Errors",
          description: "No critical errors detected in the current session.",
        },
        {
          type: "info",
          title: "404 Error Detected",
          description: "1 instance of 404 error on /api/v1/data endpoint. This may be an outdated endpoint reference.",
          action: "Review and update endpoint references",
        },
        {
          type: "success",
          title: "Error Rate",
          description: "Error rate is 0.8%, well below the 5% threshold.",
        },
      ],
      "optimize-endpoints": [
        {
          type: "fix",
          title: "Deprecate /api/v1/users/:id DELETE",
          description: "This endpoint is marked as deprecated but still receives 2,300 requests.",
          action: "Add deprecation warning to response headers",
        },
        {
          type: "info",
          title: "High Traffic Endpoint",
          description: "/api/v1/users/:id GET receives 89,200 requests - consider implementing caching.",
          action: "Add caching layer for user data",
        },
        {
          type: "success",
          title: "POST Endpoints",
          description: "All POST endpoints are performing within acceptable parameters.",
        },
      ],
      "security-scan": [
        {
          type: "success",
          title: "SSL/TLS",
          description: "All endpoints are served over HTTPS with valid certificates.",
        },
        {
          type: "warning",
          title: "API Key Exposure",
          description: "API key appears to be visible in dashboard settings. Consider using environment variables.",
          action: "Use NEXT_PUBLIC_API_KEY env variable",
        },
        {
          type: "info",
          title: "Authentication",
          description: "All authenticated endpoints use secure token-based auth.",
        },
      ],
      "generate-report": [
        {
          type: "info",
          title: "Report Generated",
          description: "Comprehensive report ready for download.",
        },
      ],
      "auto-fix": [
        {
          type: "fix",
          title: "Token Caching Implemented",
          description: "Added in-memory cache for authentication tokens on /api/v1/auth/login",
        },
        {
          type: "fix",
          title: "Deprecation Headers Added",
          description: "Added Deprecation and Sunset headers to /api/v1/users/:id DELETE",
        },
        {
          type: "success",
          title: "Issues Fixed",
          description: "2 issues have been automatically resolved.",
        },
      ],
    };
    return analyses[action] || [];
  };

  const generateResponse = (action: string, results: AnalysisResult[]): string => {
    const fixCount = results.filter((r) => r.type === "fix").length;
    const warningCount = results.filter((r) => r.type === "warning").length;
    const successCount = results.filter((r) => r.type === "success").length;

    let response = `## Analysis Complete\n\n`;
    
    if (fixCount > 0) {
      response += `✅ **${fixCount} issue(s) automatically fixed**\n`;
    }
    if (warningCount > 0) {
      response += `⚠️ **${warningCount} warning(s)** - Recommended actions available\n`;
    }
    if (successCount > 0) {
      response += `✅ **${successCount} check(s) passed**\n`;
    }

    response += `\nSee the results below for detailed analysis. Would you like me to explain any of these findings or perform additional actions?`;

    return response;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newId = messageId;
    const nextId = messageId + 1;
    setMessageId(nextId);

    const userMessage: Message = {
      id: newId.toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const assistantMessage: Message = {
      id: nextId.toString(),
      role: "assistant",
      content: generateGenericResponse(input),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const generateGenericResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("error") || lowerQuery.includes("bug")) {
      return "I can help you identify and fix errors. Would you like me to run a quick error scan? Or you can use the 'Check for Errors' quick action above.";
    }
    if (lowerQuery.includes("performance") || lowerQuery.includes("slow")) {
      return "For performance issues, I recommend running the 'Analyze Performance' quick action. This will identify bottlenecks and suggest optimizations.";
    }
    if (lowerQuery.includes("security") || lowerQuery.includes("vulnerable")) {
      return "I can run a security scan using the 'Security Scan' quick action. This will check for common vulnerabilities and security best practices.";
    }
    if (lowerQuery.includes("optimize") || lowerQuery.includes("improve")) {
      return "Use the 'Optimize Endpoints' quick action to get specific recommendations for improving API performance.";
    }
    
    return "I'm here to help! You can use the quick actions above for common tasks, or ask me specific questions about your dashboard. What would you like me to help you with?";
  };

  const getTypeColor = (type: AnalysisResult["type"]) => {
    switch (type) {
      case "error":
        return "bg-red-900/50 border-red-500 text-red-200";
      case "warning":
        return "bg-yellow-900/50 border-yellow-500 text-yellow-200";
      case "success":
        return "bg-green-900/50 border-green-500 text-green-200";
      case "fix":
        return "bg-blue-900/50 border-blue-500 text-blue-200";
      default:
        return "bg-neutral-800 border-neutral-600 text-neutral-300";
    }
  };

  const getTypeIcon = (type: AnalysisResult["type"]) => {
    switch (type) {
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "success":
        return "✅";
      case "fix":
        return "🔧";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Quick Actions Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🤖</span> AI Assistant
          </h3>
          <p className="text-neutral-400 text-sm mb-6">
            Let me analyze and optimize your dashboard. Choose an action below:
          </p>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => analyzeDashboard(action.id)}
                disabled={isLoading}
                className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-700/50 hover:bg-neutral-700 rounded-lg text-neutral-300 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg">{action.icon}</span>
                <span className="font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResults.length > 0 && (
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>📋</span> Analysis Results
            </h3>
            <div className="space-y-3">
              {analysisResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getTypeColor(result.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{getTypeIcon(result.type)}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{result.title}</h4>
                      <p className="text-xs mt-1 opacity-90">{result.description}</p>
                      {result.action && (
                        <button className="mt-2 text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors">
                          {result.action} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-neutral-700 text-neutral-100"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.role === "user" ? "text-blue-200" : "text-neutral-500"}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-700 rounded-xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-neutral-700">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything about your dashboard..."
                className="flex-1 bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
