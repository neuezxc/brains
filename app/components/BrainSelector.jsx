"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Plus, Brain, Settings, X } from "lucide-react";
import useChatStore from "../stores/useChatStore";

export default function BrainSelector() {
  const { agents, currentAgent, setCurrentAgent, addAgent } = useChatStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentDescription, setNewAgentDescription] = useState("");
  const [newAgentPrompt, setNewAgentPrompt] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowCreateForm(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAgentSelect = (agent) => {
    setCurrentAgent(agent);
    setIsOpen(false);
  };

  const handleCreateAgent = () => {
    if (!newAgentName.trim() || !newAgentPrompt.trim()) return;

    const newAgent = {
      id: `custom-${Date.now()}`,
      name: newAgentName.trim(),
      description: newAgentDescription.trim() || "Custom AI Agent",
      systemPrompt: newAgentPrompt.trim(),
      createdAt: new Date(),
      isCustom: true,
    };

    addAgent(newAgent);
    setCurrentAgent(newAgent);
    setShowCreateForm(false);
    setNewAgentName("");
    setNewAgentDescription("");
    setNewAgentPrompt("");
  };

  return (
    <div className="w-full px-3 py-2">
      <div className="relative w-full max-w-3xl mx-auto">
        {/* Current Agent Display */}
        <div
          className="bg-[#1b1b1c] border border-[#282828] rounded-lg p-2 cursor-pointer hover:border-[#f66fde] transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="w-6 h-6 bg-[#f66fde26] border border-[#f66fde] rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-3 h-3 text-[#f66fde]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-white font-medium text-sm truncate">
                  {currentAgent?.name || "Select Agent"}
                </div>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#a2a2a2] transition-transform flex-shrink-0 ml-2 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-1 bg-[#1b1b1c] border border-[#282828] rounded-lg shadow-lg z-50"
          >
            {/* Available Agents */}
            <div className="p-2 max-h-80 overflow-y-auto">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                    currentAgent?.id === agent.id
                      ? "bg-[#f66fde26] border border-[#f66fde]"
                      : "hover:bg-[#282828]"
                  }`}
                  onClick={() => handleAgentSelect(agent)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#f66fde26] border border-[#f66fde] rounded-full flex items-center justify-center flex-shrink-0">
                      <Brain className="w-2.5 h-2.5 text-[#f66fde]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-white font-medium text-sm truncate">
                        {agent.name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Create New Agent */}
            <div className="border-t border-[#282828] p-2">
              <button
                className="w-full p-2 rounded-lg bg-[#f66fde26] border border-[#f66fde] text-[#f66fde] hover:bg-[#f66fde33] transition-colors flex items-center justify-center gap-2"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Create Agent</span>
              </button>
            </div>

            {/* Create Agent Form */}
            {showCreateForm && (
              <div className="border-t border-[#282828] p-3 bg-[#1b1b1c]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium text-sm">Create New Agent</h3>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-[#a2a2a2] hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Agent Name *"
                    className="w-full bg-[#282828] border border-[#454545] rounded px-2 py-2 text-white text-sm focus:outline-none focus:border-[#f66fde]"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                  />

                  <textarea
                    placeholder="System Prompt *"
                    className="w-full h-[300px] bg-[#282828] border border-[#454545] rounded px-2 py-2 text-white text-sm focus:outline-none focus:border-[#f66fde] resize-none"
                    rows={3}
                    value={newAgentPrompt}
                    onChange={(e) => setNewAgentPrompt(e.target.value)}
                  />

                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-[#f66fde] text-white py-2 px-3 rounded text-sm hover:bg-[#e55bc4] transition-colors disabled:opacity-50"
                      onClick={handleCreateAgent}
                      disabled={!newAgentName.trim() || !newAgentPrompt.trim()}
                    >
                      Create
                    </button>
                    <button
                      className="flex-1 bg-[#282828] text-[#a2a2a2] py-2 px-3 rounded text-sm hover:bg-[#333] transition-colors"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}