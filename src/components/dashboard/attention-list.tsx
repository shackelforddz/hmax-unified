"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import WidgetChat from "./widget-chat";
import {
  ATTENTION_ITEMS,
  type AttentionItem,
  type AttentionStatus,
  type AttentionCategory,
} from "@/lib/dashboard-data";
import AttentionDrawer from "./attention-drawer";
import { useConversationLauncher } from "./conversation-launcher";
import { Button } from "@/components/ui/button";

function StatusBadge({ status }: { status: AttentionStatus }) {
  if (status === "critical") {
    return (
      <span className="bg-black text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
        Critical
      </span>
    );
  }
  if (status === "at-risk") {
    return (
      <span className="border border-gray-400 text-gray-700 text-xs px-3 py-1 rounded-full whitespace-nowrap">
        At Risk
      </span>
    );
  }
  return (
    <span className="border border-gray-300 text-gray-500 text-xs px-3 py-1 rounded-full whitespace-nowrap">
      Healthy
    </span>
  );
}

function AttentionRow({ item, onOpenDrawer }: { item: AttentionItem; onOpenDrawer: (id: string) => void }) {
  const [expanded, setExpanded] = useState(item.id === "xcel-energy");
  const launch = useConversationLauncher();

  // Healthy customers have no issues to work — no accordion.
  const needsAttention = item.status !== "healthy" && !!item.flags?.length;

  const header = (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h4 className="text-base text-gray-900 mb-1.5">
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDrawer(item.id);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onOpenDrawer(item.id);
              }
            }}
            className="underline underline-offset-2 decoration-gray-300 hover:decoration-gray-700 cursor-pointer transition-colors"
          >
            {item.customer}
          </span>
        </h4>
        <p className="text-sm text-gray-400">{item.meta}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0 pt-0.5">
        <StatusBadge status={item.status} />
        {needsAttention &&
          (expanded ? (
            <ChevronUp size={16} strokeWidth={1.5} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} strokeWidth={1.5} className="text-gray-400" />
          ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Header — a toggle only for customers that need attention */}
      {needsAttention ? (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left px-6 py-5 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {header}
        </button>
      ) : (
        <div className="px-6 py-5">{header}</div>
      )}

      {/* Expanded flags */}
      {needsAttention && expanded && item.flags && (
        <>
          <hr className="border-gray-200" />
          <div className="px-6 py-5 flex flex-col gap-6">
            {item.flags.map((flag, i) => (
              <div key={i} className="flex gap-4">
                {/* Flag icon */}
                <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm text-gray-500 shrink-0 font-mono leading-none">
                  !
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 mb-2 leading-snug">{flag.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{flag.detail}</p>
                  <div className="flex flex-wrap gap-2">
                    {/* Recommended action — primary CTA */}
                    <Button
                      onClick={() => launch({ context: item.customer, prompt: flag.action, entity: { kind: "customer", name: item.customer } })}
                      className="rounded-full h-auto px-5 py-2 text-sm cursor-pointer"
                    >
                      {flag.action}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => launch({ context: item.customer, prompt: flag.title, entity: { kind: "customer", name: item.customer } })}
                      className="rounded-full h-auto px-5 py-2 text-sm text-gray-700 cursor-pointer"
                    >
                      Start A Conversation
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onOpenDrawer(item.id)}
                      className="rounded-full h-auto px-5 py-2 text-sm text-gray-700 cursor-pointer"
                    >
                      See Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const PRIORITY_OPTIONS: { label: string; value: AttentionStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "At Risk", value: "at-risk" },
];

const CATEGORY_OPTIONS: { label: string; value: AttentionCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Progress", value: "progress" },
  { label: "Budget & invoicing", value: "budget-invoicing" },
  { label: "Site & access", value: "site-access" },
  { label: "Scope & variations", value: "scope-variations" },
];

export default function AttentionList() {
  const [statusFilter, setStatusFilter] = useState<AttentionStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<AttentionCategory | "all">("all");
  const [drawerId, setDrawerId] = useState<string | null>(null);

  const filtered = ATTENTION_ITEMS.filter((item) => {
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    const matchCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchStatus && matchCategory;
  });

  const countFor = (s: AttentionStatus | "all", c: AttentionCategory | "all") =>
    ATTENTION_ITEMS.filter(
      (i) => (s === "all" || i.status === s) && (c === "all" || i.category === c)
    ).length;

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <AttentionDrawer itemId={drawerId} onClose={() => setDrawerId(null)} />
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base text-gray-900">Customers assigned to you</h3>
            <p className="text-sm text-gray-400 mt-0.5">{filtered.length} need your attention</p>
          </div>
          <WidgetChat title="Assigned to you" />
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400">Priority</span>
          {PRIORITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
                statusFilter === opt.value
                  ? "bg-black text-white"
                  : "border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {opt.label} {countFor(opt.value, categoryFilter)}
            </button>
          ))}

          <span className="text-gray-200 text-xs mx-1">|</span>

          <span className="text-xs text-gray-400">Category</span>
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCategoryFilter(opt.value)}
              className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
                categoryFilter === opt.value
                  ? "bg-black text-white"
                  : "border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {opt.label} {countFor(statusFilter, opt.value)}
            </button>
          ))}
        </div>
      </div>

      {/* Card list */}
      <div className="p-4 flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((item) => <AttentionRow key={item.id} item={item} onOpenDrawer={setDrawerId} />)
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">
            No items match the selected filters.
          </p>
        )}
      </div>
    </div>
  );
}
