"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Circle, TrendingUp, Plus } from "lucide-react";
import { OPPORTUNITIES, type Opportunity, type OppStage, type OppStatus } from "@/lib/sales-data";
import WidgetChat from "@/components/dashboard/widget-chat";
import { Button } from "@/components/ui/button";
import { useConversationLauncher } from "@/components/dashboard/conversation-launcher";
import OpportunityDrawer from "./opportunity-drawer";

function StageBadge({ stage, status }: { stage: OppStage; status: OppStatus }) {
  const cls =
    status === "stalled" ? "bg-black text-white"
    : status === "at-risk" ? "border border-gray-400 text-gray-700"
    : "border border-gray-300 text-gray-500";
  return <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${cls}`}>{stage}</span>;
}

function OppRow({ opp, onOpenDrawer }: { opp: Opportunity; onOpenDrawer: (id: string) => void }) {
  const [expanded, setExpanded] = useState(opp.id === "opp-xcel");
  const launch = useConversationLauncher();
  const missing = opp.requirements.filter((r) => !r.done);

  const nameSpan = (
    <span
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onOpenDrawer(opp.id);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onOpenDrawer(opp.id);
        }
      }}
      className="underline underline-offset-2 decoration-gray-300 hover:decoration-gray-700 cursor-pointer transition-colors"
    >
      {opp.account}
    </span>
  );

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-left px-6 py-5 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <TrendingUp size={16} strokeWidth={1.5} className="text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base text-gray-900 mb-1">{nameSpan}</h4>
            <p className="text-sm text-gray-400 truncate">
              {opp.title} · {opp.value} · {opp.owner}
              {missing.length > 0 && <span className="text-gray-500"> · {missing.length} to offer</span>}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <StageBadge stage={opp.stage} status={opp.status} />
            {expanded ? (
              <ChevronUp size={16} strokeWidth={1.5} className="text-gray-400" />
            ) : (
              <ChevronDown size={16} strokeWidth={1.5} className="text-gray-400" />
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <>
          <hr className="border-gray-200" />
          <div className="px-6 py-5">
            {missing.length > 0 ? (
              <>
                <p className="text-sm text-gray-900 mb-3">Needs your attention to reach the Offer stage</p>
                <div className="flex flex-col gap-2 mb-4">
                  {missing.map((m) => (
                    <div key={m.label} className="flex items-center gap-2.5">
                      <Circle size={14} className="text-gray-300 shrink-0" />
                      <span className="text-sm text-gray-600">{m.label}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-600 mb-4">
                All information is in place — this opportunity is ready to build the offer.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {/* Recommended action — primary CTA */}
              <Button
                onClick={() => launch({ context: opp.account, prompt: opp.recommendedAction })}
                className="rounded-full h-auto px-5 py-2 text-sm cursor-pointer"
              >
                {opp.recommendedAction}
              </Button>
              <Button
                variant="outline"
                onClick={() => launch({ context: opp.account, prompt: `Where is the ${opp.account} opportunity and what's missing?` })}
                className="rounded-full h-auto px-5 py-2 text-sm text-gray-700 cursor-pointer"
              >
                Start A Conversation
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenDrawer(opp.id)}
                className="rounded-full h-auto px-5 py-2 text-sm text-gray-700 cursor-pointer"
              >
                See Details
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const PRIORITY_OPTIONS: { label: string; value: OppStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "On track", value: "on-track" },
  { label: "At risk", value: "at-risk" },
  { label: "Stalled", value: "stalled" },
];
const STAGE_OPTIONS: { label: string; value: OppStage | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Discovery", value: "Discovery" },
  { label: "Qualified", value: "Qualified" },
  { label: "Scoping", value: "Scoping" },
  { label: "Offer", value: "Offer" },
  { label: "Negotiation", value: "Negotiation" },
];

export default function Opportunities() {
  const [priority, setPriority] = useState<OppStatus | "all">("all");
  const [stage, setStage] = useState<OppStage | "all">("all");
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const launch = useConversationLauncher();

  const filtered = OPPORTUNITIES.filter((o) => {
    const matchPriority = priority === "all" || o.status === priority;
    const matchStage = stage === "all" || o.stage === stage;
    return matchPriority && matchStage;
  });

  const countFor = (p: OppStatus | "all", s: OppStage | "all") =>
    OPPORTUNITIES.filter((o) => (p === "all" || o.status === p) && (s === "all" || o.stage === s)).length;

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <OpportunityDrawer oppId={drawerId} onClose={() => setDrawerId(null)} />
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base text-gray-900">Opportunities</h3>
            <p className="text-sm text-gray-400 mt-0.5">{filtered.length} in your pipeline</p>
          </div>
          <WidgetChat title="Opportunities" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400">Priority</span>
          {PRIORITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPriority(opt.value)}
              className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
                priority === opt.value ? "bg-black text-white" : "border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {opt.label} {countFor(opt.value, stage)}
            </button>
          ))}
          <span className="text-gray-200 text-xs mx-1">|</span>
          <span className="text-xs text-gray-400">Stage</span>
          {STAGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStage(opt.value)}
              className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
                stage === opt.value ? "bg-black text-white" : "border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {opt.label} {countFor(priority, opt.value)}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="p-4 flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((o) => <OppRow key={o.id} opp={o} onOpenDrawer={setDrawerId} />)
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">No opportunities match the selected filters.</p>
        )}

        {/* Build a new opportunity — opens a guided conversation */}
        <button
          onClick={() => launch({ context: "New opportunity", prompt: "Build a new opportunity" })}
          className="flex items-center justify-center gap-2 border border-dashed border-gray-200 rounded-2xl py-4 text-sm text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Plus size={16} strokeWidth={1.5} />
          Build a new opportunity
        </button>
      </div>
    </div>
  );
}
