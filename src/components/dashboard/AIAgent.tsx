"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  actions?: AIAction[];
}

interface AIAction {
  id: string;
  label: string;
  action: "fix" | "explain" | "test" | "revert";
  loading?: boolean;
}

interface AIAgentProps {
  errorContext?: string;
  onFixApplied?: (fix: string) => void;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm your AI assistant, here to help you fix errors and optimize your application. You can:\n\n• Paste an error message or stack trace\n• Ask me to explain what's happening\n• Request fixes for specific issues\n• Test proposed solutions\n\nWhat would you like help with today?",
    timestamp: new Date(),
  },
];

export function AIAgent({ errorContext, onFixApplied }: AIAgentProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const errorContextRef = useRef(errorContext);

  // Update ref when errorContext changes
  useEffect(() => {
    errorContextRef.current = errorContext;
  }, [errorContext]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate AI response based on user input
  const generateAIResponse = (userInput: string): Message => {
    const lowerInput = userInput.toLowerCase();
    const now = new Date();

    // Error analysis responses
    if (
      lowerInput.includes("error") ||
      lowerInput.includes("failed") ||
      lowerInput.includes("exception")
    ) {
      return {
        id: now.getTime().toString(),
        role: "assistant",
        content:
          "I've analyzed the error. Based on the pattern, here's what I found:\n\n**Root Cause:** The error typically occurs when the API response structure doesn't match what's expected.\n\n**Suggested Fix:**\n1. Check the API endpoint configuration\n2. Validate the response schema\n3. Add proper error handling\n\nWould you like me to apply a fix?",
        timestamp: now,
        actions: [
          { id: "1", label: "🔧 Apply Fix", action: "fix" },
          { id: "2", label: "📖 Explain More", action: "explain" },
          { id: "3", label: "🧪 Test Solution", action: "test" },
        ],
      };
    }

    // Performance issues
    if (
      lowerInput.includes("slow") ||
      lowerInput.includes("performance") ||
      lowerInput.includes("timeout")
    ) {
      return {
        id: now.getTime().toString(),
        role: "assistant",
        content:
          "I've identified potential performance issues:\n\n**Analysis:**\n• Database queries may be missing indexes\n• N+1 query pattern detected\n• No caching implemented\n\n**Recommendations:**\n1. Add database indexes on frequently queried fields\n2. Implement query caching\n3. Consider pagination for large datasets\n\nWould you like me to implement these optimizations?",
        timestamp: now,
        actions: [
          { id: "1", label: "⚡ Optimize Now", action: "fix" },
          { id: "2", label: "📖 Explain Impact", action: "explain" },
        ],
      };
    }

    // General help
    if (
      lowerInput.includes("help") ||
      lowerInput.includes("what") ||
      lowerInput.includes("how")
    ) {
      return {
        id: now.getTime().toString(),
        role: "assistant",
        content:
          "I can help you with:\n\n🔍 **Debugging** - Analyze errors and find root causes\n⚠️ **Error Handling** - Fix exceptions and edge cases\n⚡ **Performance** - Optimize slow queries and caching\n🔒 **Security** - Identify vulnerabilities\n📊 **Analytics** - Improve tracking and metrics\n\nJust describe what you're working on and I'll assist!",
        timestamp: now,
      };
    }

    // Default response
    return {
      id: now.getTime().toString(),
      role: "assistant",
      content:
        "I understand you're asking about: \"" +
        userInput.substring(0, 50) +
        "...\"\n\nLet me analyze this and provide relevant suggestions.\n\nIn a production environment, I would:\n1. Search through your codebase for related patterns\n2. Check recent changes that might have caused the issue\n3. Suggest specific fixes based on best practices\n\nCould you provide more details about the specific error or behavior you're seeing?",
      timestamp: now,
    };
  };

  const handleSubmit = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const now = new Date();
    const userMessage: Message = {
      id: now.getTime().toString(),
      role: "user",
      content: messageText,
      timestamp: now,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (in production, this would call an actual AI API)
    setTimeout(() => {
      const response = generateAIResponse(messageText);
      setMessages((prev) => [...prev, response]);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    if (errorContextRef.current) {
      handleSubmit(`Analyze this error:\n${errorContextRef.current}`);
    }
  }, [handleSubmit]);


  const handleAction = (action: AIAction, messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message) return;

    // Update action to loading state
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              actions: m.actions?.map((a) =>
                a.id === action.id ? { ...a, loading: true } : a
              ),
            }
          : m
      )
    );

    setIsLoading(true);

    // Simulate action execution
    setTimeout(() => {
      let responseContent = "";

      switch (action.action) {
        case "fix":
          responseContent =
            "I've applied the fix to your codebase:\n\n```typescript\n// Added proper error handling\ntry {\n  const response = await fetchData();\n  if (!response.ok) {\n    throw new Error(`HTTP error! status: ${response.status}`);\n  }\n  return await response.json();\n} catch (error) {\n  console.error('Failed to fetch data:', error);\n  // Return fallback data or retry logic\n  return null;\n}\n```\n\n✅ Fix applied successfully!";
          break;
        case "explain":
          responseContent =
            "Here's a detailed explanation:\n\n**What happened:**\nThe error occurred because the API returned an unexpected response format. This typically happens when:\n1. The API schema changed without updating the client\n2. Network issues caused partial data transmission\n3. Race conditions in async operations\n\n**Best Practices:**\n- Always validate API responses against a schema\n- Implement retry logic with exponential backoff\n- Add comprehensive error boundaries";
          break;
        case "test":
          responseContent =
            "Running tests...\n\n```\n✓ API Error Handling - PASSED\n✓ Network Timeout Handling - PASSED\n✓ Schema Validation - PASSED\n✓ Retry Logic - PASSED\n\nAll tests passed! Your application should now handle this error gracefully.\n```";
          break;
        default:
          responseContent = "Action completed successfully.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: responseContent,
          timestamp: new Date(),
        },
      ]);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                actions: m.actions?.map((a) =>
                  a.id === action.id ? { ...a, loading: false } : a
                ),
              }
            : m
        )
      );

      if (action.action === "fix") {
        onFixApplied?.(responseContent);
      }

      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-neutral-700 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Fix Assistant</h3>
            <p className="text-neutral-400 text-xs">
              Powered by AI • Analyzes & fixes errors
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl p-4 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-700 text-neutral-100"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.actions && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {message.actions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleAction(action, message.id)}
                      disabled={action.loading || isLoading}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        action.loading
                          ? "bg-neutral-600 text-neutral-400"
                          : "bg-neutral-600 hover:bg-neutral-500 text-white"
                      }`}
                    >
                      {action.loading ? "⏳ Processing..." : action.label}
                    </button>
                  ))}
                </div>
              )}
              <p
                className={`text-xs mt-2 ${
                  message.role === "user" ? "text-blue-200" : "text-neutral-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-neutral-700 text-neutral-100 rounded-xl p-4 max-w-[80%]">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-neutral-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Describe your issue or paste an error..."
            className="flex-1 bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
        <p className="text-neutral-500 text-xs mt-2 text-center">
          AI suggestions are recommendations • Always review before applying
        </p>
      </div>
    </div>
  );
}
