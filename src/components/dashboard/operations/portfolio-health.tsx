import { ArrowDown } from "lucide-react";
import WidgetChat from "@/components/dashboard/widget-chat";
import { PORTFOLIO_HEALTH as P } from "@/lib/operations-data";

const SEGMENTS = [
  { label: "On track", value: P.onTrack, color: "bg-gray-300" },
  { label: "At risk", value: P.atRisk, color: "bg-gray-500" },
  { label: "Critical", value: P.critical, color: "bg-gray-900" },
];

const KPIS = [
  { label: "Executed vs as-sold margin", value: P.executedMargin, delta: P.marginDelta, note: `vs ${P.asSoldMargin} as-sold` },
  { label: "Revenue vs forecast", value: P.revenue, delta: P.revenueDelta, note: `vs ${P.revenueForecast} forecast` },
  { label: "Outstanding payments", value: P.outstandingPayments, delta: null, note: P.outstandingNote },
  { label: "Resource coverage", value: P.resourceCoverage, delta: null, note: P.resourceNote },
];

export default function PortfolioHealth() {
  return (
    <div className="bg-white rounded-xl p-5 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base text-gray-900">Portfolio Health Overview</h3>
        <WidgetChat title="Portfolio Health Overview" />
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {KPIS.map((k) => (
          <div key={k.label}>
            <p className="text-sm text-gray-400 leading-snug">{k.label}</p>
            <p className="text-3xl text-gray-900 leading-tight mt-1">{k.value}</p>
            <p className="flex items-center gap-1 text-xs text-gray-500 mt-1.5">
              {k.delta && <ArrowDown size={11} strokeWidth={2} className="shrink-0" />}
              {k.delta && <span className="text-gray-700">{k.delta}</span>}
              <span className="text-gray-400 truncate">{k.note}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Contract status</p>
          <p className="text-xs text-gray-400">{P.activeContracts} total</p>
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
    </div>
  );
}
