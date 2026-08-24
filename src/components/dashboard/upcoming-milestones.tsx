import { UPCOMING_MILESTONES, type MilestoneStatus } from "@/lib/dashboard-data";
import WidgetChat from "./widget-chat";

function StatusDot({ status }: { status: MilestoneStatus }) {
  const cls =
    status === "late" ? "bg-gray-900"
    : status === "at-risk" ? "bg-gray-500"
    : "bg-gray-300";
  return <span className={`w-2 h-2 rounded-full shrink-0 ${cls}`} />;
}

function DueBadge({ status, dueIn }: { status: MilestoneStatus; dueIn: string }) {
  const cls =
    status === "late" ? "bg-gray-900 text-white"
    : status === "at-risk" ? "bg-gray-100 text-gray-700"
    : "border border-gray-200 text-gray-400";
  return <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${cls}`}>{dueIn}</span>;
}

export default function UpcomingMilestones() {
  return (
    <div className="bg-white rounded-xl p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base text-gray-900">Upcoming milestones</h3>
          <p className="text-sm text-gray-400 mt-0.5">next 14 days · across your portfolio</p>
        </div>
        <WidgetChat title="Upcoming milestones" />
      </div>

      {/* List */}
      <div className="flex flex-col">
        {UPCOMING_MILESTONES.map((m, i) => (
          <div
            key={`${m.customer}-${m.milestone}`}
            className={`flex items-center gap-3 py-3 ${i < UPCOMING_MILESTONES.length - 1 ? "border-b border-gray-100" : ""}`}
          >
            <StatusDot status={m.status} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">
                {m.milestone} <span className="text-gray-400">· {m.customer}</span>
              </p>
              <p className="text-xs text-gray-400">{m.owner} · due {m.due}</p>
            </div>
            <DueBadge status={m.status} dueIn={m.dueIn} />
          </div>
        ))}
      </div>
    </div>
  );
}
