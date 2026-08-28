/* ── Sales persona data ──────────────────────────────────────────── */

export interface FleetPoint {
  t: number;
  avg: number;
  std: number;
}
export const FLEET_HEALTH: { past: number; today: number; change: number; points: FleetPoint[] } = {
  past: 83,
  today: 71,
  change: -12,
  points: [
    { t: 0, avg: 82, std: 80 },
    { t: 1, avg: 86, std: 80 },
    { t: 2, avg: 88, std: 79 },
    { t: 3, avg: 84, std: 78 },
    { t: 4, avg: 76, std: 77 },
    { t: 5, avg: 68, std: 75 },
    { t: 6, avg: 62, std: 73 },
    { t: 7, avg: 66, std: 72 },
    { t: 8, avg: 72, std: 71 },
    { t: 9, avg: 71, std: 71 },
    { t: 10, avg: 71, std: 71 },
    { t: 11, avg: 71, std: 71 },
  ],
};

export type AssetStatus = "critical" | "at-risk";
export type AssetCategory =
  | "asset-health" | "risk-building" | "offer-readiness" | "missing-info"
  // Diagnostics — asset report review categories
  | "dga" | "electrical" | "physical"
  // Reliability — engineering review categories
  | "scope-feasibility" | "design" | "site" | "standards";
export interface AssetAlert {
  id: string;
  code: string;
  location: string;
  health: number;
  status: AssetStatus;
  category: AssetCategory;
  alert?: { title: string; detail: string; action: string };
}
export const ASSET_ALERTS: AssetAlert[] = [
  {
    id: "ast-001",
    code: "AST-001",
    location: "Zone A • Pump Station 1",
    health: 24,
    status: "critical",
    category: "asset-health",
    alert: {
      title: "Potential overheating",
      detail:
        "Sensors are recording degraded transformer performance across multiple substations, indicating potential overheating and insulation wear that require immediate diagnostic review.",
      action: "Schedule inspection",
    },
  },
  {
    id: "ast-002",
    code: "AST-002",
    location: "Zone A • Pump Station 1",
    health: 31,
    status: "critical",
    category: "risk-building",
    alert: {
      title: "Third bearing failure in six months",
      detail:
        "A repeat-repair pattern — seal replacement, bearing inspection and motor vibration checks in the last two quarters. The failure interval is shortening, which typically signals end-of-life rather than isolated faults.",
      action: "Create work order",
    },
  },
  {
    id: "ast-003",
    code: "AST-003",
    location: "Zone B • Pump Station 3",
    health: 52,
    status: "at-risk",
    category: "offer-readiness",
    alert: {
      title: "Oil temperature trending above threshold",
      detail:
        "Top-oil temperature has climbed for three consecutive weeks and is now 8°C over the rated limit under load. Not yet critical, but the trajectory warrants a cooling-system check.",
      action: "Order parts",
    },
  },
  {
    id: "ast-004",
    code: "AST-004",
    location: "Zone A • Substation 2",
    health: 58,
    status: "at-risk",
    category: "missing-info",
    alert: {
      title: "Vibration above baseline",
      detail:
        "Vibration on the tap-changer drive is 20% above the commissioning baseline. Recommend a technician inspection before it affects switching reliability.",
      action: "Assign technician",
    },
  },
];

/* ── Asset detail drawer ─────────────────────────────────────────── */
export interface AssetReading {
  label: string;
  value: string;
  state: "ok" | "watch" | "alert";
}
export interface AssetDetail {
  code: string;
  type: string;
  location: string;
  stats: { healthPct: number; status: string; commissioned: string; lastService: string };
  contextSummary: string;
  recommendedActions: string[];
  readings: AssetReading[];
  maintenance: { label: string; date: string }[];
  risks: { title: string; detail: string; level: "Critical" | "High" | "Medium" }[];
  related: { customer: string; contract: string; station: string };
}

export const ASSET_DETAILS: Record<string, AssetDetail> = {
  "ast-001": {
    code: "AST-001",
    type: "Power transformer · 40 MVA",
    location: "Zone A · Pump Station 1",
    stats: { healthPct: 24, status: "Critical", commissioned: "2009", lastService: "12 Jun 2026" },
    contextSummary:
      "AST-001 is showing degraded thermal performance across multiple substations, consistent with insulation wear. Health has fallen to 24% and DGA gas levels are elevated — an immediate diagnostic is warranted before load increases in the autumn peak.",
    recommendedActions: ["Schedule inspection", "Order cooling parts", "Escalate to reliability"],
    readings: [
      { label: "Top-oil temperature", value: "96°C (+14 over rated)", state: "alert" },
      { label: "Dissolved gas (H₂)", value: "480 ppm", state: "alert" },
      { label: "Load factor", value: "0.82", state: "watch" },
      { label: "Winding insulation", value: "Degrading", state: "watch" },
    ],
    maintenance: [
      { label: "Thermal scan — hotspot flagged", date: "2026-06-12" },
      { label: "Oil sample / DGA", date: "2026-04-02" },
      { label: "Bushing replacement", date: "2025-11-18" },
    ],
    risks: [
      { title: "Insulation failure risk within the peak window", detail: "At current degradation, thermal margin is exhausted by the autumn load peak.", level: "Critical" },
      { title: "Unplanned outage exposure — $0.9M", detail: "AST-001 feeds two pump lines with no standby capacity.", level: "High" },
    ],
    related: { customer: "ComEd", contract: "ComEd — 5-year Service Agreement", station: "Pump Station 1, Zone A" },
  },
  "ast-002": {
    code: "AST-002",
    type: "Power transformer · 40 MVA",
    location: "Zone A · Pump Station 1",
    stats: { healthPct: 31, status: "Critical", commissioned: "2011", lastService: "18 Aug 2026" },
    contextSummary:
      "AST-002 is a repeat-repair asset — three interventions in six months with a shortening failure interval. The pattern points to end-of-life rather than isolated faults, and the cumulative repair spend is approaching replacement cost.",
    recommendedActions: ["Create work order", "Request replacement quote", "Assign technician"],
    readings: [
      { label: "Bearing vibration", value: "7.1 mm/s (alarm)", state: "alert" },
      { label: "Repairs (6 mo)", value: "3", state: "alert" },
      { label: "Top-oil temperature", value: "78°C", state: "watch" },
      { label: "Load factor", value: "0.74", state: "ok" },
    ],
    maintenance: [
      { label: "Motor vibration check", date: "2026-08-14" },
      { label: "Bearing inspection", date: "2025-11-02" },
      { label: "Seal replacement", date: "2026-01-18" },
    ],
    risks: [
      { title: "Recurring bearing failure", detail: "Interval down from 90 to 40 days; next failure likely within the quarter.", level: "High" },
      { title: "Repair spend nearing replacement cost", detail: "Cumulative repairs at ~70% of a like-for-like swap.", level: "Medium" },
    ],
    related: { customer: "ComEd", contract: "ComEd — 5-year Service Agreement", station: "Pump Station 1, Zone A" },
  },
  "ast-003": {
    code: "AST-003",
    type: "Power transformer · 25 MVA",
    location: "Zone B · Pump Station 3",
    stats: { healthPct: 52, status: "At Risk", commissioned: "2013", lastService: "05 Jul 2026" },
    contextSummary:
      "AST-003's top-oil temperature has trended up for three consecutive weeks and now sits 8°C over the rated limit under load. Health is 52% and declining; a cooling-system check should catch it before it crosses into critical.",
    recommendedActions: ["Order parts", "Schedule cooling check", "Add to watch list"],
    readings: [
      { label: "Top-oil temperature", value: "88°C (+8 over rated)", state: "watch" },
      { label: "Cooling-fan status", value: "1 of 4 degraded", state: "watch" },
      { label: "Dissolved gas (H₂)", value: "180 ppm", state: "ok" },
      { label: "Load factor", value: "0.69", state: "ok" },
    ],
    maintenance: [
      { label: "Cooling-fan service", date: "2026-07-05" },
      { label: "Oil sample / DGA", date: "2026-05-20" },
    ],
    risks: [
      { title: "Cooling capacity shortfall", detail: "One fan degraded; a second failure would push temperatures into the alert band.", level: "Medium" },
    ],
    related: { customer: "NV Energy", contract: "NV Energy — Service Agreement", station: "Pump Station 3, Zone B" },
  },
  "ast-004": {
    code: "AST-004",
    type: "Power transformer · 25 MVA",
    location: "Zone A · Substation 2",
    stats: { healthPct: 58, status: "At Risk", commissioned: "2014", lastService: "22 Jun 2026" },
    contextSummary:
      "AST-004's tap-changer drive is vibrating 20% above the commissioning baseline. Health is 58% and stable, but the trend could affect switching reliability if left unchecked — a technician inspection is the right next step.",
    recommendedActions: ["Assign technician", "Schedule inspection", "Add to watch list"],
    readings: [
      { label: "Tap-changer vibration", value: "+20% vs baseline", state: "watch" },
      { label: "Operations count", value: "18,400", state: "ok" },
      { label: "Top-oil temperature", value: "71°C", state: "ok" },
      { label: "Load factor", value: "0.61", state: "ok" },
    ],
    maintenance: [
      { label: "Tap-changer service", date: "2026-06-22" },
      { label: "Contact resistance test", date: "2026-03-30" },
    ],
    risks: [
      { title: "Switching reliability drift", detail: "Vibration trend may accelerate contact wear on the tap-changer.", level: "Medium" },
    ],
    related: { customer: "AEP Ohio", contract: "AEP Ohio — Service Agreement", station: "Substation 2, Zone A" },
  },
};

/* ── Asset condition monitoring (APM-style visuals) ──────────────── */
export interface AgingData {
  age: number;           // years
  manufacturerLife: number;
  customerLife: number;
  scaleMax: number;
}
export interface ScoreFactor {
  factor: string;
  pctOfMax: number;      // 0–100
  value: number;
}
export interface RiskSummary {
  importance: number;    // 0–100
  condition: number;     // 0–100 (lower = worse)
  replacementRank: number;
  replacementOf: number;
  lastUpdate: string;
}
export interface ConditionPoint {
  date: string;
  dielectric: number;
  mechanical: number;
  other: number;
  wear: number;
}
export interface ParameterPoint {
  date: string;
  value: number;
}
export interface ParameterRow {
  factor: string;
  name: string;
  unit: string;
  prev: string;
  current: string;
  up: boolean;
}
export interface BulletMetric {
  label: string;
  value: number;
  warning: number;
  alarm: number;
  max: number;
}
export interface PhasePoint {
  date: string;
  a: number;
  b: number;
  c: number;
}
export interface AssetDiagnostics {
  operations: BulletMetric[];
  contactWear: { series: PhasePoint[]; warning: number; alert: number };
  sf6Pressure?: { unit: string; series: PhasePoint[]; informational: number; warning: number };
  sf6Moisture?: { unit: string; series: PhasePoint[]; warning: number; alert: number };
}
export interface AssetCondition {
  aging: AgingData;
  scoreFactors: ScoreFactor[];
  scoreTotal: number;
  risk: RiskSummary;
  conditionTrend: ConditionPoint[];
  conditionTotals: { dielectric: number; mechanical: number; other: number; wear: number };
  parameterTrend: ParameterPoint[];
  parameterRows: ParameterRow[];
  diagnostics?: AssetDiagnostics;
}

const COND_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function conditionSeries(dielectricBase: number, wearBase: number): ConditionPoint[] {
  const dWave = [0, -0.2, -1.6, 0.4, -0.9, -0.3, -0.2, 0.7, -1.1, 1.0, 0.6, -2.4];
  const wWave = [0, 0.4, -1.0, 0.6, -0.3, 0.1, 0.2, 1.3, -0.4, 1.1, 0.3, -1.8];
  return COND_MONTHS.map((date, i) => ({
    date,
    dielectric: Math.max(0, +(dielectricBase + dWave[i]).toFixed(2)),
    mechanical: 0,
    other: 0,
    wear: Math.max(0, +(wearBase + wWave[i]).toFixed(2)),
  }));
}

function paramSeries(vals: number[]): ParameterPoint[] {
  return COND_MONTHS.map((date, i) => ({ date, value: vals[i] }));
}

function phaseSeries(base: number[], spread: number, points: number): PhasePoint[] {
  // Deterministic pseudo-random phases around a shared trend.
  const dates = ["1/24", "2/21", "3/20", "4/17", "5/15", "6/12", "7/9", "8/6", "9/3", "10/1", "10/29", "11/26", "12/24"];
  return Array.from({ length: points }, (_, i) => {
    const t = base[i % base.length];
    const j = (i * 7) % 5;
    return {
      date: dates[i % dates.length],
      a: +(t + (j - 2) * spread * 0.4).toFixed(1),
      b: +(t + ((j + 2) % 5 - 2) * spread * 0.5).toFixed(1),
      c: +(t + ((j + 4) % 5 - 2) * spread * 0.45).toFixed(1),
    };
  });
}

// Sawtooth contact-wear (I²t) — resets after each maintenance.
function wearSawtooth(): PhasePoint[] {
  const raw = [2, 6, 10, 16, 18, 24, 31, 33, 40, 45, 70, 105, 2, 5, 9, 14, 18, 26, 32, 36, 42, 46, 51, 2, 4, 8, 11, 15, 19, 25, 30, 34, 45, 52, 2, 4, 9, 11, 15];
  return raw.map((v, i) => ({
    date: `p${i}`,
    a: v,
    b: +(v + (i % 3 === 0 ? 1 : -1)).toFixed(0),
    c: +(v + (i % 2 === 0 ? -1 : 1.5)).toFixed(0),
  }));
}

export const ASSET_CONDITION: Record<string, AssetCondition> = {
  "ast-001": {
    aging: { age: 25.7, manufacturerLife: 20, customerLife: 25, scaleMax: 29 },
    scoreFactors: [
      { factor: "Financial", pctOfMax: 100, value: 20.0 },
      { factor: "Importance", pctOfMax: 90, value: 18.0 },
      { factor: "Age", pctOfMax: 60, value: 12.0 },
      { factor: "Degradation", pctOfMax: 39.1, value: 7.8 },
      { factor: "Obsolescence", pctOfMax: 0, value: 0.0 },
    ],
    scoreTotal: 57.8,
    risk: { importance: 90, condition: 39.1, replacementRank: 1, replacementOf: 10, lastUpdate: "9 days ago" },
    conditionTrend: conditionSeries(21.5, 13.5),
    conditionTotals: { dielectric: 19.74, mechanical: 0.0, other: 0.0, wear: 19.41 },
    parameterTrend: paramSeries([9, 9, 8, 9, 8, 10, 8, 9, 7, 8, 7, 8]),
    parameterRows: [
      { factor: "Wear", name: "Number of Fault Operations", unit: "", prev: "7.0", current: "8.0", up: true },
      { factor: "Wear", name: "Number of Total Operations", unit: "", prev: "1,800.0", current: "1,850.0", up: true },
      { factor: "Mechanical", name: "Close Time P1", unit: "milliseconds", prev: "36.0", current: "54.0", up: true },
      { factor: "Mechanical", name: "Open Time P1", unit: "milliseconds", prev: "22.0", current: "24.0", up: true },
      { factor: "Dielectric", name: "SF₆ Moisture P1", unit: "ppm", prev: "465.0", current: "538.0", up: true },
    ],
    diagnostics: {
      operations: [
        { label: "Total Operations", value: 1850, warning: 1600, alarm: 2000, max: 2200 },
        { label: "Fault Operations", value: 8, warning: 4, alarm: 5, max: 9 },
      ],
      contactWear: { series: wearSawtooth(), warning: 80, alert: 95 },
      sf6Pressure: {
        unit: "psi",
        informational: 81,
        warning: 78.2,
        series: phaseSeries([85, 86, 84, 87, 85, 86, 84, 86, 85, 86, 84], 3, 12),
      },
      sf6Moisture: {
        unit: "ppm",
        warning: 450,
        alert: 500,
        series: [
          { date: "1/24", a: 500, b: 200, c: 105 },
          { date: "2/21", a: 510, b: 105, c: 105 },
          { date: "3/20", a: 490, b: 120, c: 90 },
          { date: "4/17", a: 600, b: 105, c: 105 },
          { date: "5/15", a: 545, b: 125, c: 95 },
          { date: "6/12", a: 478, b: 108, c: 106 },
          { date: "7/9", a: 450, b: 122, c: 88 },
          { date: "8/6", a: 464, b: 105, c: 104 },
          { date: "9/3", a: 523, b: 123, c: 94 },
          { date: "10/1", a: 447, b: 104, c: 103 },
          { date: "10/29", a: 527, b: 121, c: 89 },
          { date: "11/26", a: 538, b: 100, c: 105 },
        ],
      },
    },
  },
  "ast-002": {
    aging: { age: 22.4, manufacturerLife: 20, customerLife: 25, scaleMax: 29 },
    scoreFactors: [
      { factor: "Financial", pctOfMax: 85, value: 17.0 },
      { factor: "Importance", pctOfMax: 75, value: 15.0 },
      { factor: "Age", pctOfMax: 52, value: 10.4 },
      { factor: "Degradation", pctOfMax: 48, value: 9.6 },
      { factor: "Obsolescence", pctOfMax: 20, value: 4.0 },
    ],
    scoreTotal: 56.0,
    risk: { importance: 75, condition: 46.0, replacementRank: 2, replacementOf: 10, lastUpdate: "4 days ago" },
    conditionTrend: conditionSeries(24, 22),
    conditionTotals: { dielectric: 24.1, mechanical: 6.2, other: 0.0, wear: 22.4 },
    parameterTrend: paramSeries([4, 5, 5, 6, 6, 7, 8, 8, 9, 9, 10, 11]),
    parameterRows: [
      { factor: "Wear", name: "Bearing Vibration", unit: "mm/s", prev: "6.2", current: "7.1", up: true },
      { factor: "Wear", name: "Number of Repairs (6mo)", unit: "", prev: "2.0", current: "3.0", up: true },
      { factor: "Mechanical", name: "Close Time P1", unit: "milliseconds", prev: "41.0", current: "44.0", up: true },
    ],
    diagnostics: {
      operations: [
        { label: "Total Operations", value: 2040, warning: 1600, alarm: 2000, max: 2200 },
        { label: "Fault Operations", value: 6, warning: 4, alarm: 5, max: 9 },
      ],
      contactWear: { series: wearSawtooth(), warning: 80, alert: 95 },
    },
  },
  "ast-003": {
    aging: { age: 13.2, manufacturerLife: 20, customerLife: 25, scaleMax: 29 },
    scoreFactors: [
      { factor: "Financial", pctOfMax: 70, value: 14.0 },
      { factor: "Importance", pctOfMax: 65, value: 13.0 },
      { factor: "Age", pctOfMax: 34, value: 6.8 },
      { factor: "Degradation", pctOfMax: 26, value: 5.2 },
      { factor: "Obsolescence", pctOfMax: 0, value: 0.0 },
    ],
    scoreTotal: 39.0,
    risk: { importance: 65, condition: 62.0, replacementRank: 5, replacementOf: 10, lastUpdate: "2 days ago" },
    conditionTrend: conditionSeries(16, 12),
    conditionTotals: { dielectric: 15.8, mechanical: 0.0, other: 0.0, wear: 12.2 },
    parameterTrend: paramSeries([88, 86, 84, 85, 87, 88, 86, 85, 87, 88, 89, 88]),
    parameterRows: [
      { factor: "Thermal", name: "Top-oil Temperature", unit: "°C", prev: "84.0", current: "88.0", up: true },
      { factor: "Mechanical", name: "Cooling Fans Degraded", unit: "", prev: "0.0", current: "1.0", up: true },
    ],
  },
  "ast-004": {
    aging: { age: 12.1, manufacturerLife: 20, customerLife: 25, scaleMax: 29 },
    scoreFactors: [
      { factor: "Financial", pctOfMax: 62, value: 12.4 },
      { factor: "Importance", pctOfMax: 58, value: 11.6 },
      { factor: "Age", pctOfMax: 31, value: 6.2 },
      { factor: "Degradation", pctOfMax: 21, value: 4.2 },
      { factor: "Obsolescence", pctOfMax: 0, value: 0.0 },
    ],
    scoreTotal: 34.4,
    risk: { importance: 58, condition: 66.0, replacementRank: 7, replacementOf: 10, lastUpdate: "6 days ago" },
    conditionTrend: conditionSeries(14, 10),
    conditionTotals: { dielectric: 13.9, mechanical: 4.8, other: 0.0, wear: 9.7 },
    parameterTrend: paramSeries([12, 13, 14, 15, 16, 17, 18, 18, 19, 20, 20, 21]),
    parameterRows: [
      { factor: "Wear", name: "Tap-changer Vibration", unit: "% vs baseline", prev: "108.0", current: "120.0", up: true },
      { factor: "Wear", name: "Operations Count", unit: "", prev: "18,200.0", current: "18,400.0", up: true },
      { factor: "Mechanical", name: "Contact Resistance", unit: "µΩ", prev: "182.0", current: "191.0", up: true },
    ],
    diagnostics: {
      operations: [
        { label: "Total Operations", value: 18400, warning: 20000, alarm: 24000, max: 26000 },
        { label: "Fault Operations", value: 2, warning: 4, alarm: 5, max: 9 },
      ],
      contactWear: { series: wearSawtooth(), warning: 80, alert: 95 },
    },
  },
};

export interface RepairRow {
  label: string;
  date: string;
}
export interface RepairAsset {
  code: string;
  location: string;
  repairs: RepairRow[];
}
export const REPEATED_REPAIRS: RepairAsset[] = [
  {
    code: "AST-002",
    location: "Zone A • Pump Station 1",
    repairs: [
      { label: "Seal replacement", date: "2026-01-18" },
      { label: "Bearing inspection", date: "2025-11-02" },
      { label: "Motor vibration check", date: "2025-08-14" },
    ],
  },
  {
    code: "AST-014",
    location: "Zone B • Pump Station 3",
    repairs: [
      { label: "Gasket reseal", date: "2026-02-04" },
      { label: "Winding test", date: "2025-12-10" },
      { label: "Oil sample", date: "2025-09-22" },
    ],
  },
  {
    code: "AST-021",
    location: "Zone A • Substation 2",
    repairs: [
      { label: "Bushing replacement", date: "2026-01-29" },
      { label: "Cooling fan swap", date: "2025-10-18" },
      { label: "Thermal scan", date: "2025-07-30" },
    ],
  },
  {
    code: "AST-033",
    location: "Zone C • Pump Station 5",
    repairs: [
      { label: "Tap changer service", date: "2026-02-12" },
      { label: "Relay calibration", date: "2025-11-25" },
      { label: "Vibration check", date: "2025-08-19" },
    ],
  },
];

export interface SlaBadge {
  label: string;
  verified: boolean;
}
export interface SlaRow {
  contractId: string;
  account: string;
  value: string;
  dueIn: string;
  serviceHealth: SlaBadge;
  risk: SlaBadge;
}
export const SLA_PIPELINE: SlaRow[] = [
  { contractId: "sla-comed", account: "ComEd", value: "$4.8M", dueIn: "22d", serviceHealth: { label: "Issues open", verified: false }, risk: { label: "High", verified: false } },
  { contractId: "sla-nv", account: "NV Energy", value: "$2.1M", dueIn: "31d", serviceHealth: { label: "Verified", verified: true }, risk: { label: "Verified", verified: true } },
  { contractId: "sla-aep", account: "AEP Ohio", value: "$6.2M", dueIn: "38d", serviceHealth: { label: "Asset declining", verified: false }, risk: { label: "High", verified: false } },
  { contractId: "sla-pacific", account: "Pacific Gas", value: "$3.9M", dueIn: "44d", serviceHealth: { label: "Verified", verified: true }, risk: { label: "Verified", verified: true } },
  { contractId: "sla-duke", account: "Duke Energy", value: "$5.4M", dueIn: "58d", serviceHealth: { label: "Watch", verified: false }, risk: { label: "Medium", verified: false } },
  { contractId: "sla-comed", account: "ComEd", value: "$4.8M", dueIn: "22d", serviceHealth: { label: "Issues open", verified: false }, risk: { label: "High", verified: false } },
  { contractId: "sla-nv", account: "NV Energy", value: "$2.1M", dueIn: "31d", serviceHealth: { label: "Verified", verified: true }, risk: { label: "Verified", verified: true } },
];

/* ── SLA contract detail (per account) ───────────────────────────── */
export interface SlaContractDetail {
  account: string;
  agreement: string;
  value: string;
  term: string;
  renewsIn: string;
  slaTarget: string;
  slaActual: string;
  owner: string;
  region: string;
  summary: string;
  serviceHealth: SlaBadge;
  risk: SlaBadge;
  metrics: { label: string; value: string }[];
  obligations: { label: string; met: boolean }[];
  related: { customer: string; assets: string; contract: string };
}

export const SLA_CONTRACTS: Record<string, SlaContractDetail> = {
  "sla-comed": {
    account: "ComEd",
    agreement: "ComEd — 5-year HVDC Service Agreement",
    value: "$4.8M",
    term: "5 years · yr 4 of 5",
    renewsIn: "22 days",
    slaTarget: "98.0%",
    slaActual: "96.4%",
    owner: "Marcus Lee",
    region: "Midwest · US",
    summary:
      "ComEd's HVDC service agreement is up for renewal in 22 days with two open asset issues (AST-001, AST-002) pulling service performance 1.6pp under the SLA target. Resolving the thermal and bearing findings before the renewal review is the priority to protect the $4.8M renewal.",
    serviceHealth: { label: "Issues open", verified: false },
    risk: { label: "High", verified: false },
    metrics: [
      { label: "SLA performance", value: "96.4% vs 98.0% target" },
      { label: "Response time", value: "4.2h avg (target 4h)" },
      { label: "Open service issues", value: "2" },
      { label: "Penalty exposure", value: "$120k" },
    ],
    obligations: [
      { label: "99% uptime commitment", met: false },
      { label: "Quarterly condition reporting", met: true },
      { label: "24/7 emergency response", met: true },
      { label: "Annual DGA sampling", met: true },
    ],
    related: { customer: "ComEd", assets: "AST-001, AST-002", contract: "ComEd — 5-year Service Agreement" },
  },
  "sla-nv": {
    account: "NV Energy",
    agreement: "NV Energy — Service Agreement",
    value: "$2.1M",
    term: "3 years · yr 2 of 3",
    renewsIn: "31 days",
    slaTarget: "98.0%",
    slaActual: "99.1%",
    owner: "Marcus Lee",
    region: "West · US",
    summary:
      "NV Energy is a healthy account tracking above its SLA target with all obligations verified. The renewal in 31 days is low-risk; the play is to confirm terms early and explore a scope uplift for the aging Zone B fleet.",
    serviceHealth: { label: "Verified", verified: true },
    risk: { label: "Verified", verified: true },
    metrics: [
      { label: "SLA performance", value: "99.1% vs 98.0% target" },
      { label: "Response time", value: "3.1h avg (target 4h)" },
      { label: "Open service issues", value: "0" },
      { label: "Penalty exposure", value: "$0" },
    ],
    obligations: [
      { label: "98% uptime commitment", met: true },
      { label: "Quarterly condition reporting", met: true },
      { label: "24/7 emergency response", met: true },
      { label: "Annual DGA sampling", met: true },
    ],
    related: { customer: "NV Energy", assets: "AST-003", contract: "NV Energy — Service Agreement" },
  },
  "sla-aep": {
    account: "AEP Ohio",
    agreement: "AEP Ohio — Converter Service Agreement",
    value: "$6.2M",
    term: "5 years · yr 3 of 5",
    renewsIn: "38 days",
    slaTarget: "98.0%",
    slaActual: "97.2%",
    owner: "Priya Nair",
    region: "Midwest · US",
    summary:
      "AEP Ohio is the largest SLA in the pipeline at $6.2M, but a declining tap-changer on AST-004 is trending toward an SLA breach. A proactive intervention now de-risks the renewal and creates an upsell for a condition-monitoring add-on.",
    serviceHealth: { label: "Asset declining", verified: false },
    risk: { label: "High", verified: false },
    metrics: [
      { label: "SLA performance", value: "97.2% vs 98.0% target" },
      { label: "Response time", value: "3.8h avg (target 4h)" },
      { label: "Open service issues", value: "1" },
      { label: "Penalty exposure", value: "$180k" },
    ],
    obligations: [
      { label: "98% uptime commitment", met: false },
      { label: "Quarterly condition reporting", met: true },
      { label: "24/7 emergency response", met: true },
      { label: "Tap-changer maintenance program", met: false },
    ],
    related: { customer: "AEP Ohio", assets: "AST-004", contract: "AEP Ohio — Service Agreement" },
  },
  "sla-pacific": {
    account: "Pacific Gas",
    agreement: "Pacific Gas — Protection & Relay SLA",
    value: "$3.9M",
    term: "4 years · yr 1 of 4",
    renewsIn: "44 days",
    slaTarget: "98.0%",
    slaActual: "98.6%",
    owner: "Lena Fischer",
    region: "West · US",
    summary:
      "Pacific Gas is performing to plan with all obligations verified. With the renewal 44 days out, the focus is a smooth confirmation and positioning the relay-upgrade expansion opportunity already in the pipeline.",
    serviceHealth: { label: "Verified", verified: true },
    risk: { label: "Verified", verified: true },
    metrics: [
      { label: "SLA performance", value: "98.6% vs 98.0% target" },
      { label: "Response time", value: "3.4h avg (target 4h)" },
      { label: "Open service issues", value: "0" },
      { label: "Penalty exposure", value: "$0" },
    ],
    obligations: [
      { label: "98% uptime commitment", met: true },
      { label: "Quarterly condition reporting", met: true },
      { label: "24/7 emergency response", met: true },
      { label: "Relay calibration program", met: true },
    ],
    related: { customer: "Pacific Gas", assets: "AST-021", contract: "Protection relay upgrade" },
  },
  "sla-duke": {
    account: "Duke Energy",
    agreement: "Duke Energy — Fleet Reliability SLA",
    value: "$5.4M",
    term: "5 years · yr 2 of 5",
    renewsIn: "58 days",
    slaTarget: "98.0%",
    slaActual: "97.9%",
    owner: "Priya Nair",
    region: "Southeast · US",
    summary:
      "Duke Energy sits just under its SLA target and is on the watch list. The renewal is 58 days out with room to recover; a fleet-wide reliability review would both close the SLA gap and support the reliability-program opportunity in discovery.",
    serviceHealth: { label: "Watch", verified: false },
    risk: { label: "Medium", verified: false },
    metrics: [
      { label: "SLA performance", value: "97.9% vs 98.0% target" },
      { label: "Response time", value: "4.0h avg (target 4h)" },
      { label: "Open service issues", value: "1" },
      { label: "Penalty exposure", value: "$60k" },
    ],
    obligations: [
      { label: "98% uptime commitment", met: false },
      { label: "Quarterly condition reporting", met: true },
      { label: "24/7 emergency response", met: true },
      { label: "Annual thermal scan program", met: true },
    ],
    related: { customer: "Duke Energy", assets: "AST-033", contract: "Duke Energy — Service Agreement" },
  },
};

export const SLA_RENEWALS: { value: string; points: { t: number; v: number }[] } = {
  value: "12",
  points: [
    { t: 0, v: 40 },
    { t: 1, v: 52 },
    { t: 2, v: 60 },
    { t: 3, v: 56 },
    { t: 4, v: 44 },
    { t: 5, v: 34 },
    { t: 6, v: 30 },
    { t: 7, v: 38 },
    { t: 8, v: 50 },
    { t: 9, v: 58 },
    { t: 10, v: 54 },
    { t: 11, v: 46 },
  ],
};

// Stylised greyscale map — town labels + asset markers (percent coords)
export const MAP_LABELS: { name: string; x: number; y: number; size?: "sm" | "md" }[] = [
  { name: "Arese", x: 8, y: 8, size: "sm" },
  { name: "Bollate", x: 16, y: 13, size: "sm" },
  { name: "Cormano", x: 30, y: 7, size: "sm" },
  { name: "Cusano Milanino", x: 40, y: 5, size: "sm" },
  { name: "Bresso", x: 45, y: 14, size: "sm" },
  { name: "Sesto San Giovanni", x: 62, y: 10, size: "sm" },
  { name: "Cologno Monzese", x: 76, y: 11, size: "sm" },
  { name: "Novate Milanese", x: 26, y: 18, size: "sm" },
  { name: "Pero", x: 12, y: 26, size: "sm" },
  { name: "Vimodrone", x: 78, y: 22, size: "sm" },
  { name: "Settimo Milanese", x: 6, y: 40, size: "sm" },
  { name: "San Siro", x: 26, y: 40, size: "sm" },
  { name: "Segrate", x: 82, y: 32, size: "sm" },
  { name: "Milan", x: 48, y: 48, size: "md" },
  { name: "Novegro", x: 80, y: 43, size: "sm" },
  { name: "Baggio", x: 12, y: 52, size: "sm" },
  { name: "Corsico", x: 22, y: 62, size: "sm" },
  { name: "Buccinasco", x: 26, y: 70, size: "sm" },
  { name: "Assago", x: 34, y: 74, size: "sm" },
  { name: "San Donato Milanese", x: 74, y: 66, size: "sm" },
  { name: "Rozzano", x: 34, y: 86, size: "sm" },
  { name: "Opera", x: 56, y: 85, size: "sm" },
  { name: "Pontesesto", x: 44, y: 80, size: "sm" },
];

// x/y are percent coords for the static fallback map; lat/lng for Google Maps.
export const MAP_MARKERS: { id: string; x: number; y: number; lat: number; lng: number; ping?: boolean }[] = [
  { id: "ast-001", x: 52, y: 24, lat: 45.508, lng: 9.162, ping: true },
  { id: "ast-002", x: 33, y: 66, lat: 45.432, lng: 9.112 },
  { id: "ast-003", x: 68, y: 46, lat: 45.462, lng: 9.252 },
  { id: "ast-004", x: 23, y: 39, lat: 45.421, lng: 9.148 },
];

/* ── Opportunities ───────────────────────────────────────────────── */
export type OppStage = "Discovery" | "Qualified" | "Scoping" | "Offer" | "Negotiation";
export type OppStatus = "on-track" | "at-risk" | "stalled";
export const OPP_STAGES: OppStage[] = ["Discovery", "Qualified", "Scoping", "Offer", "Negotiation"];

export interface OppRequirement {
  label: string;
  done: boolean;
}
export interface Opportunity {
  id: string;
  account: string;
  title: string;
  value: string;
  owner: string;
  stage: OppStage;
  status: OppStatus;
  requirements: OppRequirement[];
  recommendedAction: string;
}

// The information a sales engineer needs to build an offer, per opportunity.
const req = (
  account: boolean, installBase: boolean, scope: boolean, costing: boolean, legal: boolean
): OppRequirement[] => [
  { label: "Account & shipping details", done: account },
  { label: "Install Base profile", done: installBase },
  { label: "Scope of Work & tech requirements", done: scope },
  { label: "Costing & pricing model", done: costing },
  { label: "Legal T&Cs", done: legal },
];

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-xcel",
    account: "Xcel Energy",
    title: "5-year HVDC Service Agreement renewal",
    value: "$8.2M",
    owner: "Priya N.",
    stage: "Scoping",
    status: "at-risk",
    requirements: req(true, true, false, false, false),
    recommendedAction: "Complete scope of work",
  },
  {
    id: "opp-comed",
    account: "ComEd",
    title: "Substation transformer upgrade",
    value: "$4.8M",
    owner: "Marcus Lee",
    stage: "Offer",
    status: "on-track",
    requirements: req(true, true, true, true, true),
    recommendedAction: "Send offer",
  },
  {
    id: "opp-aep",
    account: "AEP Ohio",
    title: "Converter transformer replacement",
    value: "$6.2M",
    owner: "Priya N.",
    stage: "Qualified",
    status: "at-risk",
    requirements: req(true, false, false, false, false),
    recommendedAction: "Capture Install Base profile",
  },
  {
    id: "opp-duke",
    account: "Duke Energy",
    title: "Fleet reliability program",
    value: "$5.4M",
    owner: "Priya N.",
    stage: "Discovery",
    status: "on-track",
    requirements: req(false, false, false, false, false),
    recommendedAction: "Qualify budget & scope",
  },
  {
    id: "opp-nv",
    account: "NV Energy",
    title: "Protection relay retrofit",
    value: "$2.1M",
    owner: "Marcus Lee",
    stage: "Negotiation",
    status: "on-track",
    requirements: req(true, true, true, true, false),
    recommendedAction: "Finalize legal T&Cs",
  },
  {
    id: "opp-pacific",
    account: "Pacific Gas",
    title: "Relay upgrade expansion",
    value: "$1.9M",
    owner: "Lena Fischer",
    stage: "Scoping",
    status: "stalled",
    requirements: req(true, false, false, false, false),
    recommendedAction: "Request Install Base profile",
  },
];

export interface OpportunityDetail {
  summary: string;
  recommendations: string[];
  assets: { code: string; note: string }[];
  related: { customer: string; contract: string; region: string };
}
export const OPPORTUNITY_DETAILS: Record<string, OpportunityDetail> = {
  "opp-xcel": {
    summary:
      "Renewal of Xcel Energy's 5-year HVDC service agreement for 9 converter stations, driven by recurring partial discharge on the aging S-12/S-14 units. Strong technical case and relationship, but the offer can't be built until scope and costing are finalised — the customer deadline is 47 days out.",
    recommendations: [
      "Complete the scope of work using the S-12 recurring-fault history as the anchor",
      "Build the costing model — the aging fleet supports a premium tier",
      "Confirm legal T&Cs early; the SLA renewal window collides with the offer deadline",
    ],
    assets: [
      { code: "S-12", note: "HVDC Converter Transformer · recurring PD, inspection needed" },
      { code: "S-14", note: "HVDC Converter Transformer · nameplate docs on paper" },
    ],
    related: { customer: "Xcel Energy", contract: "5-year HVDC Service Agreement", region: "North America" },
  },
  "opp-comed": {
    summary:
      "Substation transformer upgrade for ComEd. All offer information is in place — account details, install base, scope, costing and legal are complete. The opportunity is ready to move: the offer just needs to be sent.",
    recommendations: [
      "Send the offer — everything required is complete",
      "Schedule the customer walkthrough to accelerate sign-off",
    ],
    assets: [
      { code: "AST-001", note: "Power transformer · Critical health, replacement candidate" },
      { code: "AST-002", note: "Power transformer · repeat-repair asset" },
    ],
    related: { customer: "ComEd", contract: "5-year Service Agreement", region: "North America" },
  },
  "opp-aep": {
    summary:
      "Converter transformer replacement for AEP Ohio, surfaced by declining asset health on the largest unit in the pipeline. Qualified but early — the install base profile and technical requirements are missing, which is holding it out of the offer stage.",
    recommendations: [
      "Capture the Install Base profile to unlock scoping",
      "Gather technical requirements from the AST-004 condition data",
      "Prepare a costing model once scope is defined",
    ],
    assets: [{ code: "AST-004", note: "Power transformer · At Risk, tap-changer vibration" }],
    related: { customer: "AEP Ohio", contract: "Service Agreement", region: "North America" },
  },
  "opp-duke": {
    summary:
      "Early-stage fleet reliability program for Duke Energy. Still in discovery — budget, scope and account details all need to be qualified before it can progress. High potential given the fleet size, but a long way from offer-ready.",
    recommendations: [
      "Qualify budget and decision timeline with the account",
      "Capture account & shipping details to open the file",
      "Map the fleet to identify the highest-risk units first",
    ],
    assets: [],
    related: { customer: "Duke Energy", contract: "New opportunity", region: "North America" },
  },
  "opp-nv": {
    summary:
      "Protection relay retrofit for NV Energy, in final negotiation. All technical and commercial information is complete; only the legal terms remain open. Close to won — resolving the T&Cs is the last step.",
    recommendations: [
      "Finalize the legal T&Cs to close",
      "Confirm the mobilisation window with the customer",
    ],
    assets: [{ code: "AST-003", note: "Power transformer · At Risk, oil temperature trend" }],
    related: { customer: "NV Energy", contract: "Service Agreement", region: "North America" },
  },
  "opp-pacific": {
    summary:
      "Relay upgrade expansion for Pacific Gas. Scoping has stalled — the install base profile is missing and site access remains verbal-only, so scope, costing and legal can't be completed. Needs a data push to get moving again.",
    recommendations: [
      "Request the Install Base profile to unblock scoping",
      "Get site access confirmed in writing",
      "Rebuild the scope and costing once access is secured",
    ],
    assets: [{ code: "R-21", note: "Protection Relay Bank · Substation West" }],
    related: { customer: "Pacific Gas", contract: "Protection Relay Upgrade", region: "North Sea" },
  },
};

// System-generated opportunities surfaced for the user to review.
export interface ProposedOpportunity {
  id: string;
  account: string;
  title: string;
  estimatedValue: string;
  rationale: string;
  signals: string[];
}
export const PROPOSED_OPPORTUNITIES: ProposedOpportunity[] = [
  {
    id: "prop-xcel-s19",
    account: "Xcel Energy",
    title: "S-19 converter transformer replacement",
    estimatedValue: "$2.4M",
    rationale:
      "S-19 is showing the same partial-discharge signature that drove the S-12 upgrade. At over 35 years old it's a strong replacement candidate to bundle into the SLA renewal before the autumn outage window.",
    signals: ["Asset health", "DGA trend", "SLA renewal"],
  },
  {
    id: "prop-comed-spares",
    account: "ComEd",
    title: "Standby spares program",
    estimatedValue: "$3.1M",
    rationale:
      "AST-001 and AST-002 are both Critical with no standby capacity on the site. A spares program de-risks an unplanned outage worth ~$0.9M and fits the existing service agreement.",
    signals: ["2 critical assets", "No standby", "Outage risk"],
  },
];
