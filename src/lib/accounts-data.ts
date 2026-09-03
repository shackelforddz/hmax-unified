/* ── Sales: accounts needing attention ───────────────────────────────
   Account-level risk for the Sales view — aggregates the signals that
   already live in the product (stalled opportunities, missing offer
   inputs, and asset alerts) up to the customer so a strategic seller can
   answer "which accounts should I be worried about?" without drilling in. */

import type { RiskProfile } from "@/lib/operations-data";

export type AccountStatus = "critical" | "at-risk" | "watch";

export type AccountCategory = "opportunity" | "asset" | "commercial";

export interface AccountFlag {
  title: string;
  detail: string;
  action: string;
  category: AccountCategory;
  /** The asset this flag concerns, for the "Review asset health" playbook. */
  assetId?: string;
}

export interface AccountAttention {
  id: string;
  account: string;
  owner: string;
  meta: string;    // portfolio value / headline
  status: AccountStatus;
  summary: string; // one-line driver summary shown collapsed
  /** Offer/renewal readiness — % complete toward a signed offer. */
  progress: number;
  /** Account risk across the same axes the ops widget uses. */
  risk: RiskProfile;
  /** The SLA contract this account's detail drawer opens. */
  contractId: string;
  flags: AccountFlag[];
}

export const ACCOUNT_ATTENTION: AccountAttention[] = [
  {
    id: "xcel-energy",
    account: "Xcel Energy",
    owner: "Priya N.",
    meta: "$8.2M pipeline · 5-yr HVDC renewal",
    status: "critical",
    summary: "Renewal slipping in Scoping · scope of work missing · critical asset alert",
    progress: 55,
    risk: { schedule: "high", cost: "med", quality: "high", safety: "low" },
    contractId: "sla-xcel",
    flags: [
      {
        title: "$8.2M HVDC renewal stuck in Scoping",
        detail:
          "Scope of Work & tech requirements are still missing (owned by Engineering — J. Park). The renewal is at risk of missing its window.",
        action: "Complete scope of work",
        category: "opportunity",
      },
      {
        title: "AST-001 critical — thermal fault signature",
        detail:
          "The largest unit on the account is showing a Y-phase hotspot and elevated DGA, with a reliability escalation open. Worth getting ahead of before the renewal conversation.",
        action: "Review asset health",
        assetId: "ast-001",
        category: "asset",
      },
    ],
  },
  {
    id: "aep-ohio",
    account: "AEP Ohio",
    owner: "Priya N.",
    meta: "$6.2M pipeline",
    status: "at-risk",
    summary: "Opportunity stalled at Qualified · Install Base profile missing · asset health falling",
    progress: 40,
    risk: { schedule: "med", cost: "med", quality: "high", safety: "low" },
    contractId: "sla-aep",
    flags: [
      {
        title: "$6.2M converter replacement can't reach Offer",
        detail:
          "The Install Base profile is missing (owned by Reliability — F. Dubois), holding the opportunity at Qualified.",
        action: "Request Install Base profile",
        category: "opportunity",
      },
      {
        title: "AST-004 health 58% and falling",
        detail:
          "Declining asset health on the largest unit is what surfaced this opportunity — a proactive conversation is warranted.",
        action: "Review asset health",
        assetId: "ast-004",
        category: "asset",
      },
    ],
  },
  {
    id: "pacific-gas",
    account: "Pacific Gas",
    owner: "Lena Fischer",
    meta: "$1.9M pipeline",
    status: "at-risk",
    summary: "Opportunity stalled · written site-access agreement outstanding",
    progress: 30,
    risk: { schedule: "med", cost: "low", quality: "low", safety: "med" },
    contractId: "sla-pacific",
    flags: [
      {
        title: "Relay upgrade expansion stalled",
        detail:
          "Only a verbal site-access arrangement is in place; a written agreement is required before the work can be scoped and mobilised.",
        action: "Request written access",
        category: "opportunity",
      },
    ],
  },
  {
    id: "nv-energy",
    account: "NV Energy",
    owner: "Marcus Lee",
    meta: "$2.1M pipeline",
    status: "watch",
    summary: "In Negotiation · legal T&Cs the only outstanding offer input",
    progress: 85,
    risk: { schedule: "low", cost: "low", quality: "low", safety: "low" },
    contractId: "sla-nv",
    flags: [
      {
        title: "Legal T&Cs outstanding on $2.1M retrofit",
        detail:
          "The offer is otherwise complete; Legal T&Cs (owned by Legal — R. Bianchi) are the last item before it can go out.",
        action: "Finalize legal T&Cs",
        category: "commercial",
      },
    ],
  },
];
