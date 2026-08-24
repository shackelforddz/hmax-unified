"use client";

import { LineChart, Line, YAxis, ResponsiveContainer } from "recharts";
import { SLA_RENEWALS as S } from "@/lib/sales-data";
import WidgetChat from "@/components/dashboard/widget-chat";

export default function SlaRenewals() {
  return (
    <div className="bg-white rounded-xl p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base text-gray-900">Upcoming SLA Renewals</h3>
        <WidgetChat title="Upcoming SLA Renewals" />
      </div>

      <span className="text-4xl text-gray-900 leading-none mb-3">{S.value}</span>

      <ResponsiveContainer width="100%" height={130}>
        <LineChart data={S.points} margin={{ top: 8, right: 6, bottom: 4, left: 6 }}>
          <YAxis domain={[20, 70]} hide />
          <Line type="monotone" dataKey="v" stroke="#111827" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
