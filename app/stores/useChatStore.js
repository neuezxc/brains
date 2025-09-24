import { create } from "zustand";
import { persist } from "zustand/middleware";

const useChatStore = create(
  persist((set) => ({
    userInput: "",
    messages: [],
    apiKey:
      "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",
    setApiKey: (key) => set({ apiKey: key }),
    setUserInput: (input) => set({ userInput: input }),
    clearUserInput: () => set({ userInput: "" }),
    addMessage: (message) =>
      set((state) => ({ messages: [...state.messages, message] })),
    clearMessages: () => set({ messages: [] }),
  })),
  {
    name: "chat-storage",
  }
);

export default useChatStore;
