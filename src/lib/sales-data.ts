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
export interface AssetAlert {
  id: string;
  code: string;
  location: string;
  health: number;
  status: AssetStatus;
  alert?: { title: string; detail: string; action: string };
}
export const ASSET_ALERTS: AssetAlert[] = [
  {
    id: "ast-001",
    code: "AST-001",
    location: "Zone A • Pump Station 1",
    health: 24,
    status: "critical",
    alert: {
      title: "Potential overheating",
      detail:
        "Sensors are recording degraded transformer performance across multiple substations, indicating potential overheating and insulation wear that require immediate diagnostic review.",
      action: "Investigate",
    },
  },
  { id: "ast-002", code: "AST-002", location: "Zone A • Pump Station 1", health: 24, status: "critical" },
  { id: "ast-003", code: "AST-003", location: "Zone A • Pump Station 1", health: 24, status: "at-risk" },
  { id: "ast-004", code: "AST-004", location: "Zone A • Pump Station 1", health: 24, status: "at-risk" },
];

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
