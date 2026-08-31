"use client";

import { useState } from "react";
import DataTable, { type Column } from "@/components/dashboard/data-table";
import ContractDrawer from "@/components/dashboard/operations/contract-drawer";
import { OPS_CONTRACTS, type OpsContract } from "@/lib/operations-data";

function StatusBadge({ status }: { status: OpsContract["status"] }) {
  if (status === "critical") return <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">Critical</span>;
  return <span className="border border-gray-400 text-gray-700 text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">At risk</span>;
}

function ProgressCell({ c }: { c: OpsContract }) {
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="relative flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-gray-900 rounded-full" style={{ width: `${c.progress}%` }} />
      </div>
      <span className="text-xs text-gray-400 shrink-0">{c.progress}%</span>
    </div>
  );
}

const COLUMNS: Column<OpsContract>[] = [
  { header: "Contract", cell: (c) => <span className="text-gray-900">{c.name}</span> },
  { header: "Customer", cell: (c) => <span className="text-gray-700">{c.customer}</span> },
  { header: "Value", cell: (c) => <span className="text-gray-700">{c.value}</span> },
  { header: "Progress", cell: (c) => <ProgressCell c={c} />, className: "w-44" },
  { header: "Status", cell: (c) => <StatusBadge status={c.status} /> },
  { header: "Owner", cell: (c) => <span className="text-gray-500 whitespace-nowrap">{c.owner}</span>, align: "right" },
];

export default function ContractsTable() {
  const [drawerId, setDrawerId] = useState<string | null>(null);
  return (
    <>
      <ContractDrawer contractId={drawerId} onClose={() => setDrawerId(null)} />
      <DataTable
        title="Contracts"
        subtitle={`${OPS_CONTRACTS.length} active contracts`}
        columns={COLUMNS}
        rows={OPS_CONTRACTS}
        getKey={(c) => c.id}
        onRowClick={(c) => setDrawerId(c.id)}
      />
    </>
  );
}
