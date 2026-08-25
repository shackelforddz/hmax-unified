"use client";

import { useState, useRef } from "react";
import { Sparkles, Info, Check, AlertTriangle, ChevronLeft, ChevronRight, X, Plus, GripVertical, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ── Typing indicator ────────────────────────────────────────────── */
function TypingBubble() {
  return (
    <div className="flex items-start gap-3 mb-5 animate-message-in">
      <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles size={14} strokeWidth={1.5} className="text-gray-600" />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3.5 flex items-center gap-1.5">
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-400" style={{ animationDelay: "150ms" }} />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-400" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

/* ── Step tabs ───────────────────────────────────────────────────── */
const STEP_DEFS = [
  { num: 1, label: "Case" },
  { num: 2, label: "Scope" },
  { num: 3, label: "Staffing" },
  { num: 4, label: "Parts" },
  { num: 5, label: "Schedule" },
];

function StepTabs({ current }: { current: number }) {
  return (
    <div className="flex border-b border-gray-100">
      {STEP_DEFS.map(({ num, label }) => {
        const active = num === current;
        const done = num < current;
        return (
          <div key={num} className="flex-1 flex items-center gap-2 px-3 py-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 transition-colors ${
                active
                  ? "bg-black text-white"
                  : done
                  ? "bg-gray-200 text-gray-500"
                  : "border border-gray-200 text-gray-300"
              }`}
            >
              {done ? <Check size={10} strokeWidth={2.5} /> : num}
            </div>
            <span
              className={`text-sm whitespace-nowrap transition-colors ${
                active ? "text-gray-900" : done ? "text-gray-400" : "text-gray-300"
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Info banner ─────────────────────────────────────────────────── */
function InfoBanner({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
      <Info size={15} className="text-gray-400 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm text-gray-700 font-medium leading-snug">{title}</p>
        <p className="text-sm text-gray-500 leading-snug">{sub}</p>
      </div>
    </div>
  );
}

/* ── Step 1: Case Details ────────────────────────────────────────── */
function StepCase() {
  const [caseType, setCaseType] = useState("Corrective");
  return (
    <div className="flex flex-col gap-4 px-5 pt-4 pb-1">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">STEP 1 OF 5</p>
        <h3 className="text-2xl text-gray-900 mb-1 font-patrick-hand">Case details</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Confirm or update the case basics. The system has pre-filled from the linked opportunity OPP-441.
        </p>
      </div>
      <InfoBanner
        title="Pre-filled from OPP-441"
        sub="Xcel Energy · signed 14 Aug 2026. Confirm or edit any field."
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block">Customer</label>
          <input
            type="text"
            defaultValue="Xcel Energy"
            className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block">Asset / units in scope *</label>
          <input
            type="text"
            defaultValue="HVDC Units S-12, S-14, S-19"
            className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white"
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-2 block">Case type</label>
        <div className="flex gap-2">
          {["Corrective", "Preventive", "Mobilisation"].map((t) => (
            <button
              key={t}
              onClick={() => setCaseType(t)}
              className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-colors ${
                caseType === t ? "bg-black text-white" : "border border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1.5 block">What needs to happen?</label>
        <textarea
          placeholder="Brief description of the fault or scope..."
          className="w-full h-20 px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 resize-none bg-white placeholder-gray-300"
        />
      </div>
    </div>
  );
}

/* ── Step 2: Scope & Access ──────────────────────────────────────── */
function StepScope() {
  const [urgency, setUrgency] = useState("High");
  const [workTypes, setWorkTypes] = useState(["Inspection", "Diagnostic testing"]);
  const [outage, setOutage] = useState("Yes — planned outage");

  const workTypeOpts = [
    "Inspection", "Diagnostic testing", "Condition assessment", "Repair / replacement",
    "Parts installation", "Commissioning", "Monitoring setup", "Documentation / report",
  ];
  const outageOpts = ["Yes — planned outage", "No — live working", "Partial outage"];

  return (
    <div className="flex flex-col gap-4 px-5 pt-4 pb-1">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">STEP 2 OF 5</p>
        <h3 className="text-2xl text-gray-900 mb-1 font-patrick-hand">Scope & access</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          What work is needed and what site constraints apply? The system has suggested scope based on the open field signals on this account.
        </p>
      </div>
      <InfoBanner
        title="Scope pre-suggested from field signals"
        sub="recurring PD on S-12 (3rd occurrence) · DGA trend on S-11 · 3 units uninspected."
      />

      {/* Urgency */}
      <div>
        <label className="text-xs text-gray-500 mb-2 block">Urgency</label>
        <div className="flex gap-2 flex-wrap">
          {["Critical", "High", "Medium", "Low"].map((u) => (
            <button
              key={u}
              onClick={() => setUrgency(u)}
              className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-colors ${
                urgency === u ? "bg-black text-white" : "border border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Work types needed */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">
          Work types needed <span className="text-gray-400">*</span>
        </label>
        <p className="text-xs text-gray-400 mb-2">Select all that apply — pre-selected based on field signals</p>
        <div className="flex flex-wrap gap-2">
          {workTypeOpts.map((w) => {
            const active = workTypes.includes(w);
            return (
              <button
                key={w}
                onClick={() => setWorkTypes((p) => (active ? p.filter((x) => x !== w) : [...p, w]))}
                className={`px-3.5 py-2 rounded-full text-sm cursor-pointer transition-colors ${
                  active ? "bg-black text-white" : "border border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {w}
              </button>
            );
          })}
        </div>
      </div>

      {/* Outage required */}
      <div>
        <label className="text-xs text-gray-500 mb-2 block">Outage required?</label>
        <div className="flex gap-2 flex-wrap">
          {outageOpts.map((o) => (
            <button
              key={o}
              onClick={() => setOutage(o)}
              className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-colors ${
                outage === o ? "bg-black text-white" : "border border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* Outage window */}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Outage window</label>
        <p className="text-xs text-gray-400 mb-2">When can the customer grant access? Any restricted periods?</p>
        <textarea
          placeholder="e.g. Weekdays 06:00–14:00 · 4-week customer notice required"
          className="w-full h-20 px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 resize-none bg-white placeholder-gray-300"
        />
      </div>
    </div>
  );
}

/* ── Step 3: Staffing ────────────────────────────────────────────── */
interface StaffMember {
  id: string;
  name: string;
  role: string;
  skills: string;
  avail: string;
  img: string;
  conflict?: boolean;
}

const STAFF_DIRECTORY: Record<string, StaffMember> = {
  sara: { id: "sara", name: "Sara B.", role: "Field technician", skills: "HV competent", avail: "Available from 18 Aug", img: "https://i.pravatar.cc/100?img=5" },
  dev: { id: "dev", name: "Dev K.", role: "Commissioning engineer", skills: "HVDC commissioning · IEC 62271", avail: "Available from 25 Aug", img: "https://i.pravatar.cc/100?img=12" },
  liam: { id: "liam", name: "Liam O.", role: "Field technician", skills: "HV competent · Lifting supervisor", avail: "Committed until 24 Aug", conflict: true, img: "https://i.pravatar.cc/100?img=13" },
  jordan: { id: "jordan", name: "Jordan P.", role: "Lead engineer", skills: "HV authorised · DGA certified", avail: "Available · no conflicts", img: "https://i.pravatar.cc/100?img=14" },
  tom: { id: "tom", name: "Tom H.", role: "Reliability engineer", skills: "PD testing · Power factor", avail: "Available from 19 Aug", img: "https://i.pravatar.cc/100?img=15" },
  kara: { id: "kara", name: "Kara M.", role: "HSE officer", skills: "Offshore BOSIET · Confined space", avail: "Available — no conflicts", img: "https://i.pravatar.cc/100?img=9" },
};

function StaffCard({
  member,
  list,
  index,
  onDragStart,
  onDragOver,
  onDrop,
  dragging,
}: {
  member: StaffMember;
  list: "staffed" | "alt";
  index: number;
  onDragStart: (list: "staffed" | "alt", index: number) => void;
  onDragOver: (e: React.DragEvent, list: "staffed" | "alt", index: number) => void;
  onDrop: (list: "staffed" | "alt", index: number) => void;
  dragging: boolean;
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(list, index)}
      onDragOver={(e) => onDragOver(e, list, index)}
      onDrop={() => onDrop(list, index)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-white transition-all cursor-grab active:cursor-grabbing ${
        member.conflict ? "border-gray-300 bg-gray-50" : "border-gray-200"
      } ${dragging ? "opacity-40 border-dashed" : "hover:border-gray-300"}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={member.img}
        alt={member.name}
        className="w-9 h-9 rounded-full object-cover bg-gray-200 shrink-0 grayscale"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800">
          {member.name} <span className="text-gray-400">· {member.role}</span>
        </p>
        <p className="text-xs text-gray-500">{member.skills}</p>
        <p className={`text-xs ${member.conflict ? "text-gray-700 font-medium" : "text-gray-400"}`}>{member.avail}</p>
      </div>
      <GripVertical size={16} className="text-gray-300 shrink-0" />
    </div>
  );
}

function StepStaffing() {
  const [staffed, setStaffed] = useState<string[]>(["sara", "dev", "liam"]);
  const [alt, setAlt] = useState<string[]>(["jordan", "tom", "kara"]);
  const drag = useRef<{ list: "staffed" | "alt"; index: number } | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const getList = (list: "staffed" | "alt") => (list === "staffed" ? staffed : alt);
  const setList = (list: "staffed" | "alt", next: string[]) =>
    list === "staffed" ? setStaffed(next) : setAlt(next);

  const onDragStart = (list: "staffed" | "alt", index: number) => {
    drag.current = { list, index };
    setDraggingId(getList(list)[index]);
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const move = (toList: "staffed" | "alt", toIndex: number) => {
    const from = drag.current;
    if (!from) return;
    const fromArr = [...getList(from.list)];
    const [moved] = fromArr.splice(from.index, 1);
    if (moved == null) return;

    if (from.list === toList) {
      const insertAt = toIndex > from.index ? toIndex - 1 : toIndex;
      fromArr.splice(insertAt, 0, moved);
      setList(toList, fromArr);
    } else {
      const toArr = [...getList(toList)];
      toArr.splice(toIndex, 0, moved);
      setList(from.list, fromArr);
      setList(toList, toArr);
    }
    drag.current = null;
    setDraggingId(null);
  };

  const dropZoneProps = (list: "staffed" | "alt") => ({
    onDragOver,
    onDrop: () => move(list, getList(list).length),
  });

  const renderList = (list: "staffed" | "alt") =>
    getList(list).map((id, index) => (
      <StaffCard
        key={id}
        member={STAFF_DIRECTORY[id]}
        list={list}
        index={index}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={(l, i) => move(l, i)}
        dragging={draggingId === id}
      />
    ));

  return (
    <div className="flex flex-col gap-4 px-5 pt-4 pb-1">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">STEP 3 OF 5</p>
        <h3 className="text-2xl text-gray-900 mb-1 font-patrick-hand">Staffing</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          The system has checked availability and suggested the best-fit crew for this case type, scope, and site requirements. Confirm, swap, or add.
        </p>
      </div>
      <InfoBanner
        title="Suggested from availability calendar and certification database."
        sub="1 conflict detected — review below."
      />

      {/* Staffed */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Staffed</p>
        <div className="flex flex-col gap-2 min-h-[8px]" {...dropZoneProps("staffed")}>
          {renderList("staffed")}
        </div>
      </div>

      {/* Alternative Staff */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Alternative Staff</p>
        <div className="flex flex-col gap-2 min-h-[8px]" {...dropZoneProps("alt")}>
          {renderList("alt")}
        </div>
      </div>

      {/* Add specialist */}
      <Button variant="outline" className="self-start gap-1.5 rounded-full h-auto px-4 py-2 text-sm text-gray-600 cursor-pointer">
        <Plus size={14} /> Add specialist or sub-contractor not in system
      </Button>
    </div>
  );
}

/* ── Step 4: Parts & Materials ───────────────────────────────────── */
type StockKind = "in" | "low" | "out";

interface Part {
  name: string;
  code: string;
  qty: string;
  supplier: string;
  stock: string;
  stockKind: StockKind;
  lead: string;
}

function StockBadge({ kind, label }: { kind: StockKind; label: string }) {
  const cls =
    kind === "out"
      ? "bg-gray-900 text-white"
      : kind === "low"
      ? "bg-gray-200 text-gray-700"
      : "bg-gray-100 text-gray-600";
  return <span className={`text-xs px-2 py-1 rounded-md whitespace-nowrap ${cls}`}>{label}</span>;
}

const INITIAL_PARTS: Part[] = [
  { name: "HVDC bushing assembly 400kV", code: "ERP-9921", qty: "3", supplier: "ABB Components", stock: "In stock (3)", stockKind: "in", lead: "Ready" },
  { name: "Insulating oil (inhibited) 25L drums", code: "ERP-4417", qty: "8", supplier: "Nynas AB", stock: "In stock (12)", stockKind: "in", lead: "Ready" },
  { name: "DGA sampling kit + reagents", code: "ERP-1104", qty: "3", supplier: "Internal stores", stock: "In stock (5)", stockKind: "in", lead: "Ready" },
  { name: "High-voltage cable terminations", code: "ERP-7783", qty: "6", supplier: "Nexans", stock: "Low (2)", stockKind: "low", lead: "14d" },
  { name: "Transformer gasket set (custom)", code: "ERP-2288", qty: "3", supplier: "Special order – Hitachi factory", stock: "Out of stock", stockKind: "out", lead: "35d" },
  { name: "Nitrogen blanket supply (cylinders)", code: "ERP-5530", qty: "4", supplier: "Air Liquide local depot", stock: "In stock (10)", stockKind: "in", lead: "Ready" },
];

function StepParts() {
  const [parts, setParts] = useState<Part[]>(INITIAL_PARTS);

  const setQty = (i: number, qty: string) =>
    setParts((prev) => prev.map((p, idx) => (idx === i ? { ...p, qty } : p)));
  const removePart = (i: number) => setParts((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-4 px-5 pt-4 pb-1">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">STEP 4 OF 5</p>
        <h3 className="text-2xl text-gray-900 mb-1 font-patrick-hand">Parts & materials</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          The system has checked ERP inventory for parts required based on the asset type and scope. Review stock status, override quantities, or add items.
        </p>
      </div>

      {/* Summary + warning alerts */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <Info size={15} className="text-gray-400 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 leading-snug">
            4 parts in stock · 1 low stock · 1 to order · Longest lead time: 35 days
          </p>
        </div>
        <div className="flex gap-3 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3">
          <AlertTriangle size={15} className="text-gray-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-800 leading-snug">Gasket set has a 35-day lead time. Order must be placed today to meet the schedule.</p>
            <p className="text-sm text-gray-500 leading-snug">Purchase order not yet raised.</p>
          </div>
        </div>
      </div>

      {/* Parts table */}
      <div>
        {/* Head */}
        <div className="grid grid-cols-[1fr_auto_96px_92px_48px_28px] gap-x-3 px-1 pb-2 border-b border-gray-200 items-center">
          <span className="text-[11px] text-gray-400 uppercase tracking-wider">Part</span>
          <span className="text-[11px] text-gray-400 uppercase tracking-wider">Qty</span>
          <span className="text-[11px] text-gray-400 uppercase tracking-wider">Supplier</span>
          <span className="text-[11px] text-gray-400 uppercase tracking-wider">ERP stock</span>
          <span className="text-[11px] text-gray-400 uppercase tracking-wider">Lead</span>
          <span className="text-[11px] text-gray-400 uppercase tracking-wider text-right">OK</span>
        </div>
        {/* Rows */}
        {parts.map((p, i) => (
          <div
            key={p.code}
            className="grid grid-cols-[1fr_auto_96px_92px_48px_28px] gap-x-3 px-1 py-3 items-center border-b border-gray-100"
          >
            <div className="min-w-0">
              <p className="text-sm text-gray-800 truncate">{p.name}</p>
              <p className="text-xs text-gray-400">{p.code}</p>
            </div>
            <input
              value={p.qty}
              onChange={(e) => setQty(i, e.target.value)}
              className="w-9 h-8 text-center text-sm text-gray-800 border border-gray-200 rounded-lg outline-none focus:border-gray-400"
            />
            <span className="text-xs text-gray-500 truncate">{p.supplier}</span>
            <StockBadge kind={p.stockKind} label={p.stock} />
            <span className={`text-xs ${p.stockKind === "out" ? "text-gray-900 font-medium" : p.stockKind === "low" ? "text-gray-600" : "text-gray-400"}`}>
              {p.lead}
            </span>
            <button
              onClick={() => removePart(i)}
              className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-gray-600 transition-colors cursor-pointer justify-self-end"
              aria-label={`Remove ${p.name}`}
            >
              <X size={15} strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>

      {/* Add part */}
      <Button variant="outline" className="self-start gap-1.5 rounded-full h-auto px-4 py-2 text-sm text-gray-600 cursor-pointer">
        <Plus size={14} /> Add part not in ERP
      </Button>

      {/* Notes */}
      <div>
        <label className="text-xs text-gray-500 mb-2 block">Any parts requiring customer sign-off or import clearance?</label>
        <textarea
          placeholder="Note any special handling, customer PO requirements, or customs declarations..."
          className="w-full h-20 px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 resize-none bg-white placeholder-gray-300"
        />
      </div>
    </div>
  );
}

/* ── Step 5: Schedule ────────────────────────────────────────────── */
type EventType = "inspection" | "parts" | "field" | "report";

const EVENT_TYPES: { type: EventType; label: string; color: string }[] = [
  { type: "inspection", label: "Inspection", color: "#111827" },
  { type: "parts", label: "Parts delivery", color: "#6B7280" },
  { type: "field", label: "Field work", color: "#9CA3AF" },
  { type: "report", label: "First report", color: "#D1D5DB" },
];
const COLOR_OF: Record<EventType, string> = {
  inspection: "#111827",
  parts: "#6B7280",
  field: "#9CA3AF",
  report: "#D1D5DB",
};

interface CalEvent {
  id: string;
  label: string;
  type: EventType;
  day: number; // date within August
}

const INITIAL_EVENTS: CalEvent[] = [
  { id: "e1", label: "Inspection visit", type: "inspection", day: 6 },
  { id: "e2", label: "Priya N. on site", type: "field", day: 6 },
  { id: "e3", label: "Tom H. on site", type: "field", day: 6 },
  { id: "e4", label: "Inspection visit", type: "inspection", day: 22 },
  { id: "e5", label: "Priya N. on site", type: "field", day: 22 },
  { id: "e6", label: "Tom H. on site", type: "field", day: 22 },
  { id: "e7", label: "Inspection (S-14)", type: "inspection", day: 23 },
  { id: "e8", label: "Kara M. on site", type: "field", day: 23 },
];

// August 2026 starts on a Saturday → Monday-first grid leads with Jul 27–31.
interface Cell {
  label: number;
  inMonth: boolean;
}
const CALENDAR_CELLS: Cell[] = [
  ...[27, 28, 29, 30, 31].map((d) => ({ label: d, inMonth: false })),
  ...Array.from({ length: 31 }, (_, i) => ({ label: i + 1, inMonth: true })),
  ...[1, 2, 3, 4, 5, 6].map((d) => ({ label: d, inMonth: false })),
];

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function StepSchedule() {
  const [events, setEvents] = useState<CalEvent[]>(INITIAL_EVENTS);
  const dragId = useRef<string | null>(null);
  const [overDay, setOverDay] = useState<number | null>(null);

  const moveEvent = (day: number) => {
    const id = dragId.current;
    if (id == null) return;
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, day } : e)));
    dragId.current = null;
    setOverDay(null);
  };

  return (
    <div className="flex flex-col gap-4 px-5 pt-4 pb-1">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">STEP 5 OF 5</p>
        <h3 className="text-2xl text-gray-900 mb-1 font-patrick-hand">Schedule</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Milestones auto-placed from parts lead times and crew availability. Drag any event to change its date. Conflicts flagged in real time.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {EVENT_TYPES.map((t) => (
          <span key={t.type} className="flex items-center gap-2 text-xs text-gray-600">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: t.color }} />
            {t.label}
          </span>
        ))}
      </div>

      {/* Calendar */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {/* Nav */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
          <button className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer">
            <ChevronLeft size={14} />
          </button>
          <span className="text-sm text-gray-800">August 2026</span>
          <button className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer">
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-[10px] text-gray-400 text-center py-1.5">{d}</div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7">
          {CALENDAR_CELLS.map((cell, i) => {
            const dayEvents = cell.inMonth ? events.filter((e) => e.day === cell.label) : [];
            const isOver = cell.inMonth && overDay === cell.label;
            return (
              <div
                key={i}
                onDragOver={(e) => {
                  if (!cell.inMonth) return;
                  e.preventDefault();
                  setOverDay(cell.label);
                }}
                onDragLeave={() => cell.inMonth && setOverDay((d) => (d === cell.label ? null : d))}
                onDrop={() => cell.inMonth && moveEvent(cell.label)}
                className={`min-h-[76px] border-b border-r border-gray-100 p-1 ${
                  i % 7 === 6 ? "border-r-0" : ""
                } ${isOver ? "bg-gray-100" : ""}`}
              >
                <div className={`text-[11px] px-1 ${cell.inMonth ? "text-gray-600" : "text-gray-300"}`}>
                  {cell.label}
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      draggable
                      onDragStart={() => (dragId.current = ev.id)}
                      title={ev.label}
                      className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded px-1 py-0.5 cursor-grab active:cursor-grabbing hover:border-gray-300 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COLOR_OF[ev.type] }} />
                      <span className="text-[10px] text-gray-600 truncate">{ev.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Wizard card (rendered as an AI message) ─────────────────────── */
function WizardCard({
  step,
  onContinue,
  onBack,
  onGenerate,
}: {
  step: number;
  onContinue: () => void;
  onBack: () => void;
  onGenerate: () => void;
}) {
  const isLast = step === 5;
  const isFirst = step === 1;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <StepTabs current={step} />

      {/* Step content — cross-fades when the step changes */}
      <div key={step} className="animate-step-in">
        {step === 1 && <StepCase />}
        {step === 2 && <StepScope />}
        {step === 3 && <StepStaffing />}
        {step === 4 && <StepParts />}
        {step === 5 && <StepSchedule />}
      </div>

      {/* Footer — Back (left) once past the first step, Continue (right) until the last */}
      {(!isFirst || !isLast) && (
        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
          {!isFirst ? (
            <Button variant="outline" onClick={onBack} className="gap-1.5 rounded-full h-auto px-5 py-2 text-sm text-gray-600 cursor-pointer">
              <ChevronLeft size={14} />
              Back
            </Button>
          ) : (
            <span />
          )}
          {isLast ? (
            <Button onClick={onGenerate} className="rounded-full h-auto px-6 py-2 text-sm cursor-pointer">
              Generate
            </Button>
          ) : (
            <Button onClick={onContinue} className="rounded-full h-auto px-6 py-2 text-sm cursor-pointer">
              Continue
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Context card (widget-launched conversations) ────────────────── */
function ContextCard({ context }: { context: string }) {
  return (
    <div className="mb-5 animate-message-in flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
        <BarChart2 size={15} strokeWidth={1.5} className="text-gray-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider">Context</p>
        <p className="text-sm text-gray-800 truncate">{context}</p>
      </div>
    </div>
  );
}

/* ── AI avatar ───────────────────────────────────────────────────── */
function AiAvatar() {
  return (
    <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center shrink-0 mt-0.5">
      <Sparkles size={14} strokeWidth={1.5} className="text-gray-600" />
    </div>
  );
}

function SourcesLine() {
  return (
    <p className="text-xs text-gray-400">
      Sources:{" "}
      <span className="underline cursor-pointer hover:text-gray-600 transition-colors">APM</span>
      {", "}
      <span className="underline cursor-pointer hover:text-gray-600 transition-colors">Relcare</span>
      {", "}
      <span className="underline cursor-pointer hover:text-gray-600 transition-colors">Data Hub</span>
    </p>
  );
}

/* ── Chat thread ─────────────────────────────────────────────────── */
export interface ChatMsg {
  id: number;
  role: "user" | "ai";
  kind?: "text" | "wizard";
  text?: string;
}

/** A conversation saved to the panel so it can be revisited. */
export interface StoredConversation {
  id: string;
  title: string;
  preview: string;
  date: string;
  context?: string;
  detectedCustomer?: string | null;
  messages: ChatMsg[];
  /** For seed conversations with no thread yet: the prompt to run on open. */
  seedPrompt?: string;
}

interface ThreadProps {
  messages: ChatMsg[];
  typing: boolean;
  context?: string;
  wizardStep: number;
  onWizardStep: (n: number) => void;
  onGenerate: () => void;
}

export function ChatThread({ messages, typing, context, wizardStep, onWizardStep, onGenerate }: ThreadProps) {
  return (
    <>
      {/* Widget context pinned to the top */}
      {context && <ContextCard context={context} />}

      {messages.map((m) =>
        m.role === "user" ? (
          <div key={m.id} className="flex items-start gap-3 mb-5 animate-message-in">
            <div className="flex-1 bg-white border border-gray-100 rounded-2xl px-4 py-3">
              <p className="text-sm text-gray-800 whitespace-pre-line">{m.text}</p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://i.pravatar.cc/100?img=68"
              alt="Jan V."
              className="w-8 h-8 rounded-full object-cover bg-gray-200 shrink-0 mt-0.5 grayscale"
            />
          </div>
        ) : m.kind === "wizard" ? (
          <div key={m.id} className="mb-8">
            <div className="flex items-start gap-3 mb-2 animate-message-in">
              <AiAvatar />
              <div className="flex-1 min-w-0">
                <WizardCard
                  step={wizardStep}
                  onContinue={() => onWizardStep(Math.min(5, wizardStep + 1))}
                  onBack={() => onWizardStep(Math.max(1, wizardStep - 1))}
                  onGenerate={onGenerate}
                />
              </div>
            </div>
            <div className="ml-11">
              <SourcesLine />
            </div>
          </div>
        ) : (
          <div key={m.id} className="flex items-start gap-3 mb-5 animate-message-in">
            <AiAvatar />
            <div className="flex-1 min-w-0">
              <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{m.text}</p>
              </div>
              <div className="mt-2 ml-1">
                <SourcesLine />
              </div>
            </div>
          </div>
        )
      )}

      {typing && <TypingBubble />}
    </>
  );
}
