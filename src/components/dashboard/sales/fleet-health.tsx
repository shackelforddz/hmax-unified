"use client";

import { LineChart, Line, YAxis, ResponsiveContainer } from "recharts";
import { FLEET_HEALTH as F } from "@/lib/sales-data";
import WidgetChat from "@/components/dashboard/widget-chat";

export default function FleetHealth() {
  return (
    <div className="bg-white rounded-xl p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base text-gray-900">Fleet health</h3>
        <WidgetChat title="Fleet health" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div>
          <p className="text-xs text-gray-400">30 days ago</p>
          <p className="text-4xl text-gray-900 leading-tight">{F.past}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Today</p>
          <p className="text-4xl text-gray-900 leading-tight">{F.today}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Change</p>
          <p className="text-4xl text-gray-900 leading-tight">{F.change}</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={F.points} margin={{ top: 8, right: 4, bottom: 4, left: 4 }}>
          <YAxis domain={[55, 92]} hide />
          <Line type="monotone" dataKey="avg" stroke="#111827" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="std" stroke="#9CA3AF" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex gap-4 mt-2">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-0.5 bg-gray-900 inline-block" /> Fleet Avg
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-0.5 bg-gray-400 inline-block" style={{ backgroundImage: "repeating-linear-gradient(90deg,#9CA3AF 0 3px,transparent 3px 6px)" }} /> Fleet Standard
        </span>
      </div>
    </div>
  );
}
