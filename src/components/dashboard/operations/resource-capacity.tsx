import { AlertTriangle } from "lucide-react";
import WidgetChat from "@/components/dashboard/widget-chat";
import { TEAMS, CAPACITY_RISKS } from "@/lib/operations-data";

export default function ResourceCapacity() {
  return (
    <div className="bg-white rounded-xl p-5 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base text-gray-900">Resource &amp; Capacity</h3>
        <WidgetChat title="Resource & Capacity" />
      </div>

      {/* Teams */}
      <div className="flex flex-col gap-3.5">
        {TEAMS.map((t) => {
          const over = t.utilization >= 95;
          return (
            <div key={t.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-gray-700">{t.name}</span>
                <span className="text-sm text-gray-400">
                  {t.allocated}/{t.headcount} allocated · <span className={over ? "text-gray-900 font-medium" : "text-gray-500"}>{t.utilization}%</span>
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${over ? "bg-gray-900" : "bg-gray-400"}`} style={{ width: `${t.utilization}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Capacity risks */}
      <div className="mt-5">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-2.5">Capacity risks</p>
        <div className="flex flex-col gap-2.5">
          {CAPACITY_RISKS.map((r) => (
            <div key={r.title} className="flex gap-3">
              <AlertTriangle size={15} className="text-gray-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-800 leading-snug">{r.title}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${r.severity === "High" ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-700"}`}>
                    {r.severity}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-snug">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
