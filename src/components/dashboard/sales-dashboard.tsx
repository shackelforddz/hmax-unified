"use client";

import { useState } from "react";
import KpiCard from "@/components/dashboard/kpi-card";
import FleetMap from "@/components/dashboard/sales/fleet-map";
import FleetHealth from "@/components/dashboard/sales/fleet-health";
import AssetAlerts from "@/components/dashboard/sales/asset-alerts";
import RepeatedRepairs from "@/components/dashboard/sales/repeated-repairs";
import SlaPipeline from "@/components/dashboard/sales/sla-pipeline";
import SlaRenewals from "@/components/dashboard/sales/sla-renewals";
import CustomWidget from "@/components/dashboard/sales/custom-widget";
import CustomWidgetView from "@/components/dashboard/sales/custom-widget-view";
import CustomWidgetBuilder from "@/components/dashboard/sales/custom-widget-builder";
import { type CustomWidgetConfig } from "@/lib/custom-widget";

export default function SalesDashboard() {
  const [widgets, setWidgets] = useState<CustomWidgetConfig[]>([]);
  const [building, setBuilding] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Top row: fleet map + stacked KPI cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <FleetMap />
        </div>
        <div className="flex flex-col gap-4">
          <FleetHealth />
          <KpiCard id="critical-assets" label="Critical assets" value="2" trend="2 vs last month" sparkline="contracts-at-risk" />
          <KpiCard id="at-risk" label="At risk (score <60)" value="3" trend="2 vs last month" sparkline="on-time-delivery" />
        </div>
      </div>

      {/* Asset alerts */}
      <AssetAlerts />

      {/* Repeated repairs + SLA pipeline */}
      <div className="grid grid-cols-3 gap-4">
        <RepeatedRepairs />
        <div className="col-span-2">
          <SlaPipeline />
        </div>
      </div>

      {/* Renewals + custom widgets */}
      <div className="grid grid-cols-2 gap-4">
        <SlaRenewals />
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
