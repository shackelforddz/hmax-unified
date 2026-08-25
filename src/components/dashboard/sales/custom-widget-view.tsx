"use client";

import { MessageCircle } from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, LabelList, ResponsiveContainer,
} from "recharts";
import WidgetChat from "@/components/dashboard/widget-chat";
import { type CustomWidgetConfig, formatValue } from "@/lib/custom-widget";

const GRAYS = ["#111827", "#6B7280", "#9CA3AF", "#D1D5DB", "#E5E7EB"];

export function ChartBody({ config }: { config: CustomWidgetConfig }) {
  const { type, series, unit } = config;

  if (type === "kpi") {
    const latest = series[series.length - 1].value;
    const first = series[0].value;
    const delta = Math.round((latest - first) * 10) / 10;
    return (
      <div>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-3xl text-gray-900 leading-none">{formatValue(latest, unit)}</span>
          <span className="text-xs text-gray-400 mb-0.5">
            {delta >= 0 ? "+" : ""}{delta}{unit === "%" ? "pp" : ""} vs start
          </span>
        </div>
        <ResponsiveContainer width="100%" height={90}>
          <LineChart data={series} margin={{ top: 6, right: 4, bottom: 0, left: 4 }}>
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <Line type="monotone" dataKey="value" stroke="#111827" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === "donut") {
    return (
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="55%" height={150}>
          <PieChart>
            <Pie data={series} dataKey="value" nameKey="label" innerRadius={38} outerRadius={62} paddingAngle={2} stroke="none">
              {series.map((_, i) => (
                <Cell key={i} fill={GRAYS[i % GRAYS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-1.5">
          {series.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: GRAYS[i % GRAYS.length] }} />
              <span className="text-xs text-gray-600">{s.label}</span>
              <span className="text-xs text-gray-400 ml-auto">{formatValue(s.value, unit)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "bar") {
    const max = Math.max(...series.map((s) => s.value));
    return (
      <ResponsiveContainer width="100%" height={Math.max(120, series.length * 34)}>
        <BarChart layout="vertical" data={series} margin={{ top: 4, right: 40, bottom: 0, left: 8 }} barCategoryGap={10}>
          <XAxis type="number" domain={[0, max]} hide />
          <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 12, fill: "#4B5563" }} tickLine={false} axisLine={false} />
          <Bar dataKey="value" fill="#111827" radius={[4, 4, 4, 4]} barSize={12}>
            <LabelList dataKey="value" position="right" fontSize={12} fill="#111827" formatter={(v) => formatValue(Number(v ?? 0), unit)} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // line (default)
  return (
    <ResponsiveContainer width="100%" height={150}>
      <AreaChart data={series} margin={{ top: 12, right: 14, bottom: 0, left: 14 }}>
        <defs>
          <linearGradient id={`cwArea-${config.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#111827" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#111827" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" interval={0} tick={{ fontSize: 10, fill: "#9CA3AF" }} tickLine={false} axisLine={false} />
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Area type="monotone" dataKey="value" stroke="#111827" strokeWidth={2} fill={`url(#cwArea-${config.id})`} dot={{ r: 2, fill: "#fff", stroke: "#111827", strokeWidth: 1.5 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface Props {
  config: CustomWidgetConfig;
  /** In the builder preview the chat icon is inert. */
  static?: boolean;
}

export default function CustomWidgetView({ config, static: isStatic }: Props) {
  return (
    <div className="bg-white rounded-xl p-5 flex flex-col">
      <div className="flex items-start justify-between mb-4 gap-3">
        <h3 className="text-base text-gray-900 leading-snug">{config.title}</h3>
        {isStatic ? (
          <MessageCircle size={16} strokeWidth={1.5} className="text-gray-300 shrink-0" />
        ) : (
          <WidgetChat title={config.title} />
        )}
      </div>
      <div className="mt-auto">
        <ChartBody config={config} />
      </div>
    </div>
  );
}
