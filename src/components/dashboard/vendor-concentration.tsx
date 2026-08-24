"use client";

import { BarChart, Bar, XAxis, YAxis, LabelList, ResponsiveContainer } from "recharts";
import { VENDOR_CONCENTRATION as V } from "@/lib/dashboard-data";
import WidgetChat from "./widget-chat";

const max = Math.max(...V.bars.map((b) => b.amount));

// Two-line category tick: vendor name + project count
function VendorTick({ x, y, payload }: { x?: number; y?: number; payload?: { value?: string } }) {
  const bar = V.bars.find((b) => b.name === payload?.value);
  return (
    <text x={x} y={y} textAnchor="end" fontFamily="inherit">
      <tspan x={x} dy="-2" fontSize="12" fill="#374151">{payload?.value}</tspan>
      <tspan x={x} dy="14" fontSize="10" fill="#9CA3AF">
        {bar ? `${bar.projects} project${bar.projects > 1 ? "s" : ""}` : ""}
      </tspan>
    </text>
  );
}

export default function VendorConcentration() {
  return (
    <div className="bg-white rounded-xl p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base text-gray-900">Vendor concentration</h3>
          <p className="text-sm text-gray-400 mt-0.5">{V.caption}</p>
        </div>
        <WidgetChat title="Vendor concentration" />
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          layout="vertical"
          data={V.bars}
          margin={{ top: 4, right: 44, bottom: 0, left: 8 }}
          barCategoryGap={16}
        >
          <XAxis type="number" domain={[0, max]} hide />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={<VendorTick />}
            tickLine={false}
            axisLine={false}
          />
          <Bar dataKey="amount" fill="#111827" radius={[4, 4, 4, 4]} barSize={12}>
            <LabelList dataKey="display" position="right" fontSize={12} fill="#111827" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
