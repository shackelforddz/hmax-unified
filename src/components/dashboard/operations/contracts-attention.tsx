"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { OPS_CONTRACTS, type OpsContract, type OpsStatus, type RiskProfile } from "@/lib/operations-data";
import WidgetChat from "@/components/dashboard/widget-chat";
import { Button } from "@/components/ui/button";
import { useConversationLauncher } from "@/components/dashboard/conversation-launcher";
import ContractDrawer from "./contract-drawer";

function StatusBadge({ status }: { status: OpsStatus }) {
  if (status === "critical") {
    return <span className="bg-black text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">Critical</span>;
  }
  return <span className="border border-gray-400 text-gray-700 text-xs px-3 py-1 rounded-full whitespace-nowrap">At Risk</span>;
}

const RISK_CLS: Record<string, string> = {
  high: "bg-gray-900 text-white",
  med: "bg-gray-200 text-gray-700",
  low: "border border-gray-200 text-gray-400",
};
const RISK_LABEL: Record<string, string> = { high: "High", med: "Med", low: "Low" };

function RiskChips({ risk }: { risk: RiskProfile }) {
  const items: [string, keyof RiskProfile][] = [
    ["Schedule", "schedule"],
    ["Cost", "cost"],
    ["Quality", "quality"],
    ["Safety", "safety"],
  ];
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(([label, key]) => (
        <span key={key} className="inline-flex items-center gap-1.5 text-xs">
          <span className="text-gray-400">{label}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${RISK_CLS[risk[key]]}`}>{RISK_LABEL[risk[key]]}</span>
        </span>
      ))}
    </div>
  );
}

function ContractRow({ contract, onOpenDrawer }: { contract: OpsContract; onOpenDrawer: (id: string) => void }) {
  const [expanded, setExpanded] = useState(contract.id === "ct-sherco");
  const launch = useConversationLauncher();
  const behind = contract.baseline - contract.progress;

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button onClick={() => setExpanded((e) => !e)} className="w-full text-left px-6 py-5 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <h4 className="text-base text-gray-900 mb-1">
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); onOpenDrawer(contract.id); }}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); onOpenDrawer(contract.id); } }}
                className="underline underline-offset-2 decoration-gray-300 hover:decoration-gray-700 cursor-pointer transition-colors"
              >
                {contract.name}
              </span>
            </h4>
            <p className="text-sm text-gray-400">{contract.customer} · {contract.owner} · {contract.value}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0 pt-0.5">
            <StatusBadge status={contract.status} />
            {expanded ? <ChevronUp size={16} strokeWidth={1.5} className="text-gray-400" /> : <ChevronDown size={16} strokeWidth={1.5} className="text-gray-400" />}
          </div>
        </div>

        {/* Progress bar (baseline vs actual) */}
        <div className="flex items-center gap-3 mb-2.5">
          <div className="relative flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gray-900 rounded-full" style={{ width: `${contract.progress}%` }} />
            <div className="absolute top-0 bottom-0 w-0.5 bg-gray-400" style={{ left: `${contract.baseline}%` }} />
          </div>
          <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">
            {contract.progress}%{behind > 0 ? ` · ${behind}pts behind` : ""}
          </span>
        </div>

        {/* Risk profile */}
        <RiskChips risk={contract.risk} />
      </button>

      {expanded && contract.flags.length > 0 && (
        <>
          <hr className="border-gray-200" />
          <div className="px-6 py-5 flex flex-col gap-6">
            {contract.flags.map((flag, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm text-gray-500 shrink-0 font-mono leading-none">!</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 mb-2 leading-snug">{flag.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{flag.detail}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => launch({ context: contract.customer, prompt: flag.action, entity: { kind: "contract", id: contract.id } })} className="rounded-full h-auto px-5 py-2 text-sm cursor-pointer">
                      {flag.action}
                    </Button>
                    <Button variant="outline" onClick={() => launch({ context: contract.customer, prompt: flag.title, entity: { kind: "contract", id: contract.id } })} className="rounded-full h-auto px-5 py-2 text-sm text-gray-700 cursor-pointer">
                      Start A Conversation
                    </Button>
                    <Button variant="outline" onClick={() => onOpenDrawer(contract.id)} className="rounded-full h-auto px-5 py-2 text-sm text-gray-700 cursor-pointer">
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

const PRIORITY_OPTIONS: { label: string; value: OpsStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "At Risk", value: "at-risk" },
];

type SortBy = "priority" | "progress" | "risk";
const SORT_OPTIONS: { label: string; value: SortBy }[] = [
  { label: "Priority", value: "priority" },
  { label: "Progress", value: "progress" },
  { label: "Risk", value: "risk" },
];

const LEVEL_SCORE: Record<string, number> = { high: 3, med: 2, low: 1 };
function riskScore(c: OpsContract): number {
  const profile = LEVEL_SCORE[c.risk.schedule] + LEVEL_SCORE[c.risk.cost] + LEVEL_SCORE[c.risk.quality] + LEVEL_SCORE[c.risk.safety];
  const statusWeight = c.status === "critical" ? 100 : 50;
  return statusWeight + profile;
}

export default function ContractsAttention() {
  const [priority, setPriority] = useState<OpsStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortBy>("priority");
  const [drawerId, setDrawerId] = useState<string | null>(null);

  const filtered = OPS_CONTRACTS.filter((c) => priority === "all" || c.status === priority);
  const countFor = (p: OpsStatus | "all") => OPS_CONTRACTS.filter((c) => p === "all" || c.status === p).length;

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "progress") return a.progress - b.progress; // least complete first
    if (sortBy === "risk") return riskScore(b) - riskScore(a); // highest risk first
    return riskScore(b) - riskScore(a); // priority: critical first, then risk
  });

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <ContractDrawer contractId={drawerId} onClose={() => setDrawerId(null)} />
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base text-gray-900">Contracts needing attention</h3>
            <p className="text-sm text-gray-400 mt-0.5">{filtered.length} need your attention</p>
          </div>
          <WidgetChat title="Contracts needing attention" />
        </div>
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
              {opt.label} {countFor(opt.value)}
            </button>
          ))}

          <span className="text-gray-200 text-xs mx-1">|</span>

          <span className="text-xs text-gray-400">Sort</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
                sortBy === opt.value ? "bg-black text-white" : "border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {sorted.length > 0 ? (
          sorted.map((c) => <ContractRow key={c.id} contract={c} onOpenDrawer={setDrawerId} />)
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">No contracts match the selected filter.</p>
        )}
      </div>
    </div>
  );
}
