"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ASSET_ALERTS, type AssetAlert, type AssetStatus } from "@/lib/sales-data";
import WidgetChat from "@/components/dashboard/widget-chat";

function AssetThumb() {
  return (
    <div className="w-12 h-11 rounded-md bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/transformer.png" alt="Asset" className="w-full h-full object-contain grayscale" />
    </div>
  );
}

function StatusBadge({ status }: { status: AssetStatus }) {
  if (status === "critical") {
    return <span className="bg-black text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">Critical</span>;
  }
  return <span className="border border-gray-300 text-gray-500 text-xs px-3 py-1 rounded-full whitespace-nowrap">At Risk</span>;
}

function AssetRow({ asset }: { asset: AssetAlert }) {
  const [expanded, setExpanded] = useState(asset.id === "ast-001");
  const canExpand = !!asset.alert;

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => canExpand && setExpanded((e) => !e)}
        className={`w-full text-left px-6 py-5 transition-colors ${canExpand ? "hover:bg-gray-50 cursor-pointer" : "cursor-default"}`}
      >
        <div className="flex items-center gap-4">
          <AssetThumb />
          <div className="flex-1 min-w-0">
            <h4 className="text-base text-gray-900 underline underline-offset-2 decoration-gray-300 mb-1">{asset.code}</h4>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{asset.location}</span>
              <span>·</span>
              <span>Health</span>
              <span className="w-10 h-1 bg-gray-200 rounded-full overflow-hidden inline-block">
                <span className="block h-full bg-gray-900 rounded-full" style={{ width: `${asset.health}%` }} />
              </span>
              <span>{asset.health}%</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <StatusBadge status={asset.status} />
            {canExpand &&
              (expanded ? (
                <ChevronUp size={16} strokeWidth={1.5} className="text-gray-400" />
              ) : (
                <ChevronDown size={16} strokeWidth={1.5} className="text-gray-400" />
              ))}
          </div>
        </div>
      </button>

      {expanded && asset.alert && (
        <>
          <hr className="border-gray-200" />
          <div className="px-6 py-5 flex gap-4">
            <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm text-gray-500 shrink-0 font-mono leading-none">
              !
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 mb-2">{asset.alert.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{asset.alert.detail}</p>
              <button className="bg-black text-white text-sm px-5 py-2 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer">
                {asset.alert.action}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const PRIORITY = [
  { label: "All", value: "all" as const, count: 14 },
  { label: "Critical", value: "critical" as const, count: 2 },
  { label: "At Risk", value: "at-risk" as const, count: 5 },
];
const CATEGORY = [
  { label: "All", count: 14 },
  { label: "Blockers", count: 6 },
  { label: "Margin risk", count: 5 },
  { label: "Site & access", count: 4 },
  { label: "Invoice triggers", count: 3 },
];

export default function AssetAlerts() {
  const [priority, setPriority] = useState<"all" | AssetStatus>("all");
  const [category, setCategory] = useState("All");

  const filtered = ASSET_ALERTS.filter((a) => priority === "all" || a.status === priority);

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base text-gray-900">Asset Alerts</h3>
            <p className="text-sm text-gray-400 mt-0.5">3 need your attention</p>
          </div>
          <WidgetChat title="Asset Alerts" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400">Priority:</span>
          {PRIORITY.map((p) => (
            <button
              key={p.value}
              onClick={() => setPriority(p.value)}
              className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
                priority === p.value ? "bg-black text-white" : "border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {p.label} ({p.count})
            </button>
          ))}
          <span className="text-gray-200 text-xs mx-1">|</span>
          <span className="text-xs text-gray-400">Category:</span>
          {CATEGORY.map((c) => (
            <button
              key={c.label}
              onClick={() => setCategory(c.label)}
              className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
                category === c.label ? "bg-black text-white" : "border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {c.label} ({c.count})
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="p-4 flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((a) => <AssetRow key={a.id} asset={a} />)
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">No assets match the selected filters.</p>
        )}
      </div>
    </div>
  );
}
