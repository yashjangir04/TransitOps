// Access matrix and Roles for the TransitOps platform

export const ROLES = [
  { id: "fleet_manager", label: "Fleet Manager" },
  { id: "dispatcher", label: "Dispatcher" },
  { id: "safety_officer", label: "Safety Officer" },
  { id: "financial_analyst", label: "Financial Analyst" },
];

export const RBAC = {
  dashboard: ["fleet_manager", "driver", "safety_officer", "financial_analyst", "dispatcher"],
  fleet: ["fleet_manager", "dispatcher"],
  drivers: ["fleet_manager", "safety_officer", "dispatcher"],
  trips: ["fleet_manager", "driver", "dispatcher"],
  maintenance: ["fleet_manager"],
  fuel: ["fleet_manager", "financial_analyst"],
  analytics: ["fleet_manager", "financial_analyst"],
  settings: ["fleet_manager"],
};
