"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Brain, User, Copy, Check, RotateCcw } from "lucide-react";
import useChatStore from "../../stores/useChatStore";

export default function BrainChat({ message }) {
  const { currentAgent, agents } = useChatStore();
  const [copied, setCopied] = React.useState(false);

  // Don't render loading messages that are older than 30 seconds (cleanup)
  if (message.status === "loading" && message.timestamp) {
    const age = Date.now() - new Date(message.timestamp).getTime();
    if (age > 30000) { // 30 seconds
      return null;
    }
  }

  const getAgentById = (agentId) => {
    return agents.find(agent => agent.id === agentId) || currentAgent;
  };

  const agent = getAgentById(message.agentId);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const getMessageIcon = () => {
    if (message.role === "user") {
      return;
    }
    return (
      <div className="w-6 h-6  rounded-full flex items-center justify-center">
        <Brain className="w-5 h-5 text-[#f66fde]" />
      </div>
    );
  };

  const getMessageStyles = () => {
    if (message.role === "user") {
      return "bg-[#191318] rounded-lg p-3";
    }

    // Different styling based on agent type
    const isCustom = agent?.isCustom;
    return `bg-[#1b1b1c] border rounded-lg p-3 ${
      isCustom
        ? "border-[#f66fde]"
        : "border-[#282828]"
    }`;
  };

  const getAgentName = () => {
    if (message.role === "user") return "You";
    return agent?.name || "Assistant";
  };

  const getStatusIndicator = () => {
    if (message.status === "loading") {
      return (
        <div className="flex items-center gap-2 text-[#a2a2a2] text-sm mt-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-[#f66fde] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-[#f66fde] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-[#f66fde] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span>AI is thinking...</span>
        </div>
      );
    }

    if (message.status === "error") {
      return (
        <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
          <RotateCcw className="w-4 h-4" />
          <span>Failed to get response</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`brain flex flex-row gap-3 mb-6 ${
      message.role === "user" ? "justify-end" : "justify-start"
    }`}>
      {message.role !== "user" && (
        <div className="icon h-[40px] w-[40px] bg-[#f66fde26] border border-[#f66fde] rounded-full flex items-center justify-center shrink-0">
          {getMessageIcon()}
        </div>
      )}

      <div className={`texts flex-1 max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"}`}>
        <div className="brain-name font-medium mb-2 text-sm">
          {getAgentName()}
          {message.role !== "user" && agent?.isCustom && (
            <span className="ml-2 text-xs text-[#f66fde]">(Custom)</span>
          )}
        </div>

        <div className={getMessageStyles()}>
          {message.role === "user" ? (
            <div className="text-white whitespace-pre-wrap">
              {message.content}
            </div>
          ) : (
            <div className="text-white">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline ? (
                      <div className="relative">
                        <pre className="bg-[#0a0a0a] border border-[#282828] rounded p-3 overflow-x-auto text-sm">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                        <button
                          onClick={handleCopy}
                          className="absolute top-2 right-2 p-1 bg-[#282828] hover:bg-[#333] rounded text-[#a2a2a2] hover:text-white transition-colors"
                          title="Copy code"
                        >
                          {copied ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <code className="bg-[#0a0a0a] px-1 py-0.5 rounded text-sm">
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-white">{children}</li>,
                  h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-white">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-white">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-bold mb-1 text-white">{children}</h3>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[#f66fde] pl-4 italic text-[#a2a2a2] my-2">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {getStatusIndicator()}
        </div>
      </div>

      {message.role === "user" && (
        <div className="icon h-[40px] w-[40px] rounded-full flex items-center justify-center shrink-0">
          {getMessageIcon()}
        </div>
      )}
    </div>
  );
}