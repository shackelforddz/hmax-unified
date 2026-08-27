/* ── PM team — people & allocation ───────────────────────────────── */

export interface Person {
  id: string;
  name: string;
  role: string;
  location: string;
  allocation: number;      // % utilisation
  avatar: string;
  /** Work order ids this person is assigned to (see work-orders-data). */
  taskIds: string[];
}

export const PEOPLE: Person[] = [
  {
    id: "p-daniel",
    name: "Daniel Brooks",
    role: "Senior Project Engineer",
    location: "Chicago, IL",
    allocation: 92,
    avatar: "/avatars/12.jpg",
    taskIds: ["wo-2041", "wo-2019"],
  },
  {
    id: "p-sarah",
    name: "Sarah Mitchell",
    role: "Delivery Lead",
    location: "Aberdeen, UK",
    allocation: 96,
    avatar: "/avatars/5.jpg",
    taskIds: ["wo-2038", "wo-2027"],
  },
  {
    id: "p-lena",
    name: "Lena Fischer",
    role: "Field Service Engineer",
    location: "Hamburg, DE",
    allocation: 74,
    avatar: "/avatars/9.jpg",
    taskIds: ["wo-2035", "wo-2024"],
  },
  {
    id: "p-marcus",
    name: "Marcus Lee",
    role: "Reliability Engineer",
    location: "Columbus, OH",
    allocation: 61,
    avatar: "/avatars/14.jpg",
    taskIds: ["wo-2031", "wo-2012"],
  },
  {
    id: "p-priya",
    name: "Priya Nair",
    role: "Commissioning Engineer",
    location: "Manchester, UK",
    allocation: 68,
    avatar: "/avatars/15.jpg",
    taskIds: ["wo-2019"],
  },
];
