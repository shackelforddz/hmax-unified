export interface Role {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const RECOMMENDED_ROLE: Role = {
  id: "project-manager",
  label: "Project Manager",
  description:
    "Optimized for tracking deliverables, managing team capacity, monitoring project health, and mitigating program-level risks. Pre-configured with modular widgets for instant status reporting.",
  icon: "Briefcase",
};

export const ALTERNATIVE_ROLES: Role[] = [
  {
    id: "sales",
    label: "Sales",
    description:
      "Customer pipelines, opportunity tracking, revenue forecasts, and account management dashboards.",
    icon: "Banknote",
  },
  {
    id: "operations",
    label: "Operations",
    description:
      "Resource utilization, workforce scheduling, operational KPIs, and service delivery tracking.",
    icon: "RefreshCcw",
  },
  {
    id: "reliability-engineer",
    label: "Reliability Engineer",
    description:
      "System health monitoring, incident tracking, SLA compliance, and predictive maintenance alerts.",
    icon: "Cog",
  },
  {
    id: "diagnostics",
    label: "Diagnostics",
    description:
      "Field-report interpretation, fault-signature detection, and coordinating field engineers for asset inspections.",
    icon: "Stethoscope",
  },
];

export const ALL_ROLES: Role[] = [RECOMMENDED_ROLE, ...ALTERNATIVE_ROLES];

/* ── Per-role demo login URLs ────────────────────────────────────── */
// Slug → role label. Canonical slugs are the role ids; aliases are accepted.
export const ROLE_SLUGS: Record<string, string> = {
  "project-manager": "Project Manager",
  pm: "Project Manager",
  sales: "Sales",
  operations: "Operations",
  ops: "Operations",
  "reliability-engineer": "Reliability Engineer",
  reliability: "Reliability Engineer",
  diagnostics: "Diagnostics",
};

export function roleFromSlug(slug: string): Role | undefined {
  const label = ROLE_SLUGS[slug.toLowerCase()];
  return label ? ALL_ROLES.find((r) => r.label === label) : undefined;
}

// Roles with a dedicated dashboard view — the ones worth demoing.
export const DEMO_ROLES: Role[] = ALL_ROLES.filter((r) =>
  ["project-manager", "sales", "operations", "reliability-engineer", "diagnostics"].includes(r.id)
);

export const MOCK_USER = {
  name: "James",
  fullName: "James Jenkins",
  email: "james.jenkins@hitachi-systems.com",
  detectedDivision: "PMO Division",
  avatar: "/avatars/11.jpg",
};
