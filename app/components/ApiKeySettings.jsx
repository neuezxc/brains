"use client";
import { useState } from "react";
import { Settings, Eye, EyeOff, Check, AlertCircle, Settings2 } from "lucide-react";
import useChatStore from "../stores/useChatStore";

export default function ApiKeySettings() {
  const { apiKey, setApiKey } = useChatStore();
  const [showKey, setShowKey] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [showSettings, setShowSettings] = useState(false);

  const handleSave = () => {
    setApiKey(tempKey);
    setShowSettings(false);
  };

  const handleCancel = () => {
    setTempKey(apiKey);
    setShowSettings(false);
  };

  const isValidKey = tempKey.startsWith("sk-or-v1-") && tempKey.length > 20;

  return (
    <div className="relative">
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="box-border bg-[#4545454d] border-[0.5px] border-[#454545] rounded-lg w-8 h-8 flex items-center justify-center shrink-0 hover:bg-[#45454566] transition-colors"
        title="API Settings"
      >
        <Settings2 className="w-4 h-4 text-[#9F9F9F]" strokeWidth={1.5} />
      </button>

      {showSettings && (
        <div className="absolute bottom-full right-0 mb-2 w-72 bg-[#1b1b1c] border border-[#282828] rounded-lg shadow-lg z-50 p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium text-sm">API Key</h3>
              {apiKey && (
                <div className="flex items-center gap-1 text-green-400 text-xs">
                  <Check className="w-3 h-3" />
                  Connected
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[#a2a2a2] text-sm">API Key</label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full bg-[#282828] border border-[#454545] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f66fde] pr-10"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#a2a2a2] hover:text-white"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {!isValidKey && tempKey && (
                <div className="flex items-center gap-1 text-yellow-400 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  API key should start with "sk-or-v1-"
                </div>
              )}

              <div className="text-[#a2a2a2] text-xs">
                Get your API key from{" "}
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#f66fde] hover:underline"
                >
                  openrouter.ai
                </a>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                disabled={!tempKey.trim()}
                className="flex-1 bg-[#f66fde] text-white py-2 px-3 rounded-lg text-sm hover:bg-[#e55bc4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-[#282828] text-[#a2a2a2] py-2 px-3 rounded-lg text-sm hover:bg-[#333] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}