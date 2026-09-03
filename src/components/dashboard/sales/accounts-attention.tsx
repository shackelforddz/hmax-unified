"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import WidgetChat from "@/components/dashboard/widget-chat";
import { Button } from "@/components/ui/button";
import { useConversationLauncher } from "@/components/dashboard/conversation-launcher";
import { ACCOUNT_ATTENTION, type AccountAttention, type AccountStatus, type AccountCategory } from "@/lib/accounts-data";
import { type RiskProfile } from "@/lib/operations-data";
import { buildPlaybook } from "@/lib/alert-playbooks";
import SlaContractDrawer from "./sla-contract-drawer";

const MAX_ALERTS = 3;

function StatusBadge({ status }: { status: AccountStatus }) {
  if (status === "critical") {
    return <span className="bg-black text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">Critical</span>;
  }
  if (status === "at-risk") {
    return <span className="border border-gray-400 text-gray-700 text-xs px-3 py-1 rounded-full whitespace-nowrap">At Risk</span>;
  }
  return <span className="border border-gray-300 text-gray-500 text-xs px-3 py-1 rounded-full whitespace-nowrap">Watch</span>;
}

/* ── Flag categories ─────────────────────────────────────────────── */
const CAT_LABEL: Record<AccountCategory, string> = {
  opportunity: "Opportunity",
  asset: "Asset",
  commercial: "Commercial",
};
const CAT_CLS: Record<AccountCategory, string> = {
  opportunity: "border border-gray-300 text-gray-500",
  asset: "bg-gray-200 text-gray-700",
  commercial: "bg-gray-900 text-white",
};
const CAT_ORDER: AccountCategory[] = ["opportunity", "asset", "commercial"];

function CategoryBadge({ category }: { category: AccountCategory }) {
  return <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${CAT_CLS[category]}`}>{CAT_LABEL[category]}</span>;
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

function AccountRow({ item, category, onOpenDrawer }: { item: AccountAttention; category: AccountCategory | "all"; onOpenDrawer: (contractId: string) => void }) {
  // Critical accounts open expanded.
  const [expanded, setExpanded] = useState(item.status === "critical");
  const launch = useConversationLauncher();
  const entity = { kind: "customer" as const, name: item.account };

  // Category counts for the collapsed summary.
  const counts = CAT_ORDER.map((c) => [c, item.flags.filter((f) => f.category === c).length] as const).filter(([, n]) => n > 0);
  // Alerts shown when expanded — filtered by category, capped.
  const shown = (category === "all" ? item.flags : item.flags.filter((f) => f.category === category)).slice(0, MAX_ALERTS);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button onClick={() => setExpanded((e) => !e)} className="w-full text-left px-6 py-5 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <h4 className="text-base text-gray-900 mb-1">
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); onOpenDrawer(item.contractId); }}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); onOpenDrawer(item.contractId); } }}
                className="underline underline-offset-2 decoration-gray-300 hover:decoration-gray-700 cursor-pointer transition-colors"
              >
                {item.account}
              </span>
            </h4>
            <p className="text-sm text-gray-400">{item.owner} · {item.meta}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0 pt-0.5">
            <StatusBadge status={item.status} />
            {expanded ? <ChevronUp size={16} strokeWidth={1.5} className="text-gray-400" /> : <ChevronDown size={16} strokeWidth={1.5} className="text-gray-400" />}
          </div>
        </div>

        {/* Progress bar — offer/renewal readiness */}
        <div className="flex items-center gap-3 mb-2.5">
          <span className="text-xs text-gray-400 shrink-0 w-20">Progress</span>
          <div className="relative flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gray-900 rounded-full" style={{ width: `${item.progress}%` }} />
          </div>
          <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">{item.progress}% ready</span>
        </div>

        {/* Risk profile */}
        <div className="flex items-center gap-3 mb-2.5">
          <span className="text-xs text-gray-400 shrink-0 w-20">Risk profile</span>
          <RiskChips risk={item.risk} />
        </div>

        {/* Alerts summary by category */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 shrink-0 w-20">Alerts</span>
          <span className="text-xs text-gray-500">{item.flags.length} to review</span>
          {counts.map(([cat, n]) => (
            <span key={cat} className="inline-flex items-center gap-1 text-xs text-gray-500">
              <span className="text-gray-300">·</span>{CAT_LABEL[cat]} {n}
            </span>
          ))}
        </div>
      </button>

      {expanded && shown.length > 0 && (
        <>
          <hr className="border-gray-200" />
          <div className="px-6 py-5 flex flex-col gap-6">
            {shown.map((flag, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm text-gray-500 shrink-0 font-mono leading-none">!</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <p className="text-sm text-gray-900 leading-snug">{flag.title}</p>
                    <CategoryBadge category={flag.category} />
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{flag.detail}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => launch({ context: item.account, prompt: flag.action, entity, playbook: buildPlaybook(flag.action, flag.detail, { assetId: flag.assetId, title: flag.title }) })}
                      className="rounded-full h-auto px-5 py-2 text-sm cursor-pointer"
                    >
                      {flag.action}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => launch({ context: item.account, prompt: flag.title, entity })}
                      className="rounded-full h-auto px-5 py-2 text-sm text-gray-700 cursor-pointer"
                    >
                      Start A Conversation
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onOpenDrawer(item.contractId)}
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

const PRIORITY_OPTIONS: { label: string; value: AccountStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "At Risk", value: "at-risk" },
  { label: "Watch", value: "watch" },
];

const CATEGORY_OPTIONS: { label: string; value: AccountCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Opportunity", value: "opportunity" },
  { label: "Asset", value: "asset" },
  { label: "Commercial", value: "commercial" },
];

type SortBy = "priority" | "progress" | "risk";
const SORT_OPTIONS: { label: string; value: SortBy }[] = [
  { label: "Priority", value: "priority" },
  { label: "Progress", value: "progress" },
  { label: "Risk", value: "risk" },
];

const STATUS_WEIGHT: Record<AccountStatus, number> = { critical: 3, "at-risk": 2, watch: 1 };
const LEVEL_SCORE: Record<string, number> = { high: 3, med: 2, low: 1 };
function riskScore(a: AccountAttention): number {
  const profile = LEVEL_SCORE[a.risk.schedule] + LEVEL_SCORE[a.risk.cost] + LEVEL_SCORE[a.risk.quality] + LEVEL_SCORE[a.risk.safety];
  return STATUS_WEIGHT[a.status] * 100 + profile;
}

export default function AccountsAttention() {
  const [priority, setPriority] = useState<AccountStatus | "all">("all");
  const [category, setCategory] = useState<AccountCategory | "all">("all");
  const [sortBy, setSortBy] = useState<SortBy>("priority");
  const [drawerId, setDrawerId] = useState<string | null>(null);

  const filtered = ACCOUNT_ATTENTION.filter(
    (a) =>
      (priority === "all" || a.status === priority) &&
      (category === "all" || a.flags.some((f) => f.category === category))
  );
  const countPriority = (p: AccountStatus | "all") =>
    ACCOUNT_ATTENTION.filter((a) => (p === "all" || a.status === p) && (category === "all" || a.flags.some((f) => f.category === category))).length;
  const countCategory = (c: AccountCategory | "all") =>
    ACCOUNT_ATTENTION.filter((a) => (priority === "all" || a.status === priority) && (c === "all" || a.flags.some((f) => f.category === c))).length;

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "progress") return a.progress - b.progress; // least ready first
    return riskScore(b) - riskScore(a); // priority / risk: highest first
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <SlaContractDrawer contractId={drawerId} onClose={() => setDrawerId(null)} />
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base text-gray-900">Accounts that need your attention</h3>
            <p className="text-sm text-gray-400 mt-0.5">{filtered.length} need your attention</p>
          </div>
          <WidgetChat title="Accounts that need your attention" />
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
              {opt.label} {countPriority(opt.value)}
            </button>
          ))}

          <span className="text-gray-200 text-xs mx-1">|</span>

          <span className="text-xs text-gray-400">Category</span>
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCategory(opt.value)}
              className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
                category === opt.value ? "bg-black text-white" : "border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {opt.label} {countCategory(opt.value)}
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
          sorted.map((item) => <AccountRow key={item.id} item={item} category={category} onOpenDrawer={setDrawerId} />)
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">No accounts match the selected filter.</p>
        )}
      </div>
    </div>
  );
}
