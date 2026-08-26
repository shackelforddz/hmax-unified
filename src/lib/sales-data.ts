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
export type AssetCategory = "asset-health" | "risk-building" | "offer-readiness" | "missing-info";
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
  account: string;
  value: string;
  dueIn: string;
  serviceHealth: SlaBadge;
  risk: SlaBadge;
}
export const SLA_PIPELINE: SlaRow[] = [
  { account: "ComEd", value: "$4.8M", dueIn: "22d", serviceHealth: { label: "Issues open", verified: false }, risk: { label: "High", verified: false } },
  { account: "NV Energy", value: "$2.1M", dueIn: "31d", serviceHealth: { label: "Verified", verified: true }, risk: { label: "Verified", verified: true } },
  { account: "AEP Ohio", value: "$6.2M", dueIn: "38d", serviceHealth: { label: "Asset declining", verified: false }, risk: { label: "High", verified: false } },
  { account: "Pacific Gas", value: "$3.9M", dueIn: "44d", serviceHealth: { label: "Verified", verified: true }, risk: { label: "Verified", verified: true } },
  { account: "Duke Energy", value: "$5.4M", dueIn: "58d", serviceHealth: { label: "Watch", verified: false }, risk: { label: "Medium", verified: false } },
  { account: "ComEd", value: "$4.8M", dueIn: "22d", serviceHealth: { label: "Issues open", verified: false }, risk: { label: "High", verified: false } },
  { account: "NV Energy", value: "$2.1M", dueIn: "31d", serviceHealth: { label: "Verified", verified: true }, risk: { label: "Verified", verified: true } },
];

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

export const MAP_MARKERS: { x: number; y: number; ping?: boolean }[] = [
  { x: 52, y: 24, ping: true },
  { x: 33, y: 66 },
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
