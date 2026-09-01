/* ── Sales: accounts needing attention ───────────────────────────────
   Account-level risk for the Sales view — aggregates the signals that
   already live in the product (stalled opportunities, missing offer
   inputs, and asset alerts) up to the customer so a strategic seller can
   answer "which accounts should I be worried about?" without drilling in. */

export type AccountStatus = "critical" | "at-risk" | "watch";

export interface AccountFlag {
  title: string;
  detail: string;
  action: string;
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
    flags: [
      {
        title: "$8.2M HVDC renewal stuck in Scoping",
        detail:
          "Scope of Work & tech requirements are still missing (owned by Engineering — J. Park). The renewal is at risk of missing its window.",
        action: "Complete scope of work",
      },
      {
        title: "AST-001 critical — thermal fault signature",
        detail:
          "The largest unit on the account is showing a Y-phase hotspot and elevated DGA, with a reliability escalation open. Worth getting ahead of before the renewal conversation.",
        action: "Review asset health",
        assetId: "ast-001",
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
    flags: [
      {
        title: "$6.2M converter replacement can't reach Offer",
        detail:
          "The Install Base profile is missing (owned by Reliability — F. Dubois), holding the opportunity at Qualified.",
        action: "Request Install Base profile",
      },
      {
        title: "AST-004 health 58% and falling",
        detail:
          "Declining asset health on the largest unit is what surfaced this opportunity — a proactive conversation is warranted.",
        action: "Review asset health",
        assetId: "ast-004",
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
    flags: [
      {
        title: "Relay upgrade expansion stalled",
        detail:
          "Only a verbal site-access arrangement is in place; a written agreement is required before the work can be scoped and mobilised.",
        action: "Request written access",
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
    flags: [
      {
        title: "Legal T&Cs outstanding on $2.1M retrofit",
        detail:
          "The offer is otherwise complete; Legal T&Cs (owned by Legal — R. Bianchi) are the last item before it can go out.",
        action: "Finalize legal T&Cs",
      },
    ],
  },
];
