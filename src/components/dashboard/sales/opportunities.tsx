"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Circle, TrendingUp, Plus, Sparkles } from "lucide-react";
import {
  OPPORTUNITIES,
  OPPORTUNITY_DETAILS,
  PROPOSED_OPPORTUNITIES,
  type Opportunity,
  type OpportunityDetail,
  type OppStage,
  type OppStatus,
  type ProposedOpportunity,
} from "@/lib/sales-data";
import WidgetChat from "@/components/dashboard/widget-chat";
import { Button } from "@/components/ui/button";
import { useConversationLauncher } from "@/components/dashboard/conversation-launcher";
import OpportunityDrawer from "./opportunity-drawer";

const REQ_LABELS = [
  "Account & shipping details",
  "Install Base profile",
  "Scope of Work & tech requirements",
  "Costing & pricing model",
  "Legal T&Cs",
];

// Turn a system proposal into a fresh pipeline opportunity.
function proposalToOpp(p: ProposedOpportunity): Opportunity {
  return {
    id: p.id,
    account: p.account,
    title: p.title,
    value: p.estimatedValue,
    owner: "Unassigned",
    stage: "Discovery",
    status: "on-track",
    requirements: REQ_LABELS.map((label) => ({ label, done: false })),
    recommendedAction: "Qualify budget & scope",
  };
}

function proposalDetail(p: ProposedOpportunity): OpportunityDetail {
  return {
    summary: p.rationale,
    recommendations: [
      "Add to your pipeline to begin qualification",
      "Confirm the budget and decision timeline with the account",
      "Map the assets in scope from the condition data",
    ],
    assets: [],
    related: { customer: p.account, contract: "New opportunity", region: "North America" },
  };
}

function detailFor(opp: Opportunity): OpportunityDetail {
  return (
    OPPORTUNITY_DETAILS[opp.id] ?? {
      summary: `${opp.account} — ${opp.title}. A ${opp.value} opportunity currently at the ${opp.stage} stage.`,
      recommendations: [opp.recommendedAction],
      assets: [],
      related: { customer: opp.account, contract: "New opportunity", region: "North America" },
    }
  );
}

function StageBadge({ stage, status }: { stage: OppStage; status: OppStatus }) {
  const cls =
    status === "stalled" ? "bg-black text-white"
    : status === "at-risk" ? "border border-gray-400 text-gray-700"
    : "border border-gray-300 text-gray-500";
  return <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${cls}`}>{stage}</span>;
}

function ProposedCard({
  p,
  onAdd,
  onReview,
  onDismiss,
}: {
  p: ProposedOpportunity;
  onAdd: () => void;
  onReview: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
          <Sparkles size={16} strokeWidth={1.5} className="text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-base text-gray-900">{p.account}</h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-900 text-white">Proposed</span>
          </div>
          <p className="text-sm text-gray-400">{p.title} · {p.estimatedValue}</p>
          <p className="text-sm text-gray-600 leading-relaxed mt-2">{p.rationale}</p>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {p.signals.map((s) => (
              <span key={s} className="text-[11px] text-gray-500 bg-white border border-gray-100 rounded-full px-2 py-0.5">{s}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button onClick={onAdd} className="rounded-full h-auto px-5 py-2 text-sm cursor-pointer">
              Add to pipeline
            </Button>
            <Button variant="outline" onClick={onReview} className="rounded-full h-auto px-5 py-2 text-sm text-gray-700 cursor-pointer">
              Review
            </Button>
            <Button variant="ghost" onClick={onDismiss} className="rounded-full h-auto px-4 py-2 text-sm text-gray-500 cursor-pointer">
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OppRow({ opp, onOpenDrawer }: { opp: Opportunity; onOpenDrawer: (opp: Opportunity) => void }) {
  const [expanded, setExpanded] = useState(opp.id === "opp-xcel");
  const launch = useConversationLauncher();
  const missing = opp.requirements.filter((r) => !r.done);

  const nameSpan = (
    <span
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onOpenDrawer(opp);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onOpenDrawer(opp);
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
                onClick={() => onOpenDrawer(opp)}
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
  const [pipeline, setPipeline] = useState<Opportunity[]>(OPPORTUNITIES);
  const [proposed, setProposed] = useState<ProposedOpportunity[]>(PROPOSED_OPPORTUNITIES);
  const [drawer, setDrawer] = useState<{ opp: Opportunity; detail: OpportunityDetail } | null>(null);
  const launch = useConversationLauncher();

  const openDrawer = (opp: Opportunity) => setDrawer({ opp, detail: detailFor(opp) });

  const addProposal = (p: ProposedOpportunity) => {
    setPipeline((pl) => [proposalToOpp(p), ...pl]);
    setProposed((pr) => pr.filter((x) => x.id !== p.id));
  };
  const reviewProposal = (p: ProposedOpportunity) => setDrawer({ opp: proposalToOpp(p), detail: proposalDetail(p) });
  const dismissProposal = (id: string) => setProposed((pr) => pr.filter((x) => x.id !== id));

  const filtered = pipeline.filter((o) => {
    const matchPriority = priority === "all" || o.status === priority;
    const matchStage = stage === "all" || o.stage === stage;
    return matchPriority && matchStage;
  });

  const countFor = (p: OppStatus | "all", s: OppStage | "all") =>
    pipeline.filter((o) => (p === "all" || o.status === p) && (s === "all" || o.stage === s)).length;

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <OpportunityDrawer opp={drawer?.opp ?? null} detail={drawer?.detail ?? null} onClose={() => setDrawer(null)} />
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
        {/* Proposed for you — system-generated opportunities to review */}
        {proposed.length > 0 && (
          <>
            <div className="flex items-center gap-2 px-1">
              <Sparkles size={13} strokeWidth={1.5} className="text-gray-400" />
              <p className="text-xs text-gray-500 uppercase tracking-wider">Proposed for you · {proposed.length}</p>
            </div>
            {proposed.map((p) => (
              <ProposedCard
                key={p.id}
                p={p}
                onAdd={() => addProposal(p)}
                onReview={() => reviewProposal(p)}
                onDismiss={() => dismissProposal(p.id)}
              />
            ))}
            <div className="flex items-center gap-3 px-1 py-1">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Your pipeline</span>
              <hr className="flex-1 border-gray-100" />
            </div>
          </>
        )}

        {filtered.length > 0 ? (
          filtered.map((o) => <OppRow key={o.id} opp={o} onOpenDrawer={openDrawer} />)
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
