import { create } from "zustand";
import { persist } from "zustand/middleware";

// Default agents with their system prompts
const defaultAgents = [
  {
    id: "general",
    name: "General Assistant",
    description: "A helpful AI assistant for general questions and tasks",
    systemPrompt: "You are a helpful AI assistant. Provide clear, accurate, and useful responses to user queries. Be conversational and engaging while maintaining professionalism.",
    createdAt: new Date(),
    isCustom: false,
  },
  {
    id: "creative",
    name: "Creative Writer",
    description: "Specialized in creative writing, storytelling, and content creation",
    systemPrompt: "You are a creative writing assistant. Help users with storytelling, content creation, poetry, scripts, and other creative writing tasks. Be imaginative, descriptive, and inspiring in your responses.",
    createdAt: new Date(),
    isCustom: false,
  },
  {
    id: "technical",
    name: "Technical Expert",
    description: "Expert in programming, development, and technical problem-solving",
    systemPrompt: "You are a technical expert specializing in programming, software development, and technical problem-solving. Provide detailed, accurate technical guidance and code examples when appropriate.",
    createdAt: new Date(),
    isCustom: false,
  },
  {
    id: "analyst",
    name: "Data Analyst",
    description: "Specialized in data analysis, insights, and business intelligence",
    systemPrompt: "You are a data analyst expert. Help users understand data, provide insights, explain trends, and assist with data-related questions and analysis.",
    createdAt: new Date(),
    isCustom: false,
  },
];

const useChatStore = create(
  persist(
    (set, get) => ({
      // Chat state
      userInput: "",
      messages: [],
      currentAgent: defaultAgents[0],
      agents: defaultAgents,
      conversations: [],
      currentConversationId: null,

      // API configuration
      apiKey: "",

      // Actions
      setApiKey: (key) => set({ apiKey: key }),
      setUserInput: (input) => set({ userInput: input }),
      clearUserInput: () => set({ userInput: "" }),

      // Agent management
      setCurrentAgent: (agent) => set({ currentAgent: agent }),
      addAgent: (agent) =>
        set((state) => ({
          agents: [...state.agents, agent],
        })),
      updateAgent: (agentId, updates) =>
        set((state) => ({
          agents: state.agents.map((agent) =>
            agent.id === agentId ? { ...agent, ...updates } : agent
          ),
        })),
      deleteAgent: (agentId) =>
        set((state) => {
          const newAgents = state.agents.filter((agent) => agent.id !== agentId);
          const newCurrentAgent = state.currentAgent.id === agentId ? newAgents[0] : state.currentAgent;
          return {
            agents: newAgents,
            currentAgent: newCurrentAgent,
          };
        }),

      // Message management
      addMessage: (message) =>
        set((state) => {
          const newMessage = {
            ...message,
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            agentId: state.currentAgent.id,
          };
          return { messages: [...state.messages, newMessage] };
        }),
      updateMessage: (messageId, updates) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          ),
        })),
      removeMessage: (messageId) =>
        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== messageId),
        })),
      clearMessages: () => set({ messages: [] }),

      // Conversation management
      createConversation: (title) =>
        set((state) => {
          const newConversation = {
            id: `conv-${Date.now()}`,
            title: title || "New Conversation",
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          return {
            conversations: [...state.conversations, newConversation],
            currentConversationId: newConversation.id,
          };
        }),
      setCurrentConversation: (conversationId) =>
        set({ currentConversationId: conversationId }),
      updateConversation: (conversationId, updates) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId ? { ...conv, ...updates, updatedAt: new Date() } : conv
          ),
        })),
      deleteConversation: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== conversationId),
          currentConversationId: state.currentConversationId === conversationId ? null : state.currentConversationId,
        })),

      // Utility functions
      getCurrentConversation: () => {
        const state = get();
        return state.conversations.find((conv) => conv.id === state.currentConversationId);
      },

      exportData: () => {
        const state = get();
        return {
          agents: state.agents,
          conversations: state.conversations,
          currentAgent: state.currentAgent,
          exportDate: new Date(),
        };
      },

      importData: (data) =>
        set({
          agents: data.agents || defaultAgents,
          conversations: data.conversations || [],
          currentAgent: data.currentAgent || defaultAgents[0],
        }),
    }),
    {
      name: "brains-chat-storage",
      partialize: (state) => ({
        agents: state.agents,
        conversations: state.conversations,
        currentAgent: state.currentAgent,
        currentConversationId: state.currentConversationId,
      }),
    }
  )
);

export default useChatStore;
