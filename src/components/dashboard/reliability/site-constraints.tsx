"use client";

import WidgetChat from "@/components/dashboard/widget-chat";
import { SITE_CONSTRAINTS, type ConstraintStatus } from "@/lib/reliability-data";

function StatusBadge({ status }: { status: ConstraintStatus }) {
  return status === "conflict" ? (
    <span className="bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">Conflict</span>
  ) : (
    <span className="border border-gray-300 text-gray-500 text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">OK</span>
  );
}

export default function SiteConstraints() {
  const conflicts = SITE_CONSTRAINTS.filter((c) => c.status === "conflict").length;
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between">
        <div>
          <h3 className="text-base text-gray-900">Handover vs site constraints</h3>
          <p className="text-sm text-gray-400 mt-0.5">{conflicts} conflicts to reconcile</p>
        </div>
        <WidgetChat title="Handover vs site constraints" />
      </div>
      <div className="p-4 flex flex-col gap-3">
        {SITE_CONSTRAINTS.map((c) => (
          <div key={c.id} className="border border-gray-200 rounded-2xl px-4 py-3">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-sm text-gray-900">{c.asset} · {c.type}</span>
              <StatusBadge status={c.status} />
            </div>
            <div className="flex items-baseline gap-2 text-xs">
              <span className="text-gray-400 w-16 shrink-0 tracking-wider text-[10px]">Handover</span>
              <span className="text-gray-600 flex-1 min-w-0">{c.handover}</span>
            </div>
            <div className="flex items-baseline gap-2 text-xs mt-1">
              <span className="text-gray-400 w-16 shrink-0 tracking-wider text-[10px]">Site</span>
              <span className={`flex-1 min-w-0 ${c.status === "conflict" ? "text-gray-900" : "text-gray-600"}`}>{c.actual}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
