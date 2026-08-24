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
];

export const ALL_ROLES: Role[] = [RECOMMENDED_ROLE, ...ALTERNATIVE_ROLES];

export const MOCK_USER = {
  name: "James",
  fullName: "James Jenkins",
  email: "james.jenkins@hitachi-systems.com",
  detectedDivision: "PMO Division",
  avatar: "https://i.pravatar.cc/120?img=11",
};
