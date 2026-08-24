import { ArrowDown } from "lucide-react";
import Sparkline from "./sparkline";
import WidgetChat from "./widget-chat";
import type { KpiData } from "@/lib/dashboard-data";

export default function KpiCard({ label, value, trend, sparkline }: KpiData) {
  return (
    <div className="bg-white rounded-xl p-4 flex flex-col gap-3">
      {/* Label row */}
      <div className="flex items-start justify-between">
        <span className="text-sm text-gray-500 leading-snug">{label}</span>
        <WidgetChat title={label} />
      </div>

      {/* Value + trend + sparkline */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl text-gray-900 leading-none mb-2">{value}</div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <ArrowDown size={11} strokeWidth={2} />
            <span>{trend}</span>
          </div>
        </div>
        <Sparkline variant={sparkline} />
      </div>
    </div>
  );
}
