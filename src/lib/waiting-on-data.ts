/* ── Open items you're waiting on other people for ───────────────────
   Powers the PM "Waiting on" widget: the follow-ups and dependencies owned
   by someone else that are holding your projects up. */

export type WaitingParty = "Legal" | "Reliability" | "Customer" | "Vendor" | "Engineering";

export interface WaitingItem {
  id: string;
  item: string;        // what you're waiting for
  waitingOn: string;   // the person/team you're chasing
  party: WaitingParty; // category of who owns it
  context: string;     // the project/contract it's blocking
  waitingDays: number; // how long it's been outstanding
  due: string;         // when it's needed by (ISO)
}

export const WAITING_ON: WaitingItem[] = [
  { id: "wait-1", item: "Signed change order CO-118", waitingOn: "Siemens (customer)", party: "Customer", context: "North Sea switchgear refurbishment", waitingDays: 12, due: "2026-09-05" },
  { id: "wait-2", item: "Material delivery confirmation", waitingOn: "Delta Coils", party: "Vendor", context: "Sherco HVDC winding replacement", waitingDays: 8, due: "2026-09-01" },
  { id: "wait-3", item: "Install Base profile", waitingOn: "F. Dubois (Reliability)", party: "Reliability", context: "AEP Ohio converter replacement", waitingDays: 6, due: "2026-09-10" },
  { id: "wait-4", item: "Legal T&Cs sign-off", waitingOn: "R. Bianchi (Legal)", party: "Legal", context: "NV Energy relay retrofit", waitingDays: 5, due: "2026-09-12" },
  { id: "wait-5", item: "Written site-access agreement", waitingOn: "Pacific Gas (customer)", party: "Customer", context: "Protection relay upgrade", waitingDays: 3, due: "2026-09-08" },
];
