"use client";
import { Settings, ArrowUp, Edit } from "lucide-react";
import useChatStore from "../stores/useChatStore";
import { useEffect } from "react";

export default function SuperInput() {
  const { userInput, apiKey, messages } = useChatStore();
  const setUserInput = useChatStore((state) => state.setUserInput);
  const clearUserInput = useChatStore((state) => state.clearUserInput);
  const addMessage = useChatStore((state) => state.addMessage);
  const clearMessages = useChatStore((state) => state.clearMessages);

  useEffect(() => {
    console.log(userInput);
  }, [userInput]);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const handleMessage = async () => {
    if (!userInput.trim()) return;
    if (userInput.startsWith("/")) {
      const command = userInput.trim().toLowerCase();
      if (command === "/reset") {
        clearMessages();
        clearUserInput();
      }
      return;
    }

    try {
      let newData = {
        role: "user",
        content: userInput,
      };
      // Add the user message to the store
      addMessage(newData);
      clearUserInput();
      
      // Create the full messages array including the new user message
      const allMessages = [...messages, newData];
      
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
            messages: allMessages, // Use the messages array with the new user message included
          }),
        }
      );

      const data = await response.json();

      // Check if the response has the expected structure
      if (!response.ok) {
        // Handle API error
        const errorMessage = data.error?.message || `API Error: ${response.status} ${response.statusText}`;
        console.error("API Error:", errorMessage);
        
        addMessage({
          role: "assistant",
          content: `Error: ${errorMessage}`,
        });
        return;
      }

      // Check if the response has the expected choices structure
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        console.error("Unexpected API response structure:", data);
        
        addMessage({
          role: "assistant",
          content: "Error: Unexpected response format from API",
        });
        return;
      }

      const text = data.choices[0].message.content;

      addMessage({
        role: "assistant",
        content: text,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full flex justify-center absolute bottom-0 bg-[var(--background)]">
      <div
        id="SuperInput_99_256"
        className="box-border w-full bg-[#1b1b1c] border border-[#282828] rounded-[15px] h-[144px] p-4 flex flex-col justify-between mb-5 sm:mx-[600px] md:mx-[300px] lg:mx-[300px]"
      >
        <textarea
          id="Textarea_99_257"
          placeholder="Ask anything..."
          className="w-full h-full bg-transparent text-white placeholder:text-[#a2a2a2] text-base font-normal resize-none focus:outline-none"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleMessage();
            }
          }}
        />
        <div className="flex justify-between items-center mt-2">
          <button
            id="ApiSetting_99_267"
            aria-label="API Settings"
            className="box-border bg-[#4545454d] border-[0.5px] border-[#454545] rounded-lg w-8 h-8 flex items-center justify-center shrink-0"
          >
            {/* Replaced with Lucide 'Settings' icon */}
            <Settings
              id="LucideSettings_2_99_269"
              className="w-4 h-4 text-[#9F9F9F]"
              strokeWidth={1.5}
            />
          </button>

          <button
            id="SendBtn_105_647"
            aria-label="Send"
            className="box-border bg-[#f66fde26] border border-[#f66fde] rounded-lg w-8 h-8 flex items-center justify-center shrink-0"
            onClick={handleMessage}
          >
            {/* Replaced with Lucide 'ArrowUp' icon */}
            <ArrowUp id="Up_99_266" className="w-4 h-4 text-[#d3d3d3]" />
          </button>
        </div>
      </div>
    </div>
  );
}
