"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ASSET_ALERTS, type AssetAlert, type AssetStatus, type AssetCategory } from "@/lib/sales-data";
import WidgetChat from "@/components/dashboard/widget-chat";
import { Button } from "@/components/ui/button";
import { useConversationLauncher } from "@/components/dashboard/conversation-launcher";
import AssetDrawer from "./asset-drawer";

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

function AssetRow({ asset, onOpenDrawer }: { asset: AssetAlert; onOpenDrawer: (id: string) => void }) {
  const [expanded, setExpanded] = useState(asset.id === "ast-001");
  const launch = useConversationLauncher();
  const canExpand = !!asset.alert;

  const nameSpan = (
    <span
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onOpenDrawer(asset.id);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onOpenDrawer(asset.id);
        }
      }}
      className="underline underline-offset-2 decoration-gray-300 hover:decoration-gray-700 cursor-pointer transition-colors"
    >
      {asset.code}
    </span>
  );

  const header = (
    <div className="flex items-center gap-4">
      <AssetThumb />
      <div className="flex-1 min-w-0">
        <h4 className="text-base text-gray-900 mb-1">{nameSpan}</h4>
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
  );

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      {canExpand ? (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-full text-left px-6 py-5 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {header}
        </button>
      ) : (
        <div className="px-6 py-5">{header}</div>
      )}

      {canExpand && expanded && asset.alert && (
        <>
          <hr className="border-gray-200" />
          <div className="px-6 py-5 flex gap-4">
            <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm text-gray-500 shrink-0 font-mono leading-none">
              !
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 mb-2 leading-snug">{asset.alert.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{asset.alert.detail}</p>
              <div className="flex flex-wrap gap-2">
                {/* Recommended action — primary CTA */}
                <Button
                  onClick={() => launch({ context: asset.code, prompt: asset.alert!.action })}
                  className="rounded-full h-auto px-5 py-2 text-sm cursor-pointer"
                >
                  {asset.alert.action}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => launch({ context: asset.code, prompt: asset.alert!.title })}
                  className="rounded-full h-auto px-5 py-2 text-sm text-gray-700 cursor-pointer"
                >
                  Start A Conversation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenDrawer(asset.id)}
                  className="rounded-full h-auto px-5 py-2 text-sm text-gray-700 cursor-pointer"
                >
                  See Details
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const PRIORITY_OPTIONS: { label: string; value: AssetStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "At Risk", value: "at-risk" },
];
const CATEGORY_OPTIONS: { label: string; value: AssetCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Asset health", value: "asset-health" },
  { label: "Risk building", value: "risk-building" },
  { label: "Offer readiness", value: "offer-readiness" },
  { label: "Missing info", value: "missing-info" },
];

export default function AssetAlerts() {
  const [priority, setPriority] = useState<AssetStatus | "all">("all");
  const [category, setCategory] = useState<AssetCategory | "all">("all");
  const [drawerId, setDrawerId] = useState<string | null>(null);

  const filtered = ASSET_ALERTS.filter((a) => {
    const matchPriority = priority === "all" || a.status === priority;
    const matchCategory = category === "all" || a.category === category;
    return matchPriority && matchCategory;
  });

  const countFor = (s: AssetStatus | "all", c: AssetCategory | "all") =>
    ASSET_ALERTS.filter((a) => (s === "all" || a.status === s) && (c === "all" || a.category === c)).length;

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <AssetDrawer assetId={drawerId} onClose={() => setDrawerId(null)} />
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base text-gray-900">Asset Alerts</h3>
            <p className="text-sm text-gray-400 mt-0.5">{filtered.length} need your attention</p>
          </div>
          <WidgetChat title="Asset Alerts" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400">Priority</span>
          {PRIORITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPriority(opt.value)}
              className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
                priority === opt.value ? "bg-black text-white" : "border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {opt.label} {countFor(opt.value, category)}
            </button>
          ))}
          <span className="text-gray-200 text-xs mx-1">|</span>
          <span className="text-xs text-gray-400">Category</span>
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCategory(opt.value)}
              className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
                category === opt.value ? "bg-black text-white" : "border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {opt.label} {countFor(priority, opt.value)}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="p-4 flex flex-col gap-3">
        {filtered.length > 0 ? (
          filtered.map((a) => <AssetRow key={a.id} asset={a} onOpenDrawer={setDrawerId} />)
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">No assets match the selected filters.</p>
        )}
      </div>
    </div>
  );
}
