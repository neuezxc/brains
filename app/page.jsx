"use client";
import { useEffect } from "react";
import Chats from "./components/Chats";
import SuperInput from "./components/SuperInput";
import BrainSelector from "./components/BrainSelector";
import useChatStore from "./stores/useChatStore";

export default function Home() {
  const { setUserInput, clearMessages, addMessage } = useChatStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Global keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            // Focus on input
            const textarea = document.querySelector('textarea');
            if (textarea) {
              textarea.focus();
            }
            break;
          case '/':
            e.preventDefault();
            // Show help
            addMessage({
              role: "assistant",
              content: "Keyboard shortcuts:\nCtrl+K: Focus input\nCtrl+/: Show help\n\nCommands in chat:\n/reset - Clear all messages\n/clear - Clear input\n/help - Show this help",
            });
            break;
        }
      }

      // Escape key to close dropdowns
      if (e.key === 'Escape') {
        // Close any open dropdowns
        const dropdowns = document.querySelectorAll('[data-dropdown-open="true"]');
        dropdowns.forEach(dropdown => {
          dropdown.setAttribute('data-dropdown-open', 'false');
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [addMessage]);

  return (
    <div className="h-screen bg-[var(--background)] flex flex-col">
      {/* Compact Header with BrainSelector */}
      <div className="flex-shrink-0 bg-[var(--background)]">
        <BrainSelector />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        <Chats />
        <SuperInput />
      </div>
    </div>
  );
}
