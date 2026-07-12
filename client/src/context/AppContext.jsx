import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEMO_USERS, initialData, RBAC } from "@/lib/mockData";

const AppContext = createContext(null);

const STORAGE_KEY = "transitops:data:v1";
const AUTH_KEY = "transitops:auth:v1";

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialData;
    return JSON.parse(raw);
  } catch {
    return initialData;
  }
};

const loadAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AppProvider({ children }) {
  const [data, setData] = useState(load);
  const [user, setUser] = useState(loadAuth);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);
  useEffect(() => {
    if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_KEY);
  }, [user]);

  const login = (email, password, role) => {
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role,
    );
    if (!found) return { ok: false, error: "Invalid credentials or wrong role selected." };
    const token = "mock-jwt-" + btoa(found.email + ":" + Date.now());
    const session = { email: found.email, name: found.name, role: found.role, token };
    setUser(session);
    return { ok: true };
  };
  const logout = () => setUser(null);

  const can = (module) => user && RBAC[module]?.includes(user.role);

  // ---------- CRUD helpers ----------
  const uid = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  const addVehicle = (v) => {
    if (data.vehicles.some((x) => x.regNo === v.regNo)) return { ok: false, error: "Registration number already exists." };
    setData((d) => ({ ...d, vehicles: [...d.vehicles, { ...v, id: uid("V") }] }));
    return { ok: true };
  };
  const updateVehicle = (id, patch) =>
    setData((d) => ({ ...d, vehicles: d.vehicles.map((v) => (v.id === id ? { ...v, ...patch } : v)) }));
  const deleteVehicle = (id) => setData((d) => ({ ...d, vehicles: d.vehicles.filter((v) => v.id !== id) }));

  const addDriver = (dr) => setData((d) => ({ ...d, drivers: [...d.drivers, { ...dr, id: uid("D") }] }));
  const updateDriver = (id, patch) =>
    setData((d) => ({ ...d, drivers: d.drivers.map((v) => (v.id === id ? { ...v, ...patch } : v)) }));
  const deleteDriver = (id) => setData((d) => ({ ...d, drivers: d.drivers.filter((v) => v.id !== id) }));

  // ---- Trip lifecycle (with business rules) ----
  const createTrip = (t) => {
    // Basic validation: cargo weight vs capacity
    const veh = data.vehicles.find((v) => v.id === t.vehicleId);
    if (!veh) return { ok: false, error: "Vehicle not found." };
    if (["In Shop", "Retired", "On Trip"].includes(veh.status)) return { ok: false, error: `Vehicle is ${veh.status}.` };
    if (t.cargoWeight > veh.capacity)
      return { ok: false, error: `Cargo weight ${t.cargoWeight} kg exceeds vehicle capacity ${veh.capacity} kg.` };
    const dr = data.drivers.find((x) => x.id === t.driverId);
    if (!dr) return { ok: false, error: "Driver not found." };
    if (dr.status === "Suspended") return { ok: false, error: "Driver is suspended." };
    if (dr.status === "On Trip") return { ok: false, error: "Driver is already on a trip." };
    const expired = new Date(dr.expiry) < new Date();
    if (expired) return { ok: false, error: "Driver license expired." };
    const newTrip = { ...t, id: uid("TR"), status: "Draft" };
    setData((d) => ({ ...d, trips: [...d.trips, newTrip] }));
    return { ok: true, id: newTrip.id };
  };

  const dispatchTrip = (id) => {
    setData((d) => {
      const trip = d.trips.find((t) => t.id === id);
      if (!trip) return d;
      return {
        ...d,
        trips: d.trips.map((t) => (t.id === id ? { ...t, status: "On Trip" } : t)),
        vehicles: d.vehicles.map((v) => (v.id === trip.vehicleId ? { ...v, status: "On Trip" } : v)),
        drivers: d.drivers.map((v) => (v.id === trip.driverId ? { ...v, status: "On Trip" } : v)),
      };
    });
  };
  const completeTrip = (id) => {
    setData((d) => {
      const trip = d.trips.find((t) => t.id === id);
      if (!trip) return d;
      return {
        ...d,
        trips: d.trips.map((t) => (t.id === id ? { ...t, status: "Completed" } : t)),
        vehicles: d.vehicles.map((v) => (v.id === trip.vehicleId ? { ...v, status: "Available" } : v)),
        drivers: d.drivers.map((v) => (v.id === trip.driverId ? { ...v, status: "Available" } : v)),
      };
    });
  };
  const cancelTrip = (id) => {
    setData((d) => {
      const trip = d.trips.find((t) => t.id === id);
      if (!trip) return d;
      const restore = trip.status === "On Trip" || trip.status === "Dispatched";
      return {
        ...d,
        trips: d.trips.map((t) => (t.id === id ? { ...t, status: "Cancelled" } : t)),
        vehicles: restore
          ? d.vehicles.map((v) => (v.id === trip.vehicleId ? { ...v, status: "Available" } : v))
          : d.vehicles,
        drivers: restore
          ? d.drivers.map((v) => (v.id === trip.driverId ? { ...v, status: "Available" } : v))
          : d.drivers,
      };
    });
  };

  // ---- Maintenance ----
  const addMaintenance = (m) => {
    setData((d) => ({
      ...d,
      maintenance: [...d.maintenance, { ...m, id: uid("M") }],
      vehicles: m.status === "In Shop" ? d.vehicles.map((v) => (v.id === m.vehicleId ? { ...v, status: "In Shop" } : v)) : d.vehicles,
    }));
  };
  const closeMaintenance = (id) => {
    setData((d) => {
      const rec = d.maintenance.find((m) => m.id === id);
      if (!rec) return d;
      return {
        ...d,
        maintenance: d.maintenance.map((m) => (m.id === id ? { ...m, status: "Completed" } : m)),
        vehicles: d.vehicles.map((v) =>
          v.id === rec.vehicleId && v.status !== "Retired" ? { ...v, status: "Available" } : v,
        ),
      };
    });
  };

  // ---- Fuel & Expenses ----
  const addFuel = (f) => setData((d) => ({ ...d, fuel: [...d.fuel, { ...f, id: uid("F") }] }));
  const addExpense = (e) => setData((d) => ({ ...d, expenses: [...d.expenses, { ...e, id: uid("E") }] }));

  const resetDemo = () => setData(initialData);

  const value = useMemo(
    () => ({
      ...data,
      user,
      login,
      logout,
      can,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addDriver,
      updateDriver,
      deleteDriver,
      createTrip,
      dispatchTrip,
      completeTrip,
      cancelTrip,
      addMaintenance,
      closeMaintenance,
      addFuel,
      addExpense,
      resetDemo,
    }),
    [data, user], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
