"use client";

import { ArrowDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ReferenceLine, ResponsiveContainer } from "recharts";
import { DELIVERY_TREND as D } from "@/lib/dashboard-data";
import WidgetChat from "./widget-chat";

export default function DeliveryTrend() {
  return (
    <div className="bg-white rounded-xl p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-base text-gray-900">Delivery performance</h3>
          <p className="text-sm text-gray-400 mt-0.5">{D.metric} vs 85% target · 6 months</p>
        </div>
        <WidgetChat title="Delivery performance" />
      </div>

      {/* Big value */}
      <div className="flex items-end gap-2 mb-3">
        <span className="text-3xl text-gray-900 leading-none">{D.current}</span>
        <span className="flex items-center gap-0.5 text-xs text-gray-400 mb-0.5">
          <ArrowDown size={11} strokeWidth={2} />
          {D.delta}
        </span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart data={D.points} margin={{ top: 12, right: 14, bottom: 0, left: 14 }}>
          <defs>
            <linearGradient id="deliveryArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#171717" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#171717" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            interval={0}
            tick={{ fontSize: 10, fill: "#A3A3A3" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis domain={[D.min, D.max]} hide />
          <ReferenceLine
            y={D.target}
            stroke="#D4D4D4"
            strokeDasharray="3 3"
            label={{ value: "Target 85%", position: "insideTopRight", fontSize: 9, fill: "#A3A3A3" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#171717"
            strokeWidth={2}
            fill="url(#deliveryArea)"
            dot={{ r: 2, fill: "#ffffff", stroke: "#171717", strokeWidth: 1.5 }}
            activeDot={{ r: 3.5, fill: "#171717", stroke: "#171717" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
