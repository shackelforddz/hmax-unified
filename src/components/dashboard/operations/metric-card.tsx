"use client";

import { ArrowDown } from "lucide-react";
import WidgetChat from "@/components/dashboard/widget-chat";

export default function MetricCard({ label, value, delta, note }: { label: string; value: string; delta?: string | null; note: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
      <div className="flex items-start justify-between mb-1">
        <p className="text-base text-gray-900 leading-snug">{label}</p>
        <WidgetChat title={label} />
      </div>
      <p className="text-3xl text-gray-900 leading-tight mt-1">{value}</p>
      <p className="flex items-center gap-1 text-xs text-gray-500 mt-1.5">
        {delta && <ArrowDown size={11} strokeWidth={2} className="shrink-0" />}
        {delta && <span className="text-gray-700">{delta}</span>}
        <span className="text-gray-400 truncate">{note}</span>
      </p>
    </div>
  );
}
