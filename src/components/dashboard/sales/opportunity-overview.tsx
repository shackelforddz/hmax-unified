"use client";

import WidgetChat from "@/components/dashboard/widget-chat";
import { OPPORTUNITIES, OPP_STAGES } from "@/lib/sales-data";

// Greyscale shade per stage (Discovery → Negotiation).
const SHADES = ["#171717", "#404040", "#737373", "#A3A3A3", "#D4D4D4"];

const parseVal = (v: string) => parseFloat(v.replace(/[^0-9.]/g, "")) || 0; // "$8.2M" → 8.2
const fmt = (n: number) => `$${n.toFixed(1)}M`;

export default function OpportunityOverview() {
  const byStage = OPP_STAGES.map((stage, i) => {
    const opps = OPPORTUNITIES.filter((o) => o.stage === stage);
    const value = opps.reduce((s, o) => s + parseVal(o.value), 0);
    return { stage, count: opps.length, value, shade: SHADES[i % SHADES.length] };
  });

  const totalValue = byStage.reduce((s, b) => s + b.value, 0);
  const totalCount = OPPORTUNITIES.length;
  const segments = byStage.filter((b) => b.value > 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-base text-gray-900">Opportunity Overview</h3>
        <WidgetChat title="Opportunity Overview" />
      </div>
      <p className="text-sm text-gray-400 mb-4">
        {fmt(totalValue)} total pipeline · {totalCount} opportunities
      </p>

      {/* Segmented pipeline bar — width per stage ∝ value */}
      <div className="flex gap-0.5 h-3 mb-5">
        {segments.map((b) => (
          <div
            key={b.stage}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{ width: `${(b.value / totalValue) * 100}%`, background: b.shade }}
            title={`${b.stage} · ${b.count} · ${fmt(b.value)}`}
          />
        ))}
      </div>

      {/* Per-stage breakdown */}
      <div className="grid grid-cols-5 gap-3">
        {byStage.map((b) => (
          <div key={b.stage}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: b.shade }} />
              <span className="text-xs text-gray-500 truncate">{b.stage}</span>
            </div>
            <p className="text-xl text-gray-900 leading-none">{b.count}</p>
            <p className="text-[11px] text-gray-400 mt-1">
              {b.count === 1 ? "opportunity" : "opportunities"}
            </p>
            <p className="text-sm text-gray-700 mt-1.5">{fmt(b.value)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
