"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ScrollText } from "lucide-react";
import WidgetChat from "@/components/dashboard/widget-chat";
import { Button } from "@/components/ui/button";
import { useConversationLauncher } from "@/components/dashboard/conversation-launcher";
import { buildPlaybook } from "@/lib/alert-playbooks";
import ContractDrawer from "@/components/dashboard/operations/contract-drawer";
import { SCOPE_REVIEWS, type ScopeReview, type ScopeVerdict } from "@/lib/reliability-data";

const VERDICT: Record<ScopeVerdict, { label: string; cls: string }> = {
  "not-feasible": { label: "Not feasible", cls: "bg-black text-white" },
  "at-risk": { label: "At risk", cls: "bg-gray-200 text-gray-700" },
  feasible: { label: "Feasible", cls: "border border-gray-300 text-gray-500" },
  pending: { label: "Awaiting review", cls: "border border-gray-400 text-gray-700" },
};

function VerdictBadge({ v }: { v: ScopeVerdict }) {
  const { label, cls } = VERDICT[v];
  return <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ${cls}`}>{label}</span>;
}

function ScopeRow({ review, defaultExpanded, onOpenDrawer }: { review: ScopeReview; defaultExpanded: boolean; onOpenDrawer: (id: string) => void }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const launch = useConversationLauncher();
  const entity = { kind: "contract" as const, id: review.contractId };

  const nameSpan = (
    <span
      role="button"
      tabIndex={0}
      onClick={(e) => { e.stopPropagation(); onOpenDrawer(review.contractId); }}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); onOpenDrawer(review.contractId); } }}
      className="underline underline-offset-2 decoration-gray-300 hover:decoration-gray-700 cursor-pointer transition-colors"
    >
      {review.account}
    </span>
  );

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button onClick={() => setExpanded((e) => !e)} className="w-full text-left px-6 py-5 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="w-12 h-11 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
            <ScrollText size={18} strokeWidth={1.5} className="text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base text-gray-900 mb-1">{nameSpan}</h4>
            <p className="text-sm text-gray-400 truncate">{review.scope} · {review.value} · {review.from}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <VerdictBadge v={review.verdict} />
            {expanded ? <ChevronUp size={16} strokeWidth={1.5} className="text-gray-400" /> : <ChevronDown size={16} strokeWidth={1.5} className="text-gray-400" />}
          </div>
        </div>
      </button>

      {expanded && (
        <>
          <hr className="border-gray-200" />
          <div className="px-6 py-5 flex gap-4">
            <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm text-gray-500 shrink-0 font-mono leading-none">!</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 mb-2 leading-snug">Technical feasibility review · from {review.from}</p>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{review.detail}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() =>
                    launch({
                      context: review.account,
                      prompt: `${review.action} for the ${review.account} scope`,
                      entity,
                      playbook: buildPlaybook(review.action, review.detail, {
                        verdict: review.verdict,
                        scope: review.scope,
                        value: review.value,
                        from: review.from,
                        title: `${review.account} — ${review.scope}`,
                      }),
                    })
                  }
                  className="rounded-full h-auto px-5 py-2 text-sm cursor-pointer"
                >
                  {review.action}
                </Button>
                <Button variant="outline" onClick={() => launch({ context: review.account, prompt: `Review the ${review.account} scope: ${review.scope}`, entity })} className="rounded-full h-auto px-5 py-2 text-sm text-gray-700 cursor-pointer">
                  Start A Conversation
                </Button>
                <Button variant="outline" onClick={() => onOpenDrawer(review.contractId)} className="rounded-full h-auto px-5 py-2 text-sm text-gray-700 cursor-pointer">
                  See Details
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const STATUS_OPTIONS: { label: string; value: ScopeVerdict | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Awaiting review", value: "pending" },
  { label: "At risk", value: "at-risk" },
  { label: "Not feasible", value: "not-feasible" },
  { label: "Feasible", value: "feasible" },
];

export default function ScopeReviews() {
  const [status, setStatus] = useState<ScopeVerdict | "all">("all");
  const [drawerId, setDrawerId] = useState<string | null>(null);

  const filtered = SCOPE_REVIEWS.filter((r) => status === "all" || r.verdict === status);
  const countFor = (s: ScopeVerdict | "all") => SCOPE_REVIEWS.filter((r) => s === "all" || r.verdict === s).length;
  const firstId = filtered[0]?.id;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <ContractDrawer contractId={drawerId} onClose={() => setDrawerId(null)} />
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base text-gray-900">Contracts to review</h3>
            <p className="text-sm text-gray-400 mt-0.5">{filtered.length} scope reviews from sales</p>
          </div>
          <WidgetChat title="Contracts to review" />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400">Status</span>
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
                status === opt.value ? "bg-black text-white" : "border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {opt.label} {countFor(opt.value)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((r) => <ScopeRow key={r.id} review={r} defaultExpanded={r.id === firstId} onOpenDrawer={setDrawerId} />)
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">No scope reviews match the selected filter.</p>
        )}
      </div>
    </div>
  );
}
