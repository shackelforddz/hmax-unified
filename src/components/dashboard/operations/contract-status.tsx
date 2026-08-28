"use client";

import WidgetChat from "@/components/dashboard/widget-chat";
import { PORTFOLIO_HEALTH as P } from "@/lib/operations-data";

const SEGMENTS = [
  { label: "On track", value: P.onTrack, color: "bg-gray-300" },
  { label: "At risk", value: P.atRisk, color: "bg-gray-500" },
  { label: "Critical", value: P.critical, color: "bg-gray-900" },
];

export default function ContractStatus() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base text-gray-900">Contract status</h3>
          <p className="text-sm text-gray-400 mt-0.5">{P.activeContracts} active contracts</p>
        </div>
        <WidgetChat title="Contract status" />
      </div>
      <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-100">
        {SEGMENTS.map((s) => (
          <div key={s.label} className={s.color} style={{ width: `${(s.value / P.activeContracts) * 100}%` }} />
        ))}
      </div>
      <div className="flex gap-5 mt-3">
        {SEGMENTS.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-sm ${s.color}`} />
            <span className="text-sm text-gray-600">{s.label}</span>
            <span className="text-sm text-gray-900">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
