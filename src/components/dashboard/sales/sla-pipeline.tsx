"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { SLA_PIPELINE, type SlaBadge } from "@/lib/sales-data";
import WidgetChat from "@/components/dashboard/widget-chat";
import SlaContractDrawer from "./sla-contract-drawer";

function Badge({ badge }: { badge: SlaBadge }) {
  if (badge.verified) {
    return (
      <span className="inline-flex items-center gap-1 bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
        <Check size={10} strokeWidth={2.5} /> {badge.label}
      </span>
    );
  }
  return <span className="text-xs text-gray-500 whitespace-nowrap">{badge.label}</span>;
}

export default function SlaPipeline() {
  const [drawerId, setDrawerId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl p-5 flex flex-col">
      <SlaContractDrawer contractId={drawerId} onClose={() => setDrawerId(null)} />
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base text-gray-900">SLA Pipeline</h3>
        <WidgetChat title="SLA Pipeline" />
      </div>

      {/* Table */}
      <div>
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1.4fr_1fr] gap-x-3 pb-2 border-b border-gray-100">
          <span className="text-xs text-gray-400">Account</span>
          <span className="text-xs text-gray-400">Value</span>
          <span className="text-xs text-gray-400">Due in</span>
          <span className="text-xs text-gray-400">Service health</span>
          <span className="text-xs text-gray-400 text-right">Risk</span>
        </div>
        {SLA_PIPELINE.map((r, i) => (
          <div
            key={`${r.account}-${i}`}
            role="button"
            tabIndex={0}
            onClick={() => setDrawerId(r.contractId)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setDrawerId(r.contractId); } }}
            className="grid grid-cols-[1.4fr_1fr_1fr_1.4fr_1fr] gap-x-3 py-2.5 items-center border-b border-gray-50 last:border-0 -mx-2 px-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <span className="text-sm text-gray-800 underline underline-offset-2 decoration-gray-200 group-hover:decoration-gray-500 transition-colors">{r.account}</span>
            <span className="text-sm text-gray-600">{r.value}</span>
            <span className="text-sm text-gray-600">{r.dueIn}</span>
            <div><Badge badge={r.serviceHealth} /></div>
            <div className="flex justify-end"><Badge badge={r.risk} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
