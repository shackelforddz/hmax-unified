"use client";

import { useState } from "react";
import DataTable, { type Column } from "@/components/dashboard/data-table";
import AssetDrawer from "@/components/dashboard/sales/asset-drawer";
import { ASSET_ALERTS, ASSET_DETAILS, type AssetAlert } from "@/lib/sales-data";

function StatusBadge({ status }: { status: AssetAlert["status"] }) {
  if (status === "critical") return <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">Critical</span>;
  return <span className="border border-gray-400 text-gray-700 text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">At risk</span>;
}

function HealthCell({ health }: { health: number }) {
  return (
    <div className="flex items-center gap-2 min-w-[110px]">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gray-900 rounded-full" style={{ width: `${health}%` }} />
      </div>
      <span className="text-xs text-gray-400 shrink-0">{health}%</span>
    </div>
  );
}

const COLUMNS: Column<AssetAlert>[] = [
  { header: "Asset", cell: (a) => <span className="text-gray-900">{a.code}</span> },
  { header: "Type", cell: (a) => <span className="text-gray-700">{ASSET_DETAILS[a.id]?.type ?? "Power transformer"}</span> },
  { header: "Location", cell: (a) => <span className="text-gray-500">{a.location}</span> },
  { header: "Health", cell: (a) => <HealthCell health={a.health} />, className: "w-40" },
  { header: "Status", cell: (a) => <StatusBadge status={a.status} />, align: "right" },
];

export default function AssetsTable() {
  const [drawerId, setDrawerId] = useState<string | null>(null);
  return (
    <>
      <AssetDrawer assetId={drawerId} onClose={() => setDrawerId(null)} />
      <DataTable
        title="Assets"
        subtitle={`${ASSET_ALERTS.length} monitored assets`}
        columns={COLUMNS}
        rows={ASSET_ALERTS}
        getKey={(a) => a.id}
        onRowClick={(a) => setDrawerId(a.id)}
      />
    </>
  );
}
