/* ── PM team — people & allocation ───────────────────────────────── */

export interface Certification {
  name: string;
  expires: string; // YYYY-MM
}
export interface Person {
  id: string;
  name: string;
  role: string;
  location: string;
  allocation: number;      // % utilisation
  avatar: string;
  /** Work order ids this person is assigned to (see work-orders-data). */
  taskIds: string[];
  /** On-site field engineer (does inspections). */
  field?: boolean;
  competencies: string[];
  certifications: Certification[];
}

export const PEOPLE: Person[] = [
  {
    id: "p-daniel",
    name: "Daniel Brooks",
    role: "Senior Field Engineer",
    location: "Chicago, IL",
    allocation: 92,
    avatar: "/avatars/12.jpg",
    taskIds: ["wo-2041", "wo-2019"],
    field: true,
    competencies: ["HV authorised", "Thermography Lvl 2", "HVDC commissioning"],
    certifications: [
      { name: "IEC 62271", expires: "2027-03" },
      { name: "Site safety (SMSTS)", expires: "2026-11" },
    ],
  },
  {
    id: "p-sarah",
    name: "Sarah Mitchell",
    role: "Field Delivery Lead",
    location: "Aberdeen, UK",
    allocation: 96,
    avatar: "/avatars/5.jpg",
    taskIds: ["wo-2038", "wo-2027"],
    field: true,
    competencies: ["Lifting supervisor", "Offshore operations"],
    certifications: [
      { name: "BOSIET", expires: "2026-09" },
      { name: "PMP", expires: "2028-01" },
    ],
  },
  {
    id: "p-lena",
    name: "Lena Fischer",
    role: "Field Service Engineer",
    location: "Hamburg, DE",
    allocation: 74,
    avatar: "/avatars/9.jpg",
    taskIds: ["wo-2035", "wo-2024"],
    field: true,
    competencies: ["HV competent", "Oil sampling", "DGA analysis"],
    certifications: [
      { name: "IEC 60599 (DGA)", expires: "2027-06" },
      { name: "Confined space", expires: "2026-12" },
    ],
  },
  {
    id: "p-marcus",
    name: "Marcus Lee",
    role: "Reliability Engineer",
    location: "Columbus, OH",
    allocation: 61,
    avatar: "/avatars/14.jpg",
    taskIds: ["wo-2031", "wo-2012"],
    field: true,
    competencies: ["Vibration analysis (Cat III)", "PD testing", "Power factor"],
    certifications: [
      { name: "ISO 18436-2", expires: "2027-02" },
      { name: "HV switching", expires: "2026-10" },
    ],
  },
  {
    id: "p-priya",
    name: "Priya Nair",
    role: "Commissioning Engineer",
    location: "Manchester, UK",
    allocation: 68,
    avatar: "/avatars/15.jpg",
    taskIds: ["wo-2019"],
    field: true,
    competencies: ["Commissioning", "Protection & control", "SCADA"],
    certifications: [
      { name: "IEC 61850", expires: "2027-09" },
      { name: "First aid", expires: "2026-09" },
    ],
  },
];

// On-site field engineers — used by the Diagnostics view.
export const FIELD_ENGINEERS: Person[] = PEOPLE.filter((p) => p.field);
