"use client";
import React, { useEffect, useRef, useState } from "react";
import BrainChat from "./BrainChat";
import useChatStore from "../../stores/useChatStore";

export default function Chats() {
  const { messages } = useChatStore();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setIsAtBottom(atBottom);
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom("smooth");
    }
  }, [messages, isAtBottom]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-6">
        <div className="text-center text-[#a2a2a2] max-w-sm mx-auto">
          <div className="w-16 h-16 bg-[#f66fde26] border border-[#f66fde] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#f66fde]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Start a conversation</h3>
          <p className="text-sm">Select an AI agent and ask anything to begin chatting.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-3 py-4"
      onScroll={handleScroll}
    >
      <div className="max-w-3xl mx-auto">
        <div className="space-y-4 pb-6">
          {messages.map((message) => (
            <BrainChat key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />

          {/* Scroll to bottom indicator */}
          {!isAtBottom && (
            <div className="fixed bottom-20 right-4 z-40">
              <button
                onClick={() => scrollToBottom()}
                className="w-10 h-10 bg-[#f66fde] hover:bg-[#e55bc4] rounded-full flex items-center justify-center shadow-lg transition-colors"
                title="Scroll to bottom"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
