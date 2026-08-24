"use client";

import { useState, useEffect, useRef } from "react";
import {
  Calendar, Key, ShoppingCart, Heart, BarChart2, FileText,
  Library, ArrowUp, UserRoundPlus, X,
} from "lucide-react";
import ContextPanel from "./context-panel";
import DocPanel from "./doc-panel";
import { ChatThread, type ChatMsg } from "./chat-panel";
import { answerQuery, detectCustomer } from "@/lib/knowledge-base";

const SUGGESTIONS = [
  { icon: Calendar, label: "Create a new mobilization plan" },
  { icon: Key, label: "Mobilize Xcel Next" },
  { icon: ShoppingCart, label: "Order a part?" },
  { icon: Heart, label: "Evaluate asset risk/health" },
  { icon: BarChart2, label: "Create an impact report" },
  { icon: FileText, label: "Create an invoice" },
];

const DEFAULT_PROMPT = "Create a mobilization plan for Xcel Energy";

interface Props {
  visible: boolean;
  onClose: () => void;
  /** When launched from a widget: the widget's name, shown as context. */
  context?: string;
  /** When launched from a widget: the user's typed prompt to seed the chat. */
  initialPrompt?: string;
}

export default function ConversationOverlay({ visible, onClose, context, initialPrompt }: Props) {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [typing, setTyping] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [docVisible, setDocVisible] = useState(false);
  const [input, setInput] = useState("");
  const [activeContext, setActiveContext] = useState<string | undefined>(undefined);
  const [detectedCustomer, setDetectedCustomer] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const idRef = useRef(0);
  const nextId = () => ++idRef.current;

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const push = (msg: Omit<ChatMsg, "id">) => setMessages((m) => [...m, { id: nextId(), ...msg }]);

  // Generate the assistant's reply — mobilization prompts open the wizard,
  // everything else is answered from the knowledge base.
  const respond = (text: string, ctx?: string) => {
    setTyping(true);
    clearTimers();
    const isMob = /mobili[sz]|mobilization plan|mobilisation plan/.test(text.toLowerCase());
    if (isMob) {
      timers.current.push(
        setTimeout(() => push({ role: "ai", kind: "text", text: "Of course — let's confirm a few details and I'll draft the plan." }), 1000)
      );
      timers.current.push(
        setTimeout(() => {
          setTyping(false);
          push({ role: "ai", kind: "wizard" });
        }, 2100)
      );
    } else {
      timers.current.push(
        setTimeout(() => {
          setTyping(false);
          push({ role: "ai", kind: "text", text: answerQuery(text, ctx) });
        }, 1000)
      );
    }
  };

  const send = (text: string, ctx?: string) => {
    const t = text.trim();
    if (!t) return;
    setStarted(true);
    setInput("");
    push({ role: "user", text: t });
    // Tie the conversation to a customer once one is mentioned
    const who = detectCustomer(t);
    if (who) setDetectedCustomer((prev) => prev ?? who);
    respond(t, ctx ?? activeContext);
  };

  // Reset the whole overlay whenever it is dismissed
  useEffect(() => {
    if (!visible) {
      clearTimers();
      setStarted(false);
      setMessages([]);
      setTyping(false);
      setWizardStep(1);
      setDocVisible(false);
      setInput("");
      setActiveContext(undefined);
      setDetectedCustomer(null);
      idRef.current = 0;
    }
  }, [visible]);

  // When launched from a widget, skip the welcome screen and start immediately
  // with the widget context pinned to the top of the conversation.
  useEffect(() => {
    if (visible && context && !started) {
      setActiveContext(context);
      send((initialPrompt || "").trim() || `Tell me about ${context}`, context);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, context, initialPrompt]);

  useEffect(() => clearTimers, []);

  // Keep pinned to the newest content as the conversation streams in
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing, started]);

  const handleSend = () => {
    const t = input.trim();
    if (!t && !started) send(DEFAULT_PROMPT);
    else if (t) send(t);
  };

  // Widget-launched chats (activeContext set) hide the context panel until a
  // customer is identified. Mobilization chats show it as soon as they start.
  const showPanel = started && (activeContext ? !!detectedCustomer : true);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`fixed inset-0 p-4 z-50 flex transition-opacity duration-300 ${
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{
        background: started ? "rgba(243,244,246,0.7)" : "rgba(243,244,246,0.8)",
        backdropFilter: started ? "blur(16px)" : "blur(16px)",
        WebkitBackdropFilter: started ? "blur(16px)" : "blur(16px)",
        transition: "background 500ms ease, backdrop-filter 500ms ease, opacity 300ms ease",
      }}
    >
      {/* Backdrop click closes only before a conversation has started */}
      {!started && <div className="absolute inset-0" onClick={onClose} />}

      {/* Left — customer context. For widget-launched chats it stays hidden
          until the conversation is tied to a specific customer. */}
      <div
        className={`relative z-10 rounded-lg shrink-0 overflow-hidden transition-[width] duration-500 ease-in-out ${
          showPanel ? "w-[420px]" : "w-0"
        }`}
      >
        <div
          className={`w-[420px] h-full transition-transform duration-500 ease-in-out ${
            showPanel ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <ContextPanel customer={detectedCustomer ?? "Xcel Energy"} />
        </div>
      </div>

      {/* Right — welcome → conversation (prompt box is the fixed anchor) */}
      <div className="relative z-10 flex-1 min-w-0 flex flex-col">
        {/* Header — fades in once started */}
        <div
          className={`shrink-0 transition-all duration-500 ${
            started ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"
          }`}
        >
          <div className="max-w-[640px] mx-auto w-full px-4 flex items-center justify-between pt-7 pb-5">
            <h2 className="text-xl text-gray-900">{activeContext ?? "Xcel Energy Mobilization Plan"}</h2>
            <div className="flex items-center gap-1">
              <button className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-black/5 transition-colors cursor-pointer">
                <UserRoundPlus size={17} strokeWidth={1.5} />
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-black/5 transition-colors cursor-pointer"
              >
                <X size={17} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Content area above the prompt */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar scroll-smooth flex flex-col">
          <div className={`max-w-[640px] mx-auto w-full px-4 ${started ? "" : "flex-1 flex flex-col items-center justify-center"}`}>
            {!started ? (
              /* Welcome */
              <div className="w-full animate-message-in">
                <h1 className="font-patrick-hand text-3xl text-gray-900 text-center mb-10">
                  Create A New Conversation
                </h1>
                <div className="grid grid-cols-3 gap-3">
                  {SUGGESTIONS.map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      onClick={() => send(label)}
                      className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <Icon size={16} strokeWidth={1.5} className="text-gray-400 mb-2 group-hover:text-gray-700" />
                      <p className="text-sm text-gray-600 leading-snug">{label}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Conversation */
              <ChatThread
                messages={messages}
                typing={typing}
                context={activeContext}
                wizardStep={wizardStep}
                onWizardStep={setWizardStep}
                onGenerate={() => setDocVisible(true)}
              />
            )}
          </div>
        </div>

        {/* Persistent prompt box — the anchor that never swaps out */}
        <div className="shrink-0 pb-6 pt-2">
          <div className="max-w-[640px] mx-auto w-full px-4">
            <div className="bg-white border border-gray-200 rounded-2xl flex items-center gap-3 px-4 py-3 shadow-sm">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={started ? "Message..." : DEFAULT_PROMPT}
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                autoFocus
              />
              <Library size={16} strokeWidth={1.5} className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors shrink-0" />
              <button
                onClick={handleSend}
                className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
              >
                <ArrowUp size={14} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document panel — pushes in from the right, mirroring the context panel */}
      <div
        className={`relative z-10 shrink-0 overflow-hidden transition-[width] duration-500 ease-in-out ${
          docVisible ? "w-[460px]" : "w-0"
        }`}
      >
        <div
          className={`w-[460px] h-full transition-transform duration-500 ease-in-out ${
            docVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <DocPanel onClose={() => setDocVisible(false)} />
        </div>
      </div>
    </div>
  );
}
