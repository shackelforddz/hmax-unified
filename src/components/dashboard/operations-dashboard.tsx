"use client";

import { useState } from "react";
import PortfolioHealth from "@/components/dashboard/operations/portfolio-health";
import ContractsAttention from "@/components/dashboard/operations/contracts-attention";
import FinancialPerformance from "@/components/dashboard/operations/financial-performance";
import ResourceCapacity from "@/components/dashboard/operations/resource-capacity";
import CustomWidget from "@/components/dashboard/sales/custom-widget";
import CustomWidgetView from "@/components/dashboard/sales/custom-widget-view";
import CustomWidgetBuilder from "@/components/dashboard/sales/custom-widget-builder";
import { type CustomWidgetConfig } from "@/lib/custom-widget";

export default function OperationsDashboard() {
  const [widgets, setWidgets] = useState<CustomWidgetConfig[]>([]);
  const [building, setBuilding] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <PortfolioHealth />

      <ContractsAttention />

      <div className="grid grid-cols-2 gap-4">
        <FinancialPerformance />
        <ResourceCapacity />
      </div>

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
