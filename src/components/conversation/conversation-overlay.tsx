"use client";

import { useState, useEffect, useRef } from "react";
import {
  Calendar, Key, ShoppingCart, Heart, BarChart2, FileText,
  Library, ArrowUp, UserRoundPlus, X,
} from "lucide-react";
import ContextPanel from "./context-panel";
import DocPanel from "./doc-panel";
import { ChatThread, type ChatMsg, type StoredConversation } from "./chat-panel";
import { answerQuery, detectCustomer, suggestNext, visualFor } from "@/lib/knowledge-base";
import { Button } from "@/components/ui/button";

const SUGGESTIONS = [
  { icon: Calendar, label: "Create a new mobilization plan" },
  { icon: Key, label: "Mobilize Xcel Next" },
  { icon: ShoppingCart, label: "Order a part?" },
  { icon: Heart, label: "Evaluate asset risk/health" },
  { icon: BarChart2, label: "Create an impact report" },
  { icon: FileText, label: "Create an invoice" },
];

const DEFAULT_PROMPT = "Create a mobilization plan for Xcel Energy";

// Quick-start prompts shown above the input on the welcome screen.
const WELCOME_STARTERS = [
  "What needs my attention today?",
  "Show the portfolio overview",
  "Which contracts are at risk?",
  "Why is on-time delivery falling?",
  "What's driving revenue at risk?",
  "Show vendor concentration",
];

interface Props {
  visible: boolean;
  onClose: () => void;
  /** When launched from a widget: the widget's name, shown as context. */
  context?: string;
  /** When launched from a widget: the user's typed prompt to seed the chat. */
  initialPrompt?: string;
  /** When reopening from the list: the stored conversation to restore. */
  restore?: StoredConversation | null;
  /** Called as the conversation is created/updated so it can be saved to the list. */
  onPersist?: (record: StoredConversation) => void;
}

export default function ConversationOverlay({ visible, onClose, context, initialPrompt, restore, onPersist }: Props) {
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
  const sessionIdRef = useRef<string | null>(null);
  const onPersistRef = useRef(onPersist);
  onPersistRef.current = onPersist;

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const push = (msg: Omit<ChatMsg, "id">) => setMessages((m) => [...m, { id: nextId(), ...msg }]);

  // Generate the assistant's reply — mobilization / opportunity prompts open a
  // guided wizard, everything else is answered from the knowledge base.
  const respond = (text: string, ctx?: string) => {
    setTyping(true);
    clearTimers();
    const q = text.toLowerCase();
    const isMob = /mobili[sz]|mobilization plan|mobilisation plan/.test(q);
    const isOpp = /opportunit/.test(q) && /(build|create|new|start|open)/.test(q);
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
    } else if (isOpp) {
      setWizardStep(1);
      timers.current.push(
        setTimeout(() => push({ role: "ai", kind: "text", text: "Let's build a new opportunity — I'll walk you through it and pre-fill what I can." }), 1000)
      );
      timers.current.push(
        setTimeout(() => {
          setTyping(false);
          push({ role: "ai", kind: "opp-wizard" });
        }, 2100)
      );
    } else {
      timers.current.push(
        setTimeout(() => {
          setTyping(false);
          push({ role: "ai", kind: "text", text: answerQuery(text, ctx), suggestions: suggestNext(text, ctx), visual: visualFor(text, ctx) ?? undefined });
        }, 1000)
      );
    }
  };

  const send = (text: string, ctx?: string) => {
    const t = text.trim();
    if (!t) return;
    if (!sessionIdRef.current) sessionIdRef.current = `conv-${Date.now()}`;
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
      sessionIdRef.current = null;
    }
  }, [visible]);

  // Reopen a saved conversation from the list.
  useEffect(() => {
    if (visible && restore && !started) {
      sessionIdRef.current = restore.id;
      setActiveContext(restore.context);
      setDetectedCustomer(restore.detectedCustomer ?? null);
      if (restore.messages.length > 0) {
        // Restore the existing thread
        idRef.current = restore.messages.reduce((m, x) => Math.max(m, x.id), 0);
        setMessages(restore.messages);
        setStarted(true);
      } else {
        // Seed conversation with no thread yet — run its prompt fresh
        send(restore.seedPrompt || restore.title, restore.context);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, restore]);

  // When launched from a widget, skip the welcome screen and start immediately
  // with the widget context pinned to the top of the conversation.
  useEffect(() => {
    if (visible && context && !restore && !started) {
      setActiveContext(context);
      send((initialPrompt || "").trim() || `Tell me about ${context}`, context);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, context, initialPrompt]);

  // Persist the conversation to the list as it's created and updated.
  useEffect(() => {
    if (!started || !sessionIdRef.current || messages.length === 0) return;
    const firstUser = messages.find((m) => m.role === "user")?.text ?? "";
    const last = messages[messages.length - 1];
    const title = activeContext || firstUser || "Conversation";
    const preview = last.kind === "wizard" ? "Guided plan in progress…" : (last.text ?? firstUser);
    onPersistRef.current?.({
      id: sessionIdRef.current,
      title,
      preview,
      date: "Now",
      context: activeContext,
      detectedCustomer,
      messages,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, started, activeContext, detectedCustomer]);

  useEffect(() => clearTimers, []);

  // Close the overlay on Escape
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, onClose]);

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

  // Final step of the opportunity wizard — confirm creation.
  const oppCreate = () => {
    setTyping(true);
    clearTimers();
    timers.current.push(
      setTimeout(() => {
        setTyping(false);
        push({
          role: "ai",
          kind: "text",
          text:
            "✓ Opportunity created and added to your pipeline.\n\nDuke Energy — Fleet reliability program is now in Discovery ($5.4M, Premium). Next steps: qualify the budget and capture the account & shipping details to move it toward Scoping.",
          suggestions: {
            prompts: ["What's needed to reach the Offer stage?", "Show the Duke Energy fleet", "Draft a qualification plan"],
            actions: [
              { label: "Capture account details", prompt: "Capture account and shipping details for Duke Energy" },
              { label: "Assign owner", prompt: "Assign an owner to the Duke Energy opportunity" },
            ],
          },
        });
      }, 1000)
    );
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

      {/* Close button — the header X only exists once a conversation starts */}
      {!started && (
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-6 right-6 z-20 w-9 h-9 rounded-full bg-white/70 backdrop-blur flex items-center justify-center text-gray-500 hover:bg-white transition-colors cursor-pointer"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      )}

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
                aria-label="Close conversation"
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
                onOppCreate={oppCreate}
                onSend={(t) => send(t)}
              />
            )}
          </div>
        </div>

        {/* Persistent prompt box — the anchor that never swaps out */}
        <div className="shrink-0 pb-6 pt-2">
          {/* Suggested starter prompts (welcome screen only) */}
          {!started && (
            <div className="max-w-[640px] mx-auto w-full px-4 mb-2">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {WELCOME_STARTERS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="shrink-0 whitespace-nowrap text-xs text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
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
              <Button onClick={handleSend} className="rounded-full size-8 p-0 shrink-0 cursor-pointer">
                <ArrowUp size={14} strokeWidth={2} />
              </Button>
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
