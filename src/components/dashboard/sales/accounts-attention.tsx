"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import WidgetChat from "@/components/dashboard/widget-chat";
import { Button } from "@/components/ui/button";
import { useConversationLauncher } from "@/components/dashboard/conversation-launcher";
import { ACCOUNT_ATTENTION, type AccountAttention, type AccountStatus } from "@/lib/accounts-data";
import { buildPlaybook } from "@/lib/alert-playbooks";

function StatusBadge({ status }: { status: AccountStatus }) {
  if (status === "critical") {
    return <span className="bg-black text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">Critical</span>;
  }
  if (status === "at-risk") {
    return <span className="border border-gray-400 text-gray-700 text-xs px-3 py-1 rounded-full whitespace-nowrap">At Risk</span>;
  }
  return <span className="border border-gray-300 text-gray-500 text-xs px-3 py-1 rounded-full whitespace-nowrap">Watch</span>;
}

function AccountRow({ item, defaultOpen }: { item: AccountAttention; defaultOpen: boolean }) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const launch = useConversationLauncher();
  const entity = { kind: "customer" as const, name: item.account };

  const header = (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h4 className="text-base text-gray-900 mb-1.5">
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); launch({ context: item.account, prompt: `Summarise the ${item.account} account`, entity }); }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); launch({ context: item.account, prompt: `Summarise the ${item.account} account`, entity }); } }}
            className="underline underline-offset-2 decoration-gray-300 hover:decoration-gray-700 cursor-pointer transition-colors"
          >
            {item.account}
          </span>
        </h4>
        <p className="text-sm text-gray-400">{item.owner} · {item.meta}</p>
        <p className="text-sm text-gray-500 mt-1">{item.summary}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0 pt-0.5">
        <StatusBadge status={item.status} />
        {expanded ? (
          <ChevronUp size={16} strokeWidth={1.5} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} strokeWidth={1.5} className="text-gray-400" />
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-6 py-5 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        {header}
      </button>

      {expanded && (
        <>
          <hr className="border-gray-200" />
          <div className="px-6 py-5 flex flex-col gap-6">
            {item.flags.map((flag, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm text-gray-500 shrink-0 font-mono leading-none">!</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 mb-2 leading-snug">{flag.title}</p>
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
                      onClick={() => launch({ context: item.account, prompt: `Summarise the ${item.account} account`, entity })}
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

export default function AccountsAttention() {
  const [statusFilter, setStatusFilter] = useState<AccountStatus | "all">("all");

  const filtered = ACCOUNT_ATTENTION.filter((a) => statusFilter === "all" || a.status === statusFilter);
  const countFor = (s: AccountStatus | "all") => ACCOUNT_ATTENTION.filter((a) => s === "all" || a.status === s).length;
  const firstId = filtered[0]?.id;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base text-gray-900">Accounts that need your attention</h3>
            <p className="text-sm text-gray-400 mt-0.5">{filtered.length} accounts at risk across your portfolio</p>
          </div>
          <WidgetChat title="Accounts that need your attention" />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400">Priority</span>
          {PRIORITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
                statusFilter === opt.value ? "bg-black text-white" : "border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {opt.label} {countFor(opt.value)}
            </button>
          ))}
        </div>
      </div>

      {/* Card list */}
      <div className="p-4 flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((item) => <AccountRow key={item.id} item={item} defaultOpen={item.id === firstId} />)
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">No accounts match the selected filter.</p>
        )}
      </div>
    </div>
  );
}
