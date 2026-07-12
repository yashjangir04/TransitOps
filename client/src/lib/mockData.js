// Seed / mock data for the TransitOps platform (frontend-only)
// Everything is persisted to localStorage so CRUD survives refresh.

export const ROLES = [
  { id: "fleet_manager", label: "Fleet Manager" },
  { id: "driver", label: "Driver" },
  { id: "safety_officer", label: "Safety Officer" },
  { id: "financial_analyst", label: "Financial Analyst" },
];

// RBAC access matrix (module -> roles allowed)
export const RBAC = {
  dashboard: ["fleet_manager", "driver", "safety_officer", "financial_analyst"],
  fleet: ["fleet_manager"],
  drivers: ["fleet_manager", "safety_officer"],
  trips: ["fleet_manager", "driver"],
  maintenance: ["fleet_manager"],
  fuel: ["fleet_manager", "financial_analyst"],
  analytics: ["fleet_manager", "financial_analyst"],
  settings: ["fleet_manager"],
};

export const DEMO_USERS = [
  {
    email: "manager@transitops",
    password: "demo123",
    name: "Roopa K.",
    role: "fleet_manager",
  },
  {
    email: "driver@transitops",
    password: "demo123",
    name: "Aser",
    role: "driver",
  },
  {
    email: "safety@transitops",
    password: "demo123",
    name: "Priya",
    role: "safety_officer",
  },
  {
    email: "finance@transitops",
    password: "demo123",
    name: "Suraj",
    role: "financial_analyst",
  },
];

export const seedVehicles = [
  {
    id: "V-01",
    regNo: "620468531",
    name: "VAN-05",
    type: "Van",
    capacity: 500,
    odometer: 74000,
    acquisitionCost: 620000,
    status: "Available",
  },
  {
    id: "V-02",
    regNo: "620489931",
    name: "TRUCK-11",
    type: "Truck",
    capacity: 5000,
    odometer: 192000,
    acquisitionCost: 2450000,
    status: "On Trip",
  },
  {
    id: "V-03",
    regNo: "620458820",
    name: "MINI-03",
    type: "Mini",
    capacity: 1000,
    odometer: 66000,
    acquisitionCost: 410000,
    status: "In Shop",
  },
  {
    id: "V-04",
    regNo: "620468094",
    name: "VAN-09",
    type: "Van",
    capacity: 500,
    odometer: 214400,
    acquisitionCost: 570000,
    status: "Retired",
  },
  {
    id: "V-05",
    regNo: "620468095",
    name: "TRUCK-04",
    type: "Truck",
    capacity: 4500,
    odometer: 88200,
    acquisitionCost: 2100000,
    status: "Available",
  },
  {
    id: "V-06",
    regNo: "620468096",
    name: "TRUCK-06",
    type: "Truck",
    capacity: 4500,
    odometer: 122500,
    acquisitionCost: 2280000,
    status: "Available",
  },
];

export const seedDrivers = [
  {
    id: "D-01",
    name: "Aser",
    licenseNo: "DL-8931",
    category: "LMV",
    expiry: "2028-12-01",
    contact: "+91 98765xxxxx",
    tripsCompleted: 78,
    safetyScore: 96,
    status: "Available",
  },
  {
    id: "D-02",
    name: "Ivan",
    licenseNo: "DL-4030",
    category: "HMV",
    expiry: "2025-03-25",
    contact: "+91 98730xxxxx",
    tripsCompleted: 121,
    safetyScore: 84,
    status: "Suspended",
  },
  {
    id: "D-03",
    name: "Priya",
    licenseNo: "DL-7051",
    category: "LMV",
    expiry: "2027-04-27",
    contact: "+91 99411xxxxx",
    tripsCompleted: 55,
    safetyScore: 91,
    status: "On Trip",
  },
  {
    id: "D-04",
    name: "Suraj",
    licenseNo: "DL-40045",
    category: "LMV",
    expiry: "2026-01-27",
    contact: "+91 91234xxxxx",
    tripsCompleted: 33,
    safetyScore: 88,
    status: "Off Duty",
  },
  {
    id: "D-05",
    name: "Meena",
    licenseNo: "DL-2231",
    category: "HMV",
    expiry: "2029-06-15",
    contact: "+91 98220xxxxx",
    tripsCompleted: 202,
    safetyScore: 94,
    status: "Available",
  },
];

export const seedTrips = [
  {
    id: "TR001",
    vehicleId: "V-01",
    driverId: "D-01",
    source: "Gandhinagar Depot",
    destination: "Ahmedabad Hub",
    cargoWeight: 480,
    plannedDistance: 45,
    status: "On Trip",
  },
  {
    id: "TR002",
    vehicleId: "V-02",
    driverId: "D-02",
    source: "Ahmedabad Hub",
    destination: "Vadodara Yard",
    cargoWeight: 2200,
    plannedDistance: 118,
    status: "Completed",
  },
  {
    id: "TR003",
    vehicleId: "V-03",
    driverId: "D-03",
    source: "Ahmedabad Hub",
    destination: "Kalol Warehouse",
    cargoWeight: 850,
    plannedDistance: 62,
    status: "Dispatched",
  },
  {
    id: "TR004",
    vehicleId: null,
    driverId: null,
    source: "Awaiting vehicle",
    destination: "-",
    cargoWeight: 0,
    plannedDistance: 0,
    status: "Draft",
  },
];

export const seedMaintenance = [
  {
    id: "M-01",
    vehicleId: "V-01",
    service: "Oil Change",
    cost: 3500,
    date: "2026-01-05",
    status: "Completed",
  },
  {
    id: "M-02",
    vehicleId: "V-05",
    service: "Engine Repair",
    cost: 19000,
    date: "2026-01-08",
    status: "Completed",
  },
  {
    id: "M-03",
    vehicleId: "V-03",
    service: "Tyre Replace",
    cost: 6200,
    date: "2026-01-10",
    status: "In Shop",
  },
];

export const seedFuelLogs = [
  { id: "F-01", vehicleId: "V-01", date: "2026-01-05", liters: 42, cost: 3760 },
  { id: "F-02", vehicleId: "V-05", date: "2026-01-06", liters: 70, cost: 6400 },
  {
    id: "F-03",
    vehicleId: "V-03",
    date: "2026-01-08",
    liters: 25,
    cost: 2050,
  },
  { id: "F-04", vehicleId: "V-02", date: "2026-01-09", liters: 96, cost: 8880 },
];

export const seedExpenses = [
  {
    id: "E-01",
    tripId: "TR001",
    vehicleId: "V-01",
    toll: 120,
    misc: 0,
    driverAllowance: 0,
    total: 120,
  },
  {
    id: "E-02",
    tripId: "TR002",
    vehicleId: "V-02",
    toll: 340,
    misc: 180,
    driverAllowance: 19000,
    total: 19520,
  },
];

export const initialData = {
  vehicles: seedVehicles,
  drivers: seedDrivers,
  trips: seedTrips,
  maintenance: seedMaintenance,
  fuel: seedFuelLogs,
  expenses: seedExpenses,
};
