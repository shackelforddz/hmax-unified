"use client";

import { useEffect, useState, useRef } from "react";
import { X, ChevronDown, CalendarClock, ClipboardList, Package, UserPlus, ExternalLink, FileText, ScrollText, PencilRuler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConversationLauncher } from "@/components/dashboard/conversation-launcher";
import { ASSET_DETAILS, ASSET_CONDITION, type AssetDetail, type AssetReading, type AssetCondition } from "@/lib/sales-data";
import { WORK_ORDERS } from "@/lib/work-orders-data";
import { REPORTS_AWAITING } from "@/lib/field-reports-data";
import { ASSET_SERVICE_HISTORY } from "@/lib/asset-history-data";
import { ASSET_NAMEPLATE, type Nameplate } from "@/lib/asset-nameplate-data";
import { ASSET_DRAWINGS } from "@/lib/asset-drawings-data";
import { Aging, ScoreCalculation, RiskMatrix, ConditionTrend, ParameterTrend, Diagnostics } from "./asset-condition";

function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base text-gray-900 mb-4">{children}</h3>;
}

function ReadingState({ state }: { state: AssetReading["state"] }) {
  const cls =
    state === "alert" ? "bg-gray-900 text-white"
    : state === "watch" ? "bg-gray-200 text-gray-700"
    : "border border-gray-300 text-gray-500";
  const label = state === "alert" ? "Alert" : state === "watch" ? "Watch" : "OK";
  return <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${cls}`}>{label}</span>;
}

function RiskBadge({ level }: { level: "Critical" | "High" | "Medium" }) {
  const cls = level === "Critical" ? "bg-gray-900 text-white" : level === "High" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700";
  return <span className={`text-[11px] px-3 py-0.5 rounded-full whitespace-nowrap ${cls}`}>{level}</span>;
}

const ACTIONS = [
  { label: "Schedule inspection", icon: CalendarClock },
  { label: "Create work order", icon: ClipboardList },
  { label: "Order parts", icon: Package },
  { label: "Assign technician", icon: UserPlus },
  { label: "Open in SAP", icon: ExternalLink },
];

function ActionsMenu({ onAction }: { onAction: (label: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div className="relative flex-1" ref={ref}>
      <Button onClick={() => setOpen((o) => !o)} className="w-full rounded-full h-auto py-2.5 text-sm cursor-pointer">
        Actions <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>
      {open && (
        <div className="absolute bottom-full mb-2 right-0 w-full min-w-[220px] bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-10 animate-message-in">
          {ACTIONS.map(({ label, icon: Icon }) => (
            <Button
              key={label}
              variant="ghost"
              onClick={() => { setOpen(false); onAction(label); }}
              className="w-full justify-start gap-2.5 px-4 py-2.5 h-auto text-sm text-gray-700 rounded-none cursor-pointer"
            >
              <Icon size={15} strokeWidth={1.5} className="text-gray-400 shrink-0" />
              {label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function DrawerBody({ d, cond, nameplate, onAction }: { d: AssetDetail; cond: AssetCondition | null; nameplate?: Nameplate; onAction: (prompt: string) => void }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Context summary */}
      <Card>
        <SectionTitle>Context summary</SectionTitle>
        <p className="text-sm text-gray-500 leading-relaxed">{d.contextSummary}</p>
        {d.recommendedActions.length > 0 && (
          <div className="mt-4">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-2">Recommended actions</p>
            <div className="flex flex-wrap gap-2">
              {d.recommendedActions.map((a) => (
                <Button key={a} onClick={() => onAction(a)} className="rounded-full h-auto px-4 py-1.5 text-xs cursor-pointer">
                  {a}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Nameplate — factory specifications */}
      {nameplate && (
        <Card>
          <SectionTitle>Nameplate</SectionTitle>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {[
              { label: "Manufacturer", value: nameplate.manufacturer },
              { label: "Manufactured", value: nameplate.manufactureYear },
              { label: "Serial no.", value: nameplate.serial },
              { label: "Rated power", value: nameplate.ratedPower },
              { label: "Voltage (HV / LV)", value: nameplate.voltageRatings },
              { label: "Frequency", value: nameplate.frequency },
              { label: "Cooling class", value: nameplate.coolingClass },
              { label: "Temp rise", value: nameplate.tempRise },
              { label: "Impedance", value: nameplate.impedance },
              { label: "Insulation", value: nameplate.insulationClass },
            ].map((r) => (
              <div key={r.label}>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider">{r.label}</p>
                <p className="text-sm text-gray-800 mt-0.5">{r.value}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Condition monitoring (APM) ── */}
      {cond && (
        <>
          <Card><Aging d={cond.aging} /></Card>
          <Card><RiskMatrix risk={cond.risk} /></Card>
          <Card><ConditionTrend data={cond.conditionTrend} totals={cond.conditionTotals} /></Card>
          <Card><ScoreCalculation factors={cond.scoreFactors} total={cond.scoreTotal} /></Card>
        </>
      )}

      {/* Condition & readings */}
      <Card>
        <SectionTitle>Condition &amp; readings</SectionTitle>
        <div className="flex flex-col">
          {d.readings.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700">{r.label}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm text-gray-500">{r.value}</span>
                <ReadingState state={r.state} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Parameter trend */}
      {cond && (
        <Card><ParameterTrend data={cond.parameterTrend} rows={cond.parameterRows} /></Card>
      )}

      {/* Diagnostics */}
      {cond?.diagnostics && (
        <Card><Diagnostics d={cond.diagnostics} /></Card>
      )}

      {/* Maintenance history */}
      <Card>
        <SectionTitle>Maintenance history</SectionTitle>
        <div className="flex flex-col">
          {d.maintenance.map((m, i) => (
            <div key={i} className="flex gap-3 pb-4 last:pb-0">
              <div className="flex flex-col items-center shrink-0 pt-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                {i < d.maintenance.length - 1 && <span className="w-px flex-1 bg-gray-200 mt-1" />}
              </div>
              <div className="flex-1 min-w-0 flex items-start justify-between gap-3">
                <p className="text-sm text-gray-800">{m.label}</p>
                <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{m.date}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Open risks */}
      <Card>
        <SectionTitle>Open risks</SectionTitle>
        <div className="flex flex-col gap-4">
          {d.risks.map((r, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 mb-1">{r.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{r.detail}</p>
              </div>
              <RiskBadge level={r.level} />
            </div>
          ))}
        </div>
      </Card>

      {/* Related */}
      <Card>
        <SectionTitle>Related</SectionTitle>
        <div className="flex flex-col gap-3">
          {[
            { label: "Customer", value: d.related.customer },
            { label: "Contract", value: d.related.contract },
            { label: "Station", value: d.related.station },
          ].map((r) => (
            <div key={r.label}>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider">{r.label}</p>
              <p className="text-sm text-gray-800 mt-0.5">{r.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ── Documents tab ───────────────────────────────────────────────── */
function DocRow({ icon: Icon, title, meta }: { icon: React.ElementType; title: string; meta: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-md bg-white border border-gray-100 flex items-center justify-center shrink-0">
        <Icon size={15} strokeWidth={1.5} className="text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 truncate">{title}</p>
        <p className="text-xs text-gray-400 truncate">{meta}</p>
      </div>
    </div>
  );
}

function DocGroup({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base text-gray-900">{title}</h3>
        <span className="text-xs text-gray-400">{count}</span>
      </div>
      {count > 0 ? <div className="flex flex-col">{children}</div> : <p className="text-sm text-gray-400">Nothing on file.</p>}
    </Card>
  );
}

function DocumentsTab({ d, id }: { d: AssetDetail; id: string }) {
  const reports = REPORTS_AWAITING.filter((r) => r.assetId === id);
  const workOrders = WORK_ORDERS.filter((w) => w.asset === d.code);
  const drawings = ASSET_DRAWINGS[id] ?? [];

  return (
    <div className="flex flex-col gap-4">
      <DocGroup title="Drawings & FAT" count={drawings.length}>
        {drawings.map((dw) => (
          <DocRow key={dw.ref} icon={PencilRuler} title={`${dw.name} · ${dw.type}`} meta={`${dw.ref} · ${dw.date}`} />
        ))}
      </DocGroup>

      <DocGroup title="Reports" count={reports.length}>
        {reports.map((r) => (
          <DocRow key={r.id} icon={FileText} title={`${r.code} · ${r.type}`} meta={`${r.engineer} · submitted ${r.submitted}`} />
        ))}
      </DocGroup>

      <DocGroup title="Work orders" count={workOrders.length}>
        {workOrders.map((w) => (
          <DocRow key={w.id} icon={ClipboardList} title={`${w.code} · ${w.title}`} meta={`${w.type} · ${w.status.replace("-", " ")} · due ${w.due}`} />
        ))}
      </DocGroup>

      <DocGroup title="Contracts" count={1}>
        <DocRow icon={ScrollText} title={d.related.contract} meta={d.related.customer} />
      </DocGroup>
    </div>
  );
}

/* ── Service history tab ─────────────────────────────────────────── */
const EVENT_CLS: Record<string, string> = {
  Repair: "bg-gray-900 text-white",
  Test: "bg-gray-200 text-gray-700",
  Inspection: "border border-gray-300 text-gray-500",
  Service: "border border-gray-300 text-gray-500",
};

function ServiceHistoryTab({ id }: { id: string }) {
  const events = ASSET_SERVICE_HISTORY[id] ?? [];
  return (
    <Card>
      <SectionTitle>Service history</SectionTitle>
      {events.length > 0 ? (
        <div className="flex flex-col">
          {events.map((e, i) => (
            <div key={i} className="flex gap-3 pb-5 last:pb-0">
              <div className="flex flex-col items-center shrink-0 pt-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                {i < events.length - 1 && <span className="w-px flex-1 bg-gray-200 mt-1" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-gray-800 leading-snug">{e.action}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${EVENT_CLS[e.type]}`}>{e.type}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{e.by} · {e.role} · {e.date}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No service history recorded.</p>
      )}
    </Card>
  );
}

const DRAWER_TABS = [
  { label: "Summary", value: "summary" },
  { label: "Documents", value: "documents" },
  { label: "Service history", value: "history" },
] as const;
type DrawerTab = (typeof DRAWER_TABS)[number]["value"];

interface Props {
  assetId: string | null;
  onClose: () => void;
}

export default function AssetDrawer({ assetId, onClose }: Props) {
  const detail = assetId ? ASSET_DETAILS[assetId] : null;
  const cond = assetId ? ASSET_CONDITION[assetId] ?? null : null;
  const open = !!detail;
  const launch = useConversationLauncher();
  const [tab, setTab] = useState<DrawerTab>("summary");

  // Reset to the summary tab whenever a different asset is opened.
  useEffect(() => {
    if (assetId) setTab("summary");
  }, [assetId]);

  const runAction = (prompt: string) => {
    onClose();
    launch({ context: detail?.code, prompt, entity: assetId ? { kind: "asset", id: assetId } : undefined });
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[520px] max-w-[92vw] bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-in-out font-patrick-hand ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {detail && (
          <>
            {/* Header */}
            <div className="shrink-0 px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-11 rounded-md bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/transformer.png" alt={detail.code} className="w-full h-full object-contain grayscale" />
                  </div>
                  <div>
                    <h2 className="text-2xl text-gray-900">{detail.code}</h2>
                    <p className="text-sm text-gray-400 mt-0.5">{detail.type} · {detail.location}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-x-8 gap-y-3 mt-4">
                {[
                  { label: "Status", value: detail.stats.status },
                  { label: "Commissioned", value: detail.stats.commissioned },
                  { label: "Last service", value: detail.stats.lastService },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-[11px] text-gray-400 uppercase tracking-wider">{s.label}</p>
                    <p className="text-sm text-gray-800 mt-0.5">{s.value}</p>
                  </div>
                ))}
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider">Health</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-900 rounded-full" style={{ width: `${detail.stats.healthPct}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{detail.stats.healthPct}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="shrink-0 flex px-6 border-b border-gray-100">
              {DRAWER_TABS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTab(t.value)}
                  className={`py-3 mr-6 text-sm border-b-2 -mb-px transition-colors cursor-pointer ${
                    tab === t.value ? "border-gray-900 text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-5 bg-white">
              {tab === "summary" && <DrawerBody d={detail} cond={cond} nameplate={assetId ? ASSET_NAMEPLATE[assetId] : undefined} onAction={runAction} />}
              {tab === "documents" && assetId && <DocumentsTab d={detail} id={assetId} />}
              {tab === "history" && assetId && <ServiceHistoryTab id={assetId} />}
            </div>

            {/* Footer */}
            <div className="shrink-0 flex gap-3 px-6 py-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => runAction(`Tell me about ${detail.code}`)}
                className="flex-1 rounded-full h-auto py-2.5 text-sm text-gray-700 cursor-pointer"
              >
                Create A Conversation
              </Button>
              <ActionsMenu onAction={(label) => runAction(`${label} for ${detail.code}`)} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
