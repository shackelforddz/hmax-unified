export interface Conversation {
  id: string;
  title: string;
  preview: string;
  date: string;
}

export interface KpiData {
  id: string;
  label: string;
  value: string;
  trend: string;
  sparkline: "active-contracts" | "contracts-at-risk" | "portfolio-margin" | "on-time-delivery";
}

export interface AttentionFlag {
  title: string;
  detail: string;
  action: string;
}

export type AttentionStatus = "critical" | "at-risk" | "healthy";
export type AttentionCategory = "progress" | "budget-invoicing" | "site-access" | "scope-variations";

export interface AttentionItem {
  id: string;
  customer: string;
  meta: string;
  status: AttentionStatus;
  category: AttentionCategory;
  flags?: AttentionFlag[];
}

/* ── Customer detail drawer ──────────────────────────────────────── */
export type DocState = "verified" | "portal" | "conflicting" | "missing";
export type RiskLevel = "Critical" | "High" | "Medium";
export type InfoStatus = "Conflicting" | "Partial" | "Available";

export interface DeliveryStep {
  label: string;
  done: boolean;
  planned: string;
  actual?: string;
}
export interface DocRow {
  name: string;
  type: string;
  source: string;
  updated: string;
  state: DocState;
}
export interface RiskRow {
  title: string;
  detail: string;
  tags: string[];
  level: RiskLevel;
}
export interface InfoRow {
  label: string;
  status: InfoStatus;
  source: string;
}
export interface TimelineEvent {
  title: string;
  detail: string;
  source: string;
  date: string;
}
export interface RelatedRef {
  title: string;
  sub: string;
}

export interface CustomerDetail {
  name: string;
  subtitle: string;
  stats: { owner: string; value: string; margin: string; schedule: string; healthPct: number };
  contextSummary: string;
  recommendedActions?: string[];
  deliveryStatus: DeliveryStep[];
  invoice?: { readiness: string; blocker: string; criticalVendor: string };
  ownership: { currentOwner: string; nextOwner: string; handoverStatus: string };
  blockers: { title: string; detail: string }[];
  documents: DocRow[];
  openRisks: RiskRow[];
  infoCompleteness: { summary: string; rows: InfoRow[] };
  timeline: TimelineEvent[];
  related: {
    customer: RelatedRef;
    contract: RelatedRef;
    assets: RelatedRef[];
    opportunity: RelatedRef;
  };
}

export const CUSTOMER_DETAILS: Record<string, CustomerDetail> = {
  "xcel-energy": {
    name: "Xcel Energy",
    subtitle: "Delivery at risk · North America",
    stats: { owner: "Daniel Brooks", value: "$2.4m", margin: "14.2%", schedule: "18 days late", healthPct: 28 },
    contextSummary:
      "Replacement of converter transformer windings on Units S-12 and S-14 at Sherco. The customer delivery date is contractually tied to the autumn outage window; slipping past 14 September pushes the work into the next available window in February.",
    recommendedActions: ["Adjust schedule", "Escalate delivery risk", "Raise gasket-set PO"],
    deliveryStatus: [
      { label: "Engineering approval", done: true, planned: "2026-06-12", actual: "2026-06-16" },
      { label: "Material delivery (Delta Coils)", done: true, planned: "2026-04-20", actual: "2026-08-01" },
      { label: "Field mobilization", done: false, planned: "2026-08-10" },
      { label: "Site commissioning", done: false, planned: "2026-08-28" },
      { label: "Customer acceptance", done: false, planned: "2026-09-08" },
    ],
    invoice: {
      readiness: "Blocked",
      blocker: "Milestone 4 (site commissioning) not achieved — $1.2m invoice cannot be raised",
      criticalVendor: "Delta Coils Inc.",
    },
    ownership: {
      currentOwner: "Daniel Brooks",
      nextOwner: "Rachel Morgan (service transition)",
      handoverStatus: "Not started — blocked on completion certificate",
    },
    blockers: [
      {
        title: "Project Phoenix will miss the customer delivery date by 18 days",
        detail:
          "Slipping past 14 September pushes the work out of the autumn outage window into February. A $1.2m invoice moves into the next quarter and Xcel SLA negotiation loses its delivery reference.",
      },
      {
        title: "Delta Coils Inc. is now the critical dependency on 6 projects",
        detail:
          "A single vendor accounts for $4.8m of revenue at delivery risk across the portfolio. This is a concentration problem, not six separate delays.",
      },
      {
        title: "Vendor confirmation — conflicting",
        detail: "SAP shows shipped 01 Aug, vendor portal shows in production",
      },
    ],
    documents: [
      { name: "Purchase order 4500227844 — Delta Coils", type: "Purchase order", source: "SAP", updated: "2026-08-01", state: "verified" },
      { name: "Engineering release package rev. C", type: "Engineering release", source: "Eng. Portal", updated: "2026-06-16", state: "verified" },
      { name: "Customer outage agreement — Sherco autumn window", type: "Customer agreement", source: "OBN", updated: "2026-08-07", state: "verified" },
      { name: "Site work package WD-99120", type: "Work order", source: "TDM", updated: "2026-08-22", state: "portal" },
      { name: "Vendor shipping confirmation", type: "Logistics", source: "SAP", updated: "2026-08-20", state: "conflicting" },
      { name: "Completion certificate", type: "Handover", source: "SharePoint", updated: "—", state: "missing" },
    ],
    openRisks: [
      {
        title: "Project Phoenix will miss the customer delivery date by 18 days",
        detail:
          "Slipping past 14 September pushes the work out of the autumn outage window into February. A $1.2m invoice moves into the next quarter and the Xcel SLA negotiation loses its delivery reference.",
        tags: ["SAP", "FSM", "Eng. Portal", "open 6d"],
        level: "Critical",
      },
      {
        title: "Delta Coils Inc. is now the critical dependency on 6 projects",
        detail:
          "A single vendor accounts for $4.8m of revenue at delivery risk across the portfolio. This is a concentration problem, not six separate delays.",
        tags: ["SAP", "open 12d"],
        level: "High",
      },
      {
        title: "Customer on-time delivery has fallen to 60% across the portfolio",
        detail: "Four consecutive months of decline. This is the metric Xcel will quote back during the SLA negotiation.",
        tags: ["SAP", "FSM", "open 14d"],
        level: "Medium",
      },
    ],
    infoCompleteness: {
      summary: "2 of 10 records are incomplete, conflicting or held outside a system.",
      rows: [
        { label: "Vendor confirmation", status: "Conflicting", source: "SAP" },
        { label: "Field crew assignment", status: "Partial", source: "TOM" },
        { label: "Engineering release", status: "Available", source: "Eng. Portal" },
        { label: "Customer outage window", status: "Available", source: "OBN" },
      ],
    },
    timeline: [
      { title: "Delivery forecast revised to 18 days late", detail: "Recalculated from vendor, crew and commissioning durations", source: "SAP", date: "2026-08-11" },
      { title: "Customer confirmed outage window", detail: "28 Aug — 14 Sep. No extension available; next window is February", source: "OBN", date: "2026-08-09" },
      { title: "Field mobilization not achieved", detail: "HV-competent crew committed to Blue Ridge until 28 Aug", source: "FSM", date: "2026-08-04" },
      { title: "Shipment marked dispatched in SAP", detail: "Vendor portal still shows the order in production — unresolved", source: "SAP", date: "2026-08-01" },
      { title: "Vendor delivery date missed", detail: "Delta Coils confirmed a 12-day slip on winding sets", source: "SAP", date: "2026-07-20" },
      { title: "Engineering approval issued", detail: "4 days later than planned — protection scheme review extended", source: "Eng. Portal", date: "2026-06-16" },
    ],
    related: {
      customer: { title: "Xcel Energy", sub: "Transmission utility · North America · 1128 units" },
      contract: { title: "Xcel Energy — 5-year HVDC Service Agreement", sub: "Xcel Energy — Service level agreement · $4.2m" },
      assets: [
        { title: "S-12 — HVDC Converter Transformer", sub: "Xcel Energy — Sherco Converter Station, MN · Asset ID: 41" },
        { title: "S-14 — HVDC Converter Transformer", sub: "Xcel Energy — Sherco Converter Station, MN · Asset ID: 54" },
      ],
      opportunity: { title: "Xcel Energy — 5-year HVDC Service Agreement", sub: "Xcel Energy — Contract renewal · $8.2m" },
    },
  },

  siemens: {
    name: "Siemens",
    subtitle: "Invoice trigger pending · North Sea",
    stats: { owner: "Sarah Mitchell", value: "£2.4m", margin: "11.8%", schedule: "In execution", healthPct: 46 },
    contextSummary:
      "Switchgear panel refurbishment across the North Sea platform cluster. A signed change order is outstanding, holding a £680k progress invoice below the trigger threshold and dragging reported margin 14 points under baseline.",
    recommendedActions: ["Raise change order", "Flag margin for review", "Document scope"],
    deliveryStatus: [
      { label: "Engineering approval", done: true, planned: "2026-05-02", actual: "2026-05-05" },
      { label: "Material delivery", done: true, planned: "2026-06-14", actual: "2026-06-20" },
      { label: "Field execution", done: false, planned: "2026-08-18" },
      { label: "Change order sign-off", done: false, planned: "2026-08-25" },
      { label: "Customer acceptance", done: false, planned: "2026-09-15" },
    ],
    invoice: {
      readiness: "Blocked",
      blocker: "Change order CO-118 unsigned — £680k progress invoice cannot be raised",
      criticalVendor: "Nexans",
    },
    ownership: {
      currentOwner: "Sarah Mitchell",
      nextOwner: "Commercial desk (billing)",
      handoverStatus: "Waiting on signed change order",
    },
    blockers: [
      {
        title: "Change order CO-118 not signed by customer",
        detail: "Margin is reported at -14pts versus baseline until the change order is booked and the associated invoice released.",
      },
      {
        title: "Verbal scope extension not yet documented",
        detail: "Additional protection relay work agreed on site has no written authorisation on file.",
      },
    ],
    documents: [
      { name: "Change order CO-118", type: "Change order", source: "SAP", updated: "—", state: "missing" },
      { name: "Switchgear engineering pack rev. B", type: "Engineering release", source: "Eng. Portal", updated: "2026-05-05", state: "verified" },
      { name: "Platform access agreement", type: "Customer agreement", source: "OBN", updated: "2026-06-30", state: "verified" },
      { name: "Progress claim draft 03", type: "Invoice", source: "SAP", updated: "2026-08-12", state: "conflicting" },
    ],
    openRisks: [
      {
        title: "£680k progress invoice held below trigger",
        detail: "Unsigned change order keeps the milestone value under the billing threshold, deferring revenue into next quarter.",
        tags: ["SAP", "open 9d"],
        level: "High",
      },
      {
        title: "Reported margin -14pts versus baseline",
        detail: "Unbooked change order distorts the margin view used in the portfolio review.",
        tags: ["SAP", "open 9d"],
        level: "Medium",
      },
    ],
    infoCompleteness: {
      summary: "1 of 8 records is incomplete or held outside a system.",
      rows: [
        { label: "Change order", status: "Conflicting", source: "SAP" },
        { label: "Scope extension", status: "Partial", source: "TOM" },
        { label: "Engineering release", status: "Available", source: "Eng. Portal" },
      ],
    },
    timeline: [
      { title: "Progress claim draft returned", detail: "Rejected pending change order booking", source: "SAP", date: "2026-08-12" },
      { title: "Verbal scope extension agreed on site", detail: "Protection relay work not yet documented", source: "FSM", date: "2026-08-03" },
      { title: "Material delivery completed", detail: "Nexans cable terminations received", source: "SAP", date: "2026-06-20" },
    ],
    related: {
      customer: { title: "Siemens", sub: "OEM partner · North Sea · 312 units" },
      contract: { title: "Siemens — Switchgear Refurbishment Frame", sub: "Siemens — Service level agreement · £2.4m" },
      assets: [{ title: "Panel cluster P-04 — MV Switchgear", sub: "Siemens — North Sea Platform B · Asset ID: 88" }],
      opportunity: { title: "Siemens — Platform Modernisation", sub: "Siemens — Contract renewal · £5.1m" },
    },
  },

  "baltic-wind-nl": {
    name: "Baltic Wind NL",
    subtitle: "Scope watch · North Sea",
    stats: { owner: "Sarah Mitchell", value: "£2.4m", margin: "19.4%", schedule: "In execution", healthPct: 72 },
    contextSummary:
      "Offshore transformer maintenance across the Baltic Wind NL array. Delivery is healthy, but two HSE certificates are approaching expiry and a verbally-agreed inspection extension has not been captured, creating a scope-creep watch item.",
    recommendedActions: ["Schedule cert renewal", "Document inspection extension"],
    deliveryStatus: [
      { label: "Engineering approval", done: true, planned: "2026-05-20", actual: "2026-05-19" },
      { label: "Material delivery", done: true, planned: "2026-06-28", actual: "2026-06-28" },
      { label: "Field execution", done: true, planned: "2026-07-30", actual: "2026-07-31" },
      { label: "HSE certificate renewal", done: false, planned: "2026-08-30" },
      { label: "Customer acceptance", done: false, planned: "2026-09-20" },
    ],
    ownership: {
      currentOwner: "Sarah Mitchell",
      nextOwner: "Rachel Morgan (service transition)",
      handoverStatus: "On track — pending certificate renewal",
    },
    blockers: [
      {
        title: "Offshore transformer HSE certificates expiring",
        detail: "Two crew certifications lapse before the next planned visit; Sarah to confirm renewal dates with the HSE office.",
      },
      {
        title: "Verbal inspection extension not documented",
        detail: "An additional blade-root inspection was agreed on site without a written scope change.",
      },
    ],
    documents: [
      { name: "HSE certification pack", type: "Compliance", source: "SharePoint", updated: "2026-07-15", state: "portal" },
      { name: "Offshore transformer engineering pack", type: "Engineering release", source: "Eng. Portal", updated: "2026-05-19", state: "verified" },
      { name: "Array access agreement", type: "Customer agreement", source: "OBN", updated: "2026-06-28", state: "verified" },
    ],
    openRisks: [
      {
        title: "HSE certificates lapse before next visit",
        detail: "Renewal must complete before crew can remobilise offshore.",
        tags: ["FSM", "open 21d"],
        level: "Medium",
      },
    ],
    infoCompleteness: {
      summary: "1 of 6 records is held outside a system.",
      rows: [
        { label: "HSE certification", status: "Partial", source: "SharePoint" },
        { label: "Engineering release", status: "Available", source: "Eng. Portal" },
      ],
    },
    timeline: [
      { title: "Field execution completed", detail: "Transformer maintenance signed off on site", source: "FSM", date: "2026-07-31" },
      { title: "Verbal inspection extension agreed", detail: "Blade-root inspection added without scope change", source: "FSM", date: "2026-07-22" },
    ],
    related: {
      customer: { title: "Baltic Wind NL", sub: "Offshore operator · North Sea · 96 units" },
      contract: { title: "Baltic Wind NL — Offshore Maintenance Frame", sub: "Baltic Wind NL — Service level agreement · £2.4m" },
      assets: [{ title: "T-07 — Offshore Transformer", sub: "Baltic Wind NL — Array North · Asset ID: 33" }],
      opportunity: { title: "Baltic Wind NL — Fleet Service Expansion", sub: "Baltic Wind NL — New scope · £3.6m" },
    },
  },

  "pacific-gas": {
    name: "Pacific Gas",
    subtitle: "Scope watch · North Sea",
    stats: { owner: "Lena Fischer", value: "£440k", margin: "21.0%", schedule: "On schedule", healthPct: 81 },
    contextSummary:
      "Protection relay upgrade programme for Pacific Gas. Delivery is healthy and on schedule, but site access remains unresolved with only a verbal change order in place — a scope-creep item to formalise before the next mobilisation.",
    recommendedActions: ["Request written access", "Review access terms"],
    deliveryStatus: [
      { label: "Engineering approval", done: true, planned: "2026-06-01", actual: "2026-06-01" },
      { label: "Material delivery", done: true, planned: "2026-07-05", actual: "2026-07-04" },
      { label: "Site access agreement", done: false, planned: "2026-08-20" },
      { label: "Field execution", done: false, planned: "2026-09-01" },
      { label: "Customer acceptance", done: false, planned: "2026-09-25" },
    ],
    ownership: {
      currentOwner: "Lena Fischer",
      nextOwner: "Rachel Morgan (service transition)",
      handoverStatus: "On track — pending site access",
    },
    blockers: [
      {
        title: "Site access still unresolved",
        detail: "Only a verbal change order is in place; a written access agreement is required before the crew can mobilise.",
      },
    ],
    documents: [
      { name: "Site access agreement", type: "Customer agreement", source: "OBN", updated: "—", state: "missing" },
      { name: "Relay upgrade engineering pack", type: "Engineering release", source: "Eng. Portal", updated: "2026-06-01", state: "verified" },
      { name: "Purchase order — relay hardware", type: "Purchase order", source: "SAP", updated: "2026-07-04", state: "verified" },
    ],
    openRisks: [
      {
        title: "Verbal-only change order for site access",
        detail: "Access terms are unconfirmed in writing, risking a mobilisation delay.",
        tags: ["OBN", "open 5d"],
        level: "Medium",
      },
    ],
    infoCompleteness: {
      summary: "1 of 5 records is held outside a system.",
      rows: [
        { label: "Site access agreement", status: "Conflicting", source: "OBN" },
        { label: "Engineering release", status: "Available", source: "Eng. Portal" },
      ],
    },
    timeline: [
      { title: "Verbal site access agreed", detail: "Written agreement still outstanding", source: "OBN", date: "2026-08-06" },
      { title: "Relay hardware received", detail: "Purchase order closed in SAP", source: "SAP", date: "2026-07-04" },
    ],
    related: {
      customer: { title: "Pacific Gas", sub: "Distribution utility · North Sea · 540 units" },
      contract: { title: "Pacific Gas — Protection Relay Upgrade", sub: "Pacific Gas — Service level agreement · £440k" },
      assets: [{ title: "R-21 — Protection Relay Bank", sub: "Pacific Gas — Substation West · Asset ID: 12" }],
      opportunity: { title: "Pacific Gas — Grid Protection Programme", sub: "Pacific Gas — New scope · £1.9m" },
    },
  },
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    title: "Xcel Energy HVDC — SLA mobilisation",
    preview: "PO lead time flagged. Gasket set still unraised, 35-day...",
    date: "Oct 10",
  },
  {
    id: "c2",
    title: "Siemens Switch Panel — COTD risk",
    preview: "Change order not signed. Margin at -14pts vs baseline...",
    date: "Oct 10",
  },
  {
    id: "c3",
    title: "Schneider Control Unit — data mismatch",
    preview: "Fiori vs SAP discrepancy flagged. Unbilled WIP €680k...",
    date: "Oct 10",
  },
  {
    id: "c4",
    title: "Baltic Wind NL — HSE cert renewal",
    preview: "Offshore transformer HSE certs expiring. Sarah to confirm...",
    date: "Oct 10",
  },
  {
    id: "c5",
    title: "Q3 Portfolio Review — margin summary",
    preview: "Portfolio margin at 18.6%. Three projects dragging avg down...",
    date: "Oct 10",
  },
  {
    id: "c6",
    title: "Resource planning — site access issues",
    preview: "Pacific Gas site access still unresolved. Verbal CO only...",
    date: "Oct 10",
  },
];

export const KPI_DATA: KpiData[] = [
  {
    id: "active-contracts",
    label: "Active contracts",
    value: "24",
    trend: "2 vs last month",
    sparkline: "active-contracts",
  },
  {
    id: "contracts-at-risk",
    label: "Contracts at risk",
    value: "14",
    trend: "2 vs last month",
    sparkline: "contracts-at-risk",
  },
  {
    id: "portfolio-margin",
    label: "Portfolio margin",
    value: "18.6%",
    trend: "-0.8pp vs plan",
    sparkline: "portfolio-margin",
  },
  {
    id: "on-time-delivery",
    label: "On-time delivery",
    value: "60%",
    trend: "-5% vs last month",
    sparkline: "on-time-delivery",
  },
];

export const ATTENTION_ITEMS: AttentionItem[] = [
  {
    id: "xcel-energy",
    customer: "Xcel Energy",
    meta: "Jan V. · $4.2M · Margin Risk",
    status: "critical",
    category: "progress",
    flags: [
      {
        title: "Will miss the customer delivery date by 18 days",
        detail:
          "Slipping past 14 September pushes the work out of the autumn outage window into February. A $1.2m invoice moves into the next quarter and the Xcel SLA negotiation loses its delivery reference.",
        action: "Adjust Schedule",
      },
      {
        title: "Delta Coils Inc. is now the critical dependency on 6 projects",
        detail:
          "A single vendor accounts for $4.8m of revenue at delivery risk across the portfolio. This is a concentration problem, not six separate delays.",
        action: "Reassign Vendor",
      },
    ],
  },
  {
    id: "siemens",
    customer: "Siemens",
    meta: "Sarah M. · North Sea · £2.4M · In execution",
    status: "critical",
    category: "budget-invoicing",
    flags: [
      {
        title: "Change order CO-118 unsigned — £680k invoice held",
        detail:
          "The progress invoice can't be raised until CO-118 is signed, and reported margin sits 14pts under baseline until it's booked. Every week it stays unbooked pushes revenue into the next quarter.",
        action: "Raise Change Order",
      },
      {
        title: "Verbal scope extension not yet documented",
        detail:
          "Additional protection-relay work was agreed on site with no written authorisation on file, exposing the contract to unbilled scope creep.",
        action: "Document Scope",
      },
    ],
  },
  {
    id: "baltic-wind-nl",
    customer: "Baltic Wind NL",
    meta: "Sarah M. · North Sea · £2.4M · In execution",
    status: "healthy",
    category: "scope-variations",
  },
  {
    id: "pacific-gas",
    customer: "Pacific Gas",
    meta: "Lena F. · North Sea · £440k",
    status: "healthy",
    category: "site-access",
  },
];

/* ── PM widgets: delivery trend, revenue at risk, milestones, vendors ─ */

export interface TrendPoint {
  label: string;
  value: number;
}
export const DELIVERY_TREND: {
  metric: string;
  current: string;
  delta: string;
  target: number;
  min: number;
  max: number;
  points: TrendPoint[];
} = {
  metric: "On-time delivery",
  current: "60%",
  delta: "-5% vs last month",
  target: 85,
  min: 50,
  max: 90,
  points: [
    { label: "Mar", value: 78 },
    { label: "Apr", value: 74 },
    { label: "May", value: 70 },
    { label: "Jun", value: 68 },
    { label: "Jul", value: 64 },
    { label: "Aug", value: 60 },
  ],
};

export interface RiskBar {
  label: string;
  amount: number;
  display: string;
}
export const REVENUE_AT_RISK: { total: string; caption: string; bars: RiskBar[] } = {
  total: "$7.1m",
  caption: "revenue at risk this quarter",
  bars: [
    { label: "Delivery slip", amount: 4.8, display: "$4.8m" },
    { label: "Invoice blocked", amount: 1.2, display: "$1.2m" },
    { label: "Change order unsigned", amount: 0.7, display: "$0.7m" },
    { label: "Scope creep", amount: 0.4, display: "$0.4m" },
  ],
};

export type MilestoneStatus = "late" | "at-risk" | "on-track";
export interface Milestone {
  customer: string;
  milestone: string;
  owner: string;
  due: string;
  dueIn: string;
  status: MilestoneStatus;
}
export const UPCOMING_MILESTONES: Milestone[] = [
  { customer: "Xcel Energy", milestone: "Field mobilization", owner: "Daniel B.", due: "10 Aug", dueIn: "2 days late", status: "late" },
  { customer: "Pacific Gas", milestone: "Site access agreement", owner: "Lena F.", due: "20 Aug", dueIn: "in 3 days", status: "at-risk" },
  { customer: "Siemens", milestone: "Change order sign-off", owner: "Sarah M.", due: "25 Aug", dueIn: "in 5 days", status: "at-risk" },
  { customer: "Xcel Energy", milestone: "Site commissioning", owner: "Daniel B.", due: "28 Aug", dueIn: "in 8 days", status: "at-risk" },
  { customer: "Baltic Wind NL", milestone: "HSE cert renewal", owner: "Sarah M.", due: "30 Aug", dueIn: "in 10 days", status: "on-track" },
];

export interface VendorBar {
  name: string;
  amount: number;
  display: string;
  projects: number;
  critical?: boolean;
}
export const VENDOR_CONCENTRATION: { caption: string; bars: VendorBar[] } = {
  caption: "revenue at risk by vendor",
  bars: [
    { name: "Delta Coils Inc.", amount: 4.8, display: "$4.8m", projects: 6, critical: true },
    { name: "Nexans", amount: 1.4, display: "$1.4m", projects: 3 },
    { name: "Nynas AB", amount: 0.6, display: "$0.6m", projects: 2 },
    { name: "Air Liquide", amount: 0.3, display: "$0.3m", projects: 1 },
  ],
};
