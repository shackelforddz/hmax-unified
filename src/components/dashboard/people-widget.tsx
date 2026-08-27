"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, TriangleAlert } from "lucide-react";
import WidgetChat from "@/components/dashboard/widget-chat";
import WorkOrderDrawer, { StatusBadge } from "@/components/dashboard/work-order-drawer";
import { PEOPLE, type Person } from "@/lib/people-data";
import { WORK_ORDERS, type WorkOrder } from "@/lib/work-orders-data";

/* ── Risk model ──────────────────────────────────────────────────── */
const HIGH_LOAD = 90; // near capacity
const OVER_ALLOCATED = 95; // over capacity

function tasksFor(person: Person): WorkOrder[] {
  return person.taskIds
    .map((id) => WORK_ORDERS.find((w) => w.id === id))
    .filter((w): w is WorkOrder => !!w);
}

// Most-severe reason first.
function riskReasons(person: Person, tasks: WorkOrder[]): string[] {
  const reasons: string[] = [];
  if (person.allocation >= OVER_ALLOCATED) reasons.push("Over-allocated");
  else if (person.allocation >= HIGH_LOAD) reasons.push("High allocation");
  if (tasks.some((t) => t.status === "blocked")) reasons.push("Blocked task");
  return reasons;
}

function AllocationBar({ pct, warn }: { pct: number; warn: boolean }) {
  return (
    <div className="flex items-center gap-2 w-32 shrink-0">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${warn ? "bg-gray-900" : "bg-gray-500"}`} style={{ width: `${Math.min(100, pct)}%` }} />
      </div>
      <span className={`text-xs shrink-0 ${warn ? "text-gray-900" : "text-gray-400"}`}>{pct}%</span>
    </div>
  );
}

function RiskChip({ reason }: { reason: string }) {
  const cls = reason === "High allocation" ? "bg-gray-200 text-gray-700" : "bg-gray-900 text-white";
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${cls}`}>
      <TriangleAlert size={10} strokeWidth={2} />
      {reason}
    </span>
  );
}

function PersonRow({ person, defaultExpanded, onOpenTask }: { person: Person; defaultExpanded: boolean; onOpenTask: (id: string) => void }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const tasks = tasksFor(person);
  const reasons = riskReasons(person, tasks);
  const warn = person.allocation >= HIGH_LOAD;

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button onClick={() => setExpanded((e) => !e)} className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={person.avatar} alt={person.name} className="w-11 h-11 rounded-full object-cover bg-gray-200 grayscale shrink-0" />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base text-gray-900 leading-tight">{person.name}</h4>
              {reasons.map((r) => <RiskChip key={r} reason={r} />)}
            </div>
            <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-0.5">
              <span>{person.role}</span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1"><MapPin size={12} strokeWidth={1.5} className="text-gray-400" />{person.location}</span>
            </p>
          </div>

          <div className="hidden sm:block">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 text-right">Allocation</p>
            <AllocationBar pct={person.allocation} warn={warn} />
          </div>

          <span className="text-xs text-gray-500 border border-gray-200 rounded-full px-2.5 py-0.5 whitespace-nowrap shrink-0">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </span>

          {expanded ? <ChevronUp size={16} strokeWidth={1.5} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} strokeWidth={1.5} className="text-gray-400 shrink-0" />}
        </div>
      </button>

      {expanded && (
        <>
          <hr className="border-gray-200" />
          <div className="px-5 py-3">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">Assigned tasks</p>
            {tasks.map((t) => (
              <div
                key={t.id}
                role="button"
                tabIndex={0}
                onClick={() => onOpenTask(t.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenTask(t.id); } }}
                className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0 cursor-pointer group"
              >
                <span className="text-sm text-gray-500 w-20 shrink-0 group-hover:text-gray-900 transition-colors">{t.code}</span>
                <span className="text-sm text-gray-700 flex-1 min-w-0 truncate group-hover:text-gray-900 transition-colors underline underline-offset-2 decoration-gray-200 group-hover:decoration-gray-500">{t.title}</span>
                <span className="text-xs text-gray-400 shrink-0 hidden sm:block">{t.asset}</span>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

type Filter = "all" | "at-risk";

export default function PeopleWidget() {
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const isAtRisk = (p: Person) => riskReasons(p, tasksFor(p)).length > 0;
  const atRiskCount = PEOPLE.filter(isAtRisk).length;
  const avgAllocation = Math.round(PEOPLE.reduce((s, p) => s + p.allocation, 0) / PEOPLE.length);

  const visible = filter === "at-risk" ? PEOPLE.filter(isAtRisk) : PEOPLE;
  // Surface at-risk people first, then by allocation (busiest first).
  const sorted = [...visible].sort((a, b) => {
    const ra = isAtRisk(a) ? 1 : 0;
    const rb = isAtRisk(b) ? 1 : 0;
    if (ra !== rb) return rb - ra;
    return b.allocation - a.allocation;
  });
  const firstAtRisk = sorted.find(isAtRisk)?.id;

  const FILTERS: { label: string; value: Filter; count: number }[] = [
    { label: "All", value: "all", count: PEOPLE.length },
    { label: "At risk", value: "at-risk", count: atRiskCount },
  ];

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <WorkOrderDrawer workOrderId={drawerId} onClose={() => setDrawerId(null)} />
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base text-gray-900">People</h3>
            <p className="text-sm text-gray-400 mt-0.5">
              {PEOPLE.length} on your team · {avgAllocation}% avg allocation
              {atRiskCount > 0 && <span> · {atRiskCount} at risk</span>}
            </p>
          </div>
          <WidgetChat title="People" />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-400">Priority</span>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer ${
                filter === f.value ? "bg-black text-white" : "border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {f.label} {f.count}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {sorted.length > 0 ? (
          sorted.map((p) => (
            <PersonRow key={p.id} person={p} defaultExpanded={p.id === firstAtRisk} onOpenTask={setDrawerId} />
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">No one on your team is currently at risk.</p>
        )}
      </div>
    </div>
  );
}
