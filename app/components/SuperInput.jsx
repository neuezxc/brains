"use client";
import { ArrowUp, Settings2 } from "lucide-react";
import useChatStore from "../stores/useChatStore";
import ApiKeySettings from "./ApiKeySettings";
import { useEffect } from "react";

export default function SuperInput() {
  const {
    userInput,
    apiKey,
    messages,
    currentAgent,
    addMessage,
    removeMessage,
    clearUserInput,
    clearMessages
  } = useChatStore();

  const setUserInput = useChatStore((state) => state.setUserInput);

  useEffect(() => {
    console.log("User input:", userInput);
  }, [userInput]);

  useEffect(() => {
    console.log("Messages:", messages);
  }, [messages]);

  const handleMessage = async () => {
    if (!userInput.trim()) return;

    // Check if API key is set
    if (!apiKey.trim()) {
      addMessage({
        role: "assistant",
        content: "Please set your OpenRouter API key first. Click the settings icon (⚙️) to configure your API key.",
        status: "error",
      });
      return;
    }

    // Handle commands
    if (userInput.startsWith("/")) {
      const command = userInput.trim().toLowerCase();
      if (command === "/reset") {
        clearMessages();
        clearUserInput();
        return;
      }
      if (command === "/clear") {
        clearUserInput();
        return;
      }
      if (command === "/help") {
        addMessage({
          role: "assistant",
          content: "Available commands:\n/reset - Clear all messages\n/clear - Clear input\n/help - Show this help\n\nYou can also switch between agents using the BrainSelector above.",
        });
        clearUserInput();
        return;
      }
    }

    try {
      // Create user message
      const userMessage = {
        role: "user",
        content: userInput,
      };

      // Add user message to store
      addMessage(userMessage);
      clearUserInput();

      // Prepare messages for API with system prompt
      const messagesForAPI = [
        {
          role: "system",
          content: currentAgent?.systemPrompt || "You are a helpful AI assistant.",
        },
        ...messages,
        userMessage,
      ];

      // Check if there's already a loading message
      const hasLoadingMessage = messages.some(msg => msg.status === "loading");
      if (hasLoadingMessage) {
        // Remove existing loading message first
        const existingLoading = messages.find(msg => msg.status === "loading");
        if (existingLoading) {
          removeMessage(existingLoading.id);
        }
      }

      // Show loading message
      const loadingMessageId = `loading-${Date.now()}`;
      addMessage({
        id: loadingMessageId,
        role: "assistant",
        content: "Thinking...",
        status: "loading",
      });

      try {
        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "x-ai/grok-4-fast:free",
              messages: messagesForAPI,
            }),
          }
        );

        const data = await response.json();

        // Remove loading message first
        removeMessage(loadingMessageId);

        // Handle API errors
        if (!response.ok) {
          const errorMessage = data.error?.message || `API Error: ${response.status} ${response.statusText}`;
          console.error("API Error:", errorMessage);

          addMessage({
            role: "assistant",
            content: `Error: ${errorMessage}`,
            status: "error",
          });
          return;
        }

        // Validate response structure
        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
          console.error("Unexpected API response structure:", data);

          addMessage({
            role: "assistant",
            content: "Error: Unexpected response format from API",
            status: "error",
          });
          return;
        }

        const assistantContent = data.choices[0].message.content;

        // Add assistant response
        addMessage({
          role: "assistant",
          content: assistantContent,
          status: "success",
        });

      } catch (error) {
        // Remove loading message on error too
        removeMessage(loadingMessageId);

        console.error("Error:", error);
        addMessage({
          role: "assistant",
          content: `Error: ${error.message || "An unexpected error occurred"}`,
          status: "error",
        });
      }

    } catch (error) {
      console.error("Error:", error);

      // Remove loading message if it exists
      useChatStore.getState().messages = useChatStore.getState().messages.filter(
        msg => !msg.id?.startsWith("loading-")
      );

      addMessage({
        role: "assistant",
        content: `Error: ${error.message || "An unexpected error occurred"}`,
        status: "error",
      });
    }
  };

  return (
    <div className="w-full flex justify-center p-2 bg-[var(--background)] border-[#282828]">
      <div className="w-full max-w-3xl mx-auto">
        <div className="box-border w-full bg-[#1b1b1c] border border-[#282828] rounded-lg h-auto min-h-[50px] max-h-[150px] p-3 flex flex-col justify-between">
          <textarea
            placeholder="Ask anything..."
            className="w-full h-full bg-transparent text-white placeholder:text-[#a2a2a2] text-base font-normal resize-none focus:outline-none min-h-[30px] max-h-[100px] overflow-y-auto"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleMessage();
              }
            }}
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#454545 transparent' }}
          />
          <div className="flex justify-between items-center mt-2">
            <ApiKeySettings />

            <button
              aria-label="Send"
              className="box-border bg-[#f66fde26] border border-[#f66fde] rounded-lg w-8 h-8 flex items-center justify-center shrink-0 hover:bg-[#f66fde33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleMessage}
              disabled={!userInput.trim()}
            >
              <ArrowUp className="w-4 h-4 text-[#d3d3d3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
