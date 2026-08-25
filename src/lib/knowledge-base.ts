/* ── Knowledge base ──────────────────────────────────────────────────
   Dummy portfolio data + a lightweight query engine so the assistant can
   return grounded answers to free-text prompts (contracts, assets, KPIs). */

export interface KBContract {
  customer: string;
  value: string;
  margin: string;
  status: string;
  owner: string;
  region: string;
  due: string;
  note: string;
}

export interface KBAsset {
  code: string;
  type: string;
  location: string;
  health: string;
  status: string;
  commissioned: string;
  note: string;
}

export const CONTRACTS: KBContract[] = [
  { customer: "Xcel Energy", value: "$4.2M", margin: "14.2%", status: "Delivery at risk", owner: "Daniel Brooks", region: "North America", due: "8 Sep 2026", note: "HVDC winding replacement on S-12/S-14. 18 days late; $1.2M invoice blocked on site commissioning. Delta Coils is the critical dependency." },
  { customer: "Siemens", value: "£2.4M", margin: "11.8%", status: "Invoice blocked", owner: "Sarah Mitchell", region: "North Sea", due: "15 Sep 2026", note: "Switchgear refurbishment. Change order CO-118 unsigned, holding a £680k progress invoice and dragging margin 14pts under baseline." },
  { customer: "Baltic Wind NL", value: "£2.4M", margin: "19.4%", status: "Healthy", owner: "Sarah Mitchell", region: "North Sea", due: "20 Sep 2026", note: "Offshore transformer maintenance. On track, but two HSE certificates expire before the next visit and a verbal inspection extension is undocumented." },
  { customer: "Pacific Gas", value: "£440k", margin: "21.0%", status: "Healthy", owner: "Lena Fischer", region: "North Sea", due: "25 Sep 2026", note: "Protection relay upgrade. On schedule; site access is verbal-only and needs a written agreement before mobilisation." },
  { customer: "ComEd", value: "$4.8M", margin: "12.6%", status: "Issues open", owner: "Marcus Lee", region: "North America", due: "in 22 days", note: "SLA renewal with open service issues; flagged High risk in the pipeline." },
  { customer: "NV Energy", value: "$2.1M", margin: "17.9%", status: "Verified", owner: "Marcus Lee", region: "North America", due: "in 31 days", note: "SLA renewal, service health verified and low risk." },
  { customer: "AEP Ohio", value: "$6.2M", margin: "13.1%", status: "Asset declining", owner: "Priya N.", region: "North America", due: "in 38 days", note: "Largest renewal in the pipeline; asset health declining, flagged High risk." },
  { customer: "Duke Energy", value: "$5.4M", margin: "15.5%", status: "Watch", owner: "Priya N.", region: "North America", due: "in 58 days", note: "SLA renewal on watch, medium risk." },
];

export const ASSETS: KBAsset[] = [
  { code: "AST-001", type: "Power transformer", location: "Zone A · Pump Station 1", health: "24%", status: "Critical", commissioned: "2009", note: "Potential overheating — degraded transformer performance across substations indicates insulation wear needing immediate diagnostic review." },
  { code: "AST-002", type: "Power transformer", location: "Zone A · Pump Station 1", health: "24%", status: "Critical", commissioned: "2011", note: "Repeated-repair asset — seal replacement (Jan 2026), bearing inspection (Nov 2025), motor vibration check (Aug 2025)." },
  { code: "AST-003", type: "Power transformer", location: "Zone A · Pump Station 1", health: "24%", status: "At Risk", commissioned: "2013", note: "Score below 60; scheduled for condition assessment." },
  { code: "AST-004", type: "Power transformer", location: "Zone A · Pump Station 1", health: "24%", status: "At Risk", commissioned: "2014", note: "Score below 60; monitoring for further decline." },
  { code: "S-09", type: "HVDC Converter Transformer", location: "Sherco Converter Station, MN", health: "88 (Healthy)", status: "Healthy", commissioned: "2010", note: "DGA normal, specs complete." },
  { code: "S-11", type: "HVDC Converter Transformer", location: "Sherco Converter Station, MN", health: "74 (Watch)", status: "Watch", commissioned: "2016", note: "Partial discharge elevated; DGA hydrogen trending above threshold three months running." },
  { code: "S-12", type: "HVDC Converter Transformer", location: "Sherco Converter Station, MN · Asset ID 41", health: "Unknown", status: "Watch", commissioned: "1988", note: "Recurring partial discharge — 3rd occurrence (Nov 2025, Mar 2026, Aug 2026). >35 years old; inspection needed. Both the reason to buy and to push back on price with Xcel." },
  { code: "S-14", type: "HVDC Converter Transformer", location: "Sherco Converter Station, MN · Asset ID 54", health: "Unknown", status: "Watch", commissioned: "1991", note: "Nameplate docs on paper at Denver; not yet digitised." },
];

export const PORTFOLIO = {
  activeContracts: 24,
  contractsAtRisk: 14,
  portfolioMargin: "18.6%",
  onTimeDelivery: "60%",
  fleetHealthToday: 71,
  fleetHealth30d: 83,
  criticalAssets: 2,
  atRiskAssets: 3,
  revenueAtRisk: "$7.1M",
  upcomingRenewals: 12,
};

const VENDORS = [
  { name: "Delta Coils Inc.", amount: "$4.8M", projects: 6 },
  { name: "Nexans", amount: "$1.4M", projects: 3 },
  { name: "Nynas AB", amount: "$0.6M", projects: 2 },
  { name: "Air Liquide", amount: "$0.3M", projects: 1 },
];

const MILESTONES = [
  "Xcel Energy — Field mobilization · 2 days late",
  "Pacific Gas — Site access agreement · in 3 days",
  "Siemens — Change order sign-off · in 5 days",
  "Xcel Energy — Site commissioning · in 8 days",
  "Baltic Wind NL — HSE cert renewal · in 10 days",
];

/* ── Query engine ────────────────────────────────────────────────── */

function normalizeAssetCode(raw: string): string {
  const m = raw.toLowerCase().replace(/\s/g, "").match(/^([a-z]+)-?0*(\d+)$/);
  if (!m) return raw.toUpperCase();
  const prefix = m[1].toUpperCase();
  const num = m[2];
  return prefix === "AST" ? `AST-${num.padStart(3, "0")}` : `${prefix}-${num}`;
}

function formatContract(c: KBContract): string {
  return [
    `${c.customer} — ${c.status}`,
    `Value ${c.value} · Margin ${c.margin} · Owner ${c.owner} · ${c.region}`,
    `Due ${c.due}.`,
    c.note,
  ].join("\n");
}

function formatAsset(a: KBAsset): string {
  return [
    `${a.code} — ${a.type}`,
    `${a.location}`,
    `Health ${a.health} · ${a.status} · Commissioned ${a.commissioned}`,
    a.note,
  ].join("\n");
}

function vendorAnswer(): string {
  const lines = VENDORS.map((v) => `• ${v.name} — ${v.amount} across ${v.projects} project${v.projects > 1 ? "s" : ""}`);
  return [
    `Vendor concentration — ${PORTFOLIO.revenueAtRisk} of revenue at risk by vendor:`,
    ...lines,
    `Delta Coils Inc. is the critical dependency — a single vendor carrying $4.8M across 6 projects. This is a concentration problem, not six separate delays.`,
  ].join("\n");
}

function slaAnswer(): string {
  const open = CONTRACTS.filter((c) => ["Issues open", "Asset declining", "Watch"].includes(c.status));
  return [
    `SLA Pipeline — ${PORTFOLIO.upcomingRenewals} renewals upcoming.`,
    ...CONTRACTS.filter((c) => c.due.startsWith("in ")).map((c) => `• ${c.customer} — ${c.value} · due ${c.due} · ${c.status}`),
    `${open.length} accounts need attention before renewal; AEP Ohio ($6.2M) is the largest and its asset health is declining.`,
  ].join("\n");
}

function deliveryAnswer(): string {
  return [
    `On-time delivery is at ${PORTFOLIO.onTimeDelivery}, down 5% on last month and well under the 85% target — four consecutive months of decline.`,
    `The main drag is Xcel Energy: 18 days late, pushing work out of the autumn outage window. It's the metric Xcel will quote back during the SLA negotiation.`,
  ].join("\n");
}

function marginAnswer(): string {
  const worst = [...CONTRACTS].sort((a, b) => parseFloat(a.margin) - parseFloat(b.margin)).slice(0, 3);
  return [
    `Portfolio margin is ${PORTFOLIO.portfolioMargin}, 0.8pp under plan.`,
    `Lowest-margin contracts:`,
    ...worst.map((c) => `• ${c.customer} — ${c.margin} (${c.status})`),
    `Siemens is the biggest distortion — margin sits 14pts under baseline until change order CO-118 is booked.`,
  ].join("\n");
}

function revenueAnswer(): string {
  return [
    `${PORTFOLIO.revenueAtRisk} of revenue is at risk this quarter, by trigger:`,
    `• Delivery slip — $4.8M`,
    `• Invoice blocked — $1.2M (Xcel, milestone 4 not achieved)`,
    `• Change order unsigned — $0.7M (Siemens CO-118)`,
    `• Scope creep — $0.4M`,
  ].join("\n");
}

function fleetAnswer(): string {
  return [
    `Fleet health dropped to ${PORTFOLIO.fleetHealthToday} today from ${PORTFOLIO.fleetHealth30d} thirty days ago (−12).`,
    `${PORTFOLIO.criticalAssets} critical assets and ${PORTFOLIO.atRiskAssets} scoring under 60. AST-001 and AST-002 are the critical ones, both at 24% health in Zone A · Pump Station 1.`,
  ].join("\n");
}

function milestoneAnswer(): string {
  return [`Upcoming milestones (next 14 days):`, ...MILESTONES.map((m) => `• ${m}`)].join("\n");
}

function riskAnswer(): string {
  const risky = CONTRACTS.filter((c) => ["Delivery at risk", "Invoice blocked", "Asset declining", "Issues open"].includes(c.status));
  return [
    `${PORTFOLIO.contractsAtRisk} of ${PORTFOLIO.activeContracts} contracts are flagged at risk. Highest-priority right now:`,
    ...risky.map((c) => `• ${c.customer} — ${c.status} · ${c.value} (${c.owner})`),
  ].join("\n");
}

function portfolioAnswer(): string {
  return [
    `Portfolio snapshot: ${PORTFOLIO.activeContracts} active contracts, ${PORTFOLIO.contractsAtRisk} at risk, margin ${PORTFOLIO.portfolioMargin}, on-time delivery ${PORTFOLIO.onTimeDelivery}.`,
    `Biggest exposures: Xcel Energy (delivery at risk, $4.2M) and Siemens (invoice blocked, £2.4M). ${PORTFOLIO.revenueAtRisk} of revenue is at risk this quarter.`,
  ].join("\n");
}

function contextFallback(context: string | undefined, prompt: string): string {
  const base = context ? `Looking at ${context}, ` : "";
  return `${base}I couldn't tie "${prompt.trim()}" to a specific contract or asset. Try asking about a customer (Xcel Energy, Siemens, ComEd…), an asset (AST-001, S-12…), or a topic like margin, on-time delivery, vendor concentration, or SLA renewals.`;
}

/** Returns the customer a piece of text refers to, if any — used to tie a
 *  free-form conversation to a specific account. */
export function detectCustomer(text: string): string | null {
  const q = text.toLowerCase();
  const hit = CONTRACTS.find((c) => q.includes(c.customer.toLowerCase()));
  return hit ? hit.customer : null;
}

export function customerSummary(name: string): string | null {
  const c = CONTRACTS.find((x) => x.customer.toLowerCase() === name.toLowerCase());
  return c ? c.note : null;
}

// Action CTAs resolve to a confirmation rather than a lookup.
const ACTION_RE = /^(escalate|request|raise|draft|schedule|generate|prepare|flag|propose|review|order|assign|mark|add|create)\b/i;

export function answerQuery(prompt: string, context?: string): string {
  const q = prompt.toLowerCase();

  // Proactive action taken from a CTA — acknowledge it.
  if (ACTION_RE.test(prompt.trim())) {
    return `On it. I've actioned "${prompt.trim()}" and notified the relevant owners — you'll see it reflected in the project record.`;
  }

  // Asset code lookup (AST-001, S-12, etc.)
  const assetMatch = q.match(/\b([a-z]{1,3}-?\s?0*\d{1,3})\b/);
  if (assetMatch) {
    const code = normalizeAssetCode(assetMatch[1]);
    const a = ASSETS.find((x) => x.code.toLowerCase() === code.toLowerCase());
    if (a) return formatAsset(a);
  }

  // Customer / contract lookup
  const c = CONTRACTS.find((x) => q.includes(x.customer.toLowerCase()));
  if (c) return formatContract(c);

  // Topic keywords
  if (/(vendor|delta coils|concentration|supplier)/.test(q)) return vendorAnswer();
  if (/(sla|renewal|pipeline)/.test(q)) return slaAnswer();
  if (/(on.?time|delivery|late|cotd)/.test(q)) return deliveryAnswer();
  if (/(margin|profit)/.test(q)) return marginAnswer();
  if (/(invoice|billing|revenue)/.test(q)) return revenueAnswer();
  if (/(fleet|health|score)/.test(q)) return fleetAnswer();
  if (/(milestone|upcoming|due)/.test(q)) return milestoneAnswer();
  if (/(risk|critical|at.?risk|attention)/.test(q)) return riskAnswer();
  if (/(contract|portfolio|account|overview)/.test(q)) return portfolioAnswer();

  return contextFallback(context, prompt);
}

/* ── Proactive suggestions ───────────────────────────────────────── */

export interface Suggestions {
  /** Quick follow-up questions the user can tap to keep exploring. */
  prompts: string[];
  /** Proactive next-step CTAs that trigger an action. */
  actions: { label: string; prompt: string }[];
}

// Given the user's prompt (and optional widget context), suggest where to go next.
export function suggestNext(prompt: string, context?: string): Suggestions {
  const q = prompt.toLowerCase();
  const cust = detectCustomer(prompt);
  const assetMatch = q.match(/\b([a-z]{1,3}-?\s?0*\d{1,3})\b/);
  const asset = assetMatch ? normalizeAssetCode(assetMatch[1]) : null;
  const assetExists = !!asset && ASSETS.some((a) => a.code.toLowerCase() === asset!.toLowerCase());

  if (assetExists) {
    return {
      prompts: [`Show repair history for ${asset}`, `What's the health trend for ${asset}?`, "Recommend the next action"],
      actions: [
        { label: "Schedule inspection", prompt: `Schedule an inspection for ${asset}` },
        { label: "Create work order", prompt: `Create a work order for ${asset}` },
      ],
    };
  }
  if (/(vendor|delta coils|supplier|concentration)/.test(q)) {
    return {
      prompts: ["Which projects depend on Delta Coils?", "Are there alternative suppliers?", "What's the total revenue exposure?"],
      actions: [
        { label: "Request vendor update", prompt: "Request a delivery update from Delta Coils Inc." },
        { label: "Draft risk summary", prompt: "Draft a vendor concentration risk summary" },
      ],
    };
  }
  if (/(on.?time|delivery|late|cotd)/.test(q)) {
    return {
      prompts: ["Why is Xcel Energy late?", "Which milestones are at risk?", "Compare delivery against target"],
      actions: [
        { label: "Escalate delivery risk", prompt: "Escalate the delivery risk to the account owner" },
        { label: "Adjust schedule", prompt: "Propose an adjusted mobilization schedule for Xcel Energy" },
      ],
    };
  }
  if (/margin/.test(q)) {
    return {
      prompts: ["Which contracts drag margin the most?", "Show the Siemens change-order impact", "How does this compare to plan?"],
      actions: [{ label: "Flag for review", prompt: "Flag the low-margin contracts for portfolio review" }],
    };
  }
  if (/(invoice|billing|revenue|risk\b)/.test(q)) {
    return {
      prompts: ["What's blocking the Xcel invoice?", "Which invoices can be released now?", "Show revenue at risk by customer"],
      actions: [
        { label: "Raise purchase order", prompt: "Raise the purchase order for the transformer gasket set" },
        { label: "Create invoice", prompt: "Create an invoice for the completed Xcel milestones" },
      ],
    };
  }
  if (/(sla|renewal|pipeline)/.test(q)) {
    return {
      prompts: ["Which renewals need attention first?", "Show the AEP Ohio status", "What's the total renewal value?"],
      actions: [{ label: "Prepare renewal pack", prompt: "Prepare the SLA renewal pack for the at-risk accounts" }],
    };
  }
  if (/(fleet|health|score|asset|critical|repair)/.test(q)) {
    return {
      prompts: ["Which assets are critical?", "Show the fleet health trend", "What's driving the decline?"],
      actions: [{ label: "Review critical assets", prompt: "Review the critical assets and recommend actions" }],
    };
  }
  if (cust) {
    return {
      prompts: [`Show open risks for ${cust}`, `What are the next milestones for ${cust}?`, `Who owns the ${cust} account?`],
      actions: [
        { label: "Generate project status", prompt: `Generate a project status report for ${cust}` },
        { label: "Start a mobilization plan", prompt: `Create a mobilization plan for ${cust}` },
      ],
    };
  }
  if (context) {
    return {
      prompts: [`Break down ${context} by driver`, `How does ${context} compare to plan?`, `What should I do about ${context}?`],
      actions: [{ label: "Add to my report", prompt: `Add ${context} to my weekly report` }],
    };
  }
  return {
    prompts: ["What needs my attention today?", "Show the portfolio overview", "Which contracts are at risk?"],
    actions: [],
  };
}
