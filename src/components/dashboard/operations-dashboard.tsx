"use client";

import { useState } from "react";
import MetricCard from "@/components/dashboard/operations/metric-card";
import ContractStatus from "@/components/dashboard/operations/contract-status";
import ContractsAttention from "@/components/dashboard/operations/contracts-attention";
import FinancialPerformance from "@/components/dashboard/operations/financial-performance";
import ResourceCapacity from "@/components/dashboard/operations/resource-capacity";
import CustomWidget from "@/components/dashboard/sales/custom-widget";
import CustomWidgetView from "@/components/dashboard/sales/custom-widget-view";
import CustomWidgetBuilder from "@/components/dashboard/sales/custom-widget-builder";
import { type CustomWidgetConfig } from "@/lib/custom-widget";
import DashboardTabs from "@/components/dashboard/dashboard-tabs";
import ContractsTable from "@/components/dashboard/tables/contracts-table";
import WorkOrdersTable from "@/components/dashboard/tables/work-orders-table";
import PeopleWidget from "@/components/dashboard/people-widget";
import { PORTFOLIO_HEALTH as P } from "@/lib/operations-data";

const TABS = ["Overview", "Contracts", "Work Orders"];

export default function OperationsDashboard() {
  const [widgets, setWidgets] = useState<CustomWidgetConfig[]>([]);
  const [building, setBuilding] = useState(false);
  const [tab, setTab] = useState("Overview");

  if (tab !== "Overview") {
    return (
      <div className="flex flex-col gap-4">
        <DashboardTabs tabs={TABS} active={tab} onChange={setTab} />
        {tab === "Contracts" && <ContractsTable />}
        {tab === "Work Orders" && <WorkOrdersTable title="Work Orders" />}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <DashboardTabs tabs={TABS} active={tab} onChange={setTab} />

      {/* Portfolio health — broken out into separate widgets */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label="Executed vs as-sold margin" value={P.executedMargin} delta={P.marginDelta} note={`vs ${P.asSoldMargin} as-sold`} />
        <MetricCard label="Revenue vs forecast" value={P.revenue} delta={P.revenueDelta} note={`vs ${P.revenueForecast} forecast`} />
        <MetricCard label="Outstanding payments" value={P.outstandingPayments} note={P.outstandingNote} />
        <MetricCard label="Resource coverage" value={P.resourceCoverage} note={P.resourceNote} />
      </div>

      <ContractStatus />

      <ContractsAttention />

      <div className="grid grid-cols-2 gap-4">
        <FinancialPerformance />
        <ResourceCapacity />
      </div>

      <PeopleWidget />

      <div className="grid grid-cols-2 gap-4">
        {widgets.map((w) => (
          <CustomWidgetView key={w.id} config={w} />
        ))}
        <CustomWidget onClick={() => setBuilding(true)} />
      </div>

      {building && (
        <CustomWidgetBuilder
          onAdd={(config) => {
            setWidgets((ws) => [...ws, config]);
            setBuilding(false);
          }}
          onClose={() => setBuilding(false)}
        />
      )}
    </div>
  );
}
