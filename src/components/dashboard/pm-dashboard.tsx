"use client";

import { useState } from "react";
import KpiCard from "@/components/dashboard/kpi-card";
import AttentionList from "@/components/dashboard/attention-list";
import DeliveryTrend from "@/components/dashboard/delivery-trend";
import RevenueAtRisk from "@/components/dashboard/revenue-at-risk";
import UpcomingMilestones from "@/components/dashboard/upcoming-milestones";
import VendorConcentration from "@/components/dashboard/vendor-concentration";
import CustomWidget from "@/components/dashboard/sales/custom-widget";
import CustomWidgetView from "@/components/dashboard/sales/custom-widget-view";
import CustomWidgetBuilder from "@/components/dashboard/sales/custom-widget-builder";
import { KPI_DATA } from "@/lib/dashboard-data";
import { type CustomWidgetConfig } from "@/lib/custom-widget";
import DashboardTabs from "@/components/dashboard/dashboard-tabs";
import WorkOrdersTable from "@/components/dashboard/tables/work-orders-table";
import PeopleWidget from "@/components/dashboard/people-widget";

const TABS = ["Overview", "Work Orders"];

export default function PmDashboard() {
  const [widgets, setWidgets] = useState<CustomWidgetConfig[]>([]);
  const [building, setBuilding] = useState(false);
  const [tab, setTab] = useState("Overview");

  return (
    <div className="flex flex-col gap-4">
      <DashboardTabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "Work Orders" ? (
        <WorkOrdersTable />
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4">
            {KPI_DATA.map((kpi) => (
              <KpiCard key={kpi.id} {...kpi} />
            ))}
          </div>

          <AttentionList />

          <PeopleWidget />

          {/* PM data visuals */}
          <div className="grid grid-cols-2 gap-4">
            <DeliveryTrend />
            <RevenueAtRisk />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <UpcomingMilestones />
            <VendorConcentration />
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
        </>
      )}
    </div>
  );
}
