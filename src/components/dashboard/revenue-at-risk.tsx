"use client";

import { BarChart, Bar, XAxis, YAxis, LabelList, ResponsiveContainer } from "recharts";
import { REVENUE_AT_RISK as R } from "@/lib/dashboard-data";
import WidgetChat from "./widget-chat";

const max = Math.max(...R.bars.map((b) => b.amount));

export default function RevenueAtRisk() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-base text-gray-900">Revenue at risk</h3>
          <p className="text-sm text-gray-400 mt-0.5">by trigger · this quarter</p>
        </div>
        <WidgetChat title="Revenue at risk" />
      </div>

      {/* Total */}
      <div className="flex items-end gap-2 mb-2">
        <span className="text-3xl text-gray-900 leading-none">{R.total}</span>
        <span className="text-xs text-gray-400 mb-0.5">{R.caption}</span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={150}>
        <BarChart
          layout="vertical"
          data={R.bars}
          margin={{ top: 6, right: 44, bottom: 0, left: 8 }}
          barCategoryGap={10}
        >
          <XAxis type="number" domain={[0, max]} hide />
          <YAxis
            type="category"
            dataKey="label"
            width={130}
            tick={{ fontSize: 12, fill: "#525252" }}
            tickLine={false}
            axisLine={false}
          />
          <Bar dataKey="amount" fill="#171717" radius={[4, 4, 4, 4]} barSize={12}>
            <LabelList dataKey="display" position="right" fontSize={12} fill="#171717" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
