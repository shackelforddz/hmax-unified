"use client";

import { useState } from "react";
import KpiCard from "@/components/dashboard/kpi-card";
import FleetMap from "@/components/dashboard/sales/fleet-map";
import FleetHealth from "@/components/dashboard/sales/fleet-health";
import AssetAlerts from "@/components/dashboard/sales/asset-alerts";
import ScopeReviews from "@/components/dashboard/reliability/scope-reviews";
import SiteConstraints from "@/components/dashboard/reliability/site-constraints";
import EngBulletins from "@/components/dashboard/reliability/eng-bulletins";
import { ASSET_REVIEW_ALERTS, REVIEW_CATEGORY_OPTIONS } from "@/lib/reliability-data";
import CustomWidget from "@/components/dashboard/sales/custom-widget";
import CustomWidgetView from "@/components/dashboard/sales/custom-widget-view";
import CustomWidgetBuilder from "@/components/dashboard/sales/custom-widget-builder";
import { type CustomWidgetConfig } from "@/lib/custom-widget";
import DashboardTabs from "@/components/dashboard/dashboard-tabs";
import ContractsTable from "@/components/dashboard/tables/contracts-table";
import AssetsTable from "@/components/dashboard/tables/assets-table";

const TABS = ["Overview", "Assets", "Contracts"];

// Asset-health KPIs lead this view.
const HEALTH_KPIS = [
  { id: "critical-assets", label: "Critical assets", value: "2", trend: "2 vs last month", sparkline: "contracts-at-risk" as const },
  { id: "at-risk", label: "At risk (score <60)", value: "3", trend: "2 vs last month", sparkline: "on-time-delivery" as const },
  { id: "overdue-insp", label: "Overdue inspections", value: "5", trend: "1 vs last month", sparkline: "portfolio-margin" as const },
];

export default function ReliabilityDashboard() {
  const [widgets, setWidgets] = useState<CustomWidgetConfig[]>([]);
  const [building, setBuilding] = useState(false);
  const [tab, setTab] = useState("Overview");

  if (tab !== "Overview") {
    return (
      <div className="flex flex-col gap-4">
        <DashboardTabs tabs={TABS} active={tab} onChange={setTab} />
        {tab === "Assets" && <AssetsTable />}
        {tab === "Contracts" && <ContractsTable />}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <DashboardTabs tabs={TABS} active={tab} onChange={setTab} />

      {/* Bento box — asset health first, then contracts */}
      <div className="grid grid-cols-6 gap-4 items-stretch [&>*]:min-w-0 [&>.tile>*]:h-full">
        {/* ── Asset health — top ── */}
        {HEALTH_KPIS.map((k) => (
          <div key={k.id} className="tile col-span-2">
            <KpiCard {...k} />
          </div>
        ))}

        <div className="tile col-span-4">
          <FleetMap />
        </div>
        <div className="tile col-span-2">
          <FleetHealth />
        </div>

        {/* ── Engineering review ── */}
        <div className="col-span-6">
          <AssetAlerts
            alerts={ASSET_REVIEW_ALERTS}
            categoryOptions={REVIEW_CATEGORY_OPTIONS}
            title="Assets to review"
            unit="to review"
          />
        </div>
        <div className="col-span-6">
          <ScopeReviews />
        </div>
        <div className="col-span-3">
          <SiteConstraints />
        </div>
        <div className="col-span-3">
          <EngBulletins />
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
