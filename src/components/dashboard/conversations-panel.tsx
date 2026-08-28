"use client";

import { SlidersVertical, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StoredConversation } from "@/components/conversation/chat-panel";

interface Props {
  conversations: StoredConversation[];
  onNewConversation?: () => void;
  onSelect?: (conversation: StoredConversation) => void;
}

export default function ConversationsPanel({ conversations, onNewConversation, onSelect }: Props) {
  return (
    <div className="h-full bg-zinc-900 rounded-xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 shrink-0">
        <h2 className="text-white text-lg mb-4">Conversations</h2>

        {/* Search bar */}
        <div className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2">
          <input
            type="text"
            placeholder="Search conversations..."
            className="flex-1 bg-transparent text-sm text-zinc-300 placeholder-zinc-500 outline-none"
          />
          <SlidersVertical size={14} strokeWidth={1.5} className="text-zinc-500 shrink-0" />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-3 flex flex-col gap-2 pb-2">
        {conversations.length > 0 ? (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect?.(conv)}
              className="w-full text-left px-3 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-sm text-white leading-snug line-clamp-1">{conv.title}</span>
                <span className="text-xs text-zinc-500 shrink-0 mt-0.5">{conv.date}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{conv.preview}</p>
            </button>
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-10">
            <div className="w-11 h-11 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
              <MessageSquarePlus size={18} strokeWidth={1.5} className="text-zinc-400" />
            </div>
            <p className="text-sm text-zinc-300">No conversations yet</p>
            <p className="text-xs text-zinc-500 leading-relaxed mt-1">
              Start a new conversation, or open one from any widget to see it here.
            </p>
          </div>
        )}
      </div>

      {/* New Conversation button */}
      <div className="p-4 shrink-0">
        <Button
          onClick={onNewConversation}
          className="w-full rounded-full h-auto py-3 text-sm bg-white text-black hover:bg-zinc-100 cursor-pointer"
        >
          New Conversation
        </Button>
      </div>
    </div>
  );
}
