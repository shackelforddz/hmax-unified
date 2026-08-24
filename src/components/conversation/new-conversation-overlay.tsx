"use client";

import { useState } from "react";
import { Calendar, Key, ShoppingCart, Heart, BarChart2, FileText, ArrowUp } from "lucide-react";

const SUGGESTIONS = [
  { icon: Calendar, label: "Create a new mobilization plan" },
  { icon: Key, label: "Mobilize Xcel Next" },
  { icon: ShoppingCart, label: "Order a part?" },
  { icon: Heart, label: "Evaluate asset risk/health" },
  { icon: BarChart2, label: "Create an impact report" },
  { icon: FileText, label: "Create an invoice" },
];

interface Props {
  visible: boolean;
  onSubmit: (prompt: string) => void;
  onClose: () => void;
}

export default function NewConversationOverlay({ visible, onSubmit, onClose }: Props) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    const text = prompt.trim() || "Create a mobilization plan for Xcel Energy";
    onSubmit(text);
    setPrompt("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={`fixed inset-0 m-8 z-50 flex flex-col items-center justify-center transition-opacity duration-300 ${
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{ background: "#F3F4F6" }}
    >
      {/* Dismiss on backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl px-6">
        <h1 className="font-patrick-hand text-3xl text-gray-900 mb-10">Create A New Conversation</h1>

        {/* Suggestion grid */}
        <div className="grid grid-cols-3 gap-3 w-full mb-16">
          {SUGGESTIONS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => onSubmit(label)}
              className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <Icon size={16} strokeWidth={1.5} className="text-gray-400 mb-2 group-hover:text-gray-700" />
              <p className="text-sm text-gray-600 leading-snug">{label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt input — pinned to bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-10">
        <div className="bg-white border border-gray-200 rounded-2xl flex items-center gap-2 px-4 py-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Create a mobilization plan for Xcel Energy"
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            autoFocus
          />
          <button
            onClick={handleSubmit}
            className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
          >
            <ArrowUp size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
