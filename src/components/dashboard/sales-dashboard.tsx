"use client";

import { useState } from "react";
import KpiCard from "@/components/dashboard/kpi-card";
import FleetMap from "@/components/dashboard/sales/fleet-map";
import FleetHealth from "@/components/dashboard/sales/fleet-health";
import AssetAlerts from "@/components/dashboard/sales/asset-alerts";
import OpportunityStats from "@/components/dashboard/sales/opportunity-stats";
import OpportunityOverview from "@/components/dashboard/sales/opportunity-overview";
import Opportunities from "@/components/dashboard/sales/opportunities";
import RepeatedRepairs from "@/components/dashboard/sales/repeated-repairs";
import SlaPipeline from "@/components/dashboard/sales/sla-pipeline";
import SlaRenewals from "@/components/dashboard/sales/sla-renewals";
import CustomWidget from "@/components/dashboard/sales/custom-widget";
import CustomWidgetView from "@/components/dashboard/sales/custom-widget-view";
import CustomWidgetBuilder from "@/components/dashboard/sales/custom-widget-builder";
import { type CustomWidgetConfig } from "@/lib/custom-widget";
import DashboardTabs from "@/components/dashboard/dashboard-tabs";
import OpportunitiesTable from "@/components/dashboard/tables/opportunities-table";
import ContractsTable from "@/components/dashboard/tables/contracts-table";
import AssetsTable from "@/components/dashboard/tables/assets-table";

const TABS = ["Overview", "Opportunities", "Contracts", "Assets"];

export default function SalesDashboard() {
  const [widgets, setWidgets] = useState<CustomWidgetConfig[]>([]);
  const [building, setBuilding] = useState(false);
  const [tab, setTab] = useState("Overview");

  if (tab !== "Overview") {
    return (
      <div className="flex flex-col gap-4">
        <DashboardTabs tabs={TABS} active={tab} onChange={setTab} />
        {tab === "Opportunities" && <OpportunitiesTable />}
        {tab === "Contracts" && <ContractsTable />}
        {tab === "Assets" && <AssetsTable />}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <DashboardTabs tabs={TABS} active={tab} onChange={setTab} />

      {/* Bento box — tiles stretch to equal height within each row */}
      <div className="grid grid-cols-6 gap-4 items-stretch [&>*]:min-w-0 [&>.tile>*]:h-full">
        {/* ── Opportunities (ops) — top ── */}
        <div className="col-span-6">
          <OpportunityStats />
        </div>
        <div className="tile col-span-6">
          <OpportunityOverview />
        </div>
        <div className="col-span-6">
          <Opportunities />
        </div>

        {/* ── Contracts (SLA) ── */}
        <div className="tile col-span-4">
          <SlaPipeline />
        </div>
        <div className="tile col-span-2">
          <SlaRenewals />
        </div>

        {/* ── Assets — bottom ── */}
        <div className="tile col-span-4">
          <FleetMap />
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <FleetHealth />
          <KpiCard id="critical-assets" label="Critical assets" value="2" trend="2 vs last month" sparkline="contracts-at-risk" />
          <KpiCard id="at-risk" label="At risk (score <60)" value="3" trend="2 vs last month" sparkline="on-time-delivery" />
        </div>
        <div className="col-span-6">
          <AssetAlerts />
        </div>
        <div className="tile col-span-2">
          <RepeatedRepairs />
        </div>

        {/* Custom widgets */}
        {widgets.map((w) => (
          <div key={w.id} className="tile col-span-2">
            <CustomWidgetView config={w} />
          </div>
        ))}
        <div className="tile col-span-2">
          <CustomWidget onClick={() => setBuilding(true)} />
        </div>
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
