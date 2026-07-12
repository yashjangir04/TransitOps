import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { RBAC } from "@/lib/mockData";

const AppContext = createContext(null);
const AUTH_KEY = "transitops:auth:v1";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

const loadAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const toTitleCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const toSnakeCase = (str) => {
  if (!str) return '';
  return str.toUpperCase().replace(' ', '_');
};

export function AppProvider({ children }) {
  const [data, setData] = useState({ vehicles: [], drivers: [], trips: [], maintenance: [], fuel: [], expenses: [] });
  const [user, setUser] = useState(loadAuth);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      localStorage.removeItem(AUTH_KEY);
      delete api.defaults.headers.common['Authorization'];
      setData({ vehicles: [], drivers: [], trips: [], maintenance: [], fuel: [], expenses: [] });
    }
  }, [user]);

  const fetchAll = async () => {
    try {
      const [veh, drv, trp, maint, fuel, exp] = await Promise.all([
        api.get('/vehicles').catch(() => ({ data: { data: [] } })),
        api.get('/drivers').catch(() => ({ data: { data: [] } })),
        api.get('/trips').catch(() => ({ data: { data: [] } })),
        api.get('/maintenance').catch(() => ({ data: { data: [] } })),
        api.get('/finance/fuel').catch(() => ({ data: { data: [] } })),
        api.get('/finance/expenses').catch(() => ({ data: { data: [] } })),
      ]);

      const groupedExpenses = {};
      (exp.data.data || []).forEach(e => {
        if (!groupedExpenses[e.tripId]) {
          groupedExpenses[e.tripId] = { id: e.tripId, tripId: e.tripId, vehicleId: e.vehicleId, toll: 0, misc: 0, driverAllowance: 0, total: 0 };
        }
        if (e.type === 'TOLL') groupedExpenses[e.tripId].toll += e.amount;
        else if (e.type === 'MISC') groupedExpenses[e.tripId].misc += e.amount;
        else if (e.type === 'ALLOWANCE') groupedExpenses[e.tripId].driverAllowance += e.amount;
        groupedExpenses[e.tripId].total += e.amount;
      });

      setData({
        vehicles: (veh.data.data || []).map(v => ({
          id: v.id,
          regNo: v.registrationNumber,
          name: v.model,
          type: v.type,
          capacity: v.maxCapacityKg,
          odometer: v.odometer,
          acquisitionCost: v.acquisitionCost,
          status: toTitleCase(v.status)
        })),
        drivers: (drv.data.data || []).map(d => ({
          id: d.id,
          name: d.name,
          licenseNo: d.licenseNumber,
          category: d.licenseCategory,
          expiry: d.licenseExpiryDate ? d.licenseExpiryDate.split('T')[0] : '',
          contact: d.contactNumber,
          safetyScore: d.safetyScore,
          status: toTitleCase(d.status),
          tripsCompleted: parseInt(d.tripCompletionRate) || 0
        })),
        trips: (trp.data.data || []).map(t => ({
          id: t.id,
          tripNumber: t.tripNumber,
          source: t.source,
          destination: t.destination,
          vehicleId: t.vehicleId,
          driverId: t.driverId,
          cargoWeight: t.cargoWeightKg,
          plannedDistance: t.plannedDistance,
          status: toTitleCase(t.status),
          revenue: t.revenue,
        })),
        maintenance: (maint.data.data || []).map(m => ({
          id: m.id,
          vehicleId: m.vehicleId,
          service: m.serviceType,
          cost: m.cost,
          date: m.logDate ? m.logDate.split('T')[0] : '',
          status: m.status === 'ACTIVE' ? 'In Shop' : 'Completed'
        })),
        fuel: (fuel.data.data || []).map(f => ({
          id: f.id,
          vehicleId: f.vehicleId,
          date: f.logDate ? f.logDate.split('T')[0] : '',
          liters: f.liters,
          cost: f.cost
        })),
        expenses: Object.values(groupedExpenses)
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAll();
    }
  }, [user]);

  const login = async (email, password, role) => {
    try {
      const res = await api.post('/auth/login', {
        email,
        password,
        role: role.toUpperCase()
      });
      const token = res.data.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const session = { 
        email: email, 
        name: payload.userName?.name || email.split('@')[0], 
        role: role, 
        token 
      };
      setUser(session);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.response?.data?.error || "Invalid credentials or wrong role selected." };
    }
  };

  const logout = () => setUser(null);
  const can = (module) => user && RBAC[module]?.includes(user.role);

  const addVehicle = async (v) => {
    try {
      await api.post('/vehicles', {
        registrationNumber: v.regNo,
        model: v.name,
        type: v.type,
        maxCapacityKg: v.capacity,
        odometer: v.odometer,
        acquisitionCost: v.acquisitionCost,
        status: toSnakeCase(v.status)
      });
      await fetchAll();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.response?.data?.error || err.message };
    }
  };
  
  const updateVehicle = async (id, patch) => {
    if (patch.status) {
      try {
        await api.patch(`/vehicles/${id}/status`, { status: patch.status });
        await fetchAll();
      } catch (err) {
        console.error(err);
      }
    }
  };
  
  const deleteVehicle = async (id) => {
    try {
      await api.delete(`/vehicles/${id}`);
      await fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const addDriver = async (dr) => {
    try {
      await api.post('/drivers/create', {
        name: dr.name,
        licenseNumber: dr.licenseNo,
        licenseCategory: dr.category,
        licenseExpiryDate: new Date(dr.expiry).toISOString(),
        contactNumber: dr.contact
      });
      await fetchAll();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.response?.data?.error || err.message };
    }
  };
  
  const updateDriver = async (id, patch) => {
    if (patch.status) {
      try {
        await api.patch(`/drivers/${id}/status`, { newStatus: toSnakeCase(patch.status) });
        await fetchAll();
      } catch (err) {
        console.error(err);
      }
    }
  };
  
  const deleteDriver = async (id) => {
    try {
      await api.delete(`/drivers/${id}`);
      await fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const createTrip = async (t) => {
    try {
      const res = await api.post('/trips/create', {
        source: t.source,
        destination: t.destination,
        vehicleId: parseInt(t.vehicleId),
        driverId: parseInt(t.driverId),
        cargoWeightKg: t.cargoWeight,
        plannedDistance: t.plannedDistance,
        revenue: t.revenue
      });
      await fetchAll();
      return { ok: true, id: res.data.data.id };
    } catch (err) {
      return { ok: false, error: err.response?.data?.error || err.message };
    }
  };

  const dispatchTrip = async (id) => {
    try {
      await api.post(`/trips/${id}/dispatch`);
      await fetchAll();
    } catch(err) { 
      alert(err.response?.data?.error || err.message);
    }
  };
  
  const completeTrip = async (id, payload = {}) => {
    try {
      await api.post(`/trips/${id}/complete`, payload);
      await fetchAll();
    } catch(err) { 
      alert(err.response?.data?.error || err.message);
    }
  };
  
  const cancelTrip = async (id) => {
    try {
      await api.post(`/trips/${id}/cancel`);
      await fetchAll();
    } catch(err) { 
      alert(err.response?.data?.error || err.message);
    }
  };

  const addMaintenance = async (m) => {
    try {
      await api.post('/maintenance', {
        vehicleId: parseInt(m.vehicleId),
        serviceType: m.service,
        cost: m.cost,
        logDate: m.date || new Date().toISOString(),
        status: m.status === "In Shop" ? "ACTIVE" : "CLOSED"
      });
      await fetchAll();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.response?.data?.error || err.message };
    }
  };

  const closeMaintenance = async (id) => {
    try {
      await api.put(`/maintenance/${id}`, { status: 'CLOSED' });
      await fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const addFuel = async (f) => {
    try {
      await api.post('/finance/fuel/create', {
        vehicleId: parseInt(f.vehicleId),
        liters: f.liters,
        cost: f.cost
      });
      await fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const addExpense = async (e) => {
    try {
      const promises = [];
      if (e.toll > 0) promises.push(api.post('/finance/expenses/create', { type: 'TOLL', amount: e.toll, vehicleId: parseInt(e.vehicleId), tripId: parseInt(e.tripId) }));
      if (e.misc > 0) promises.push(api.post('/finance/expenses/create', { type: 'MISC', amount: e.misc, vehicleId: parseInt(e.vehicleId), tripId: parseInt(e.tripId) }));
      if (e.driverAllowance > 0) promises.push(api.post('/finance/expenses/create', { type: 'ALLOWANCE', amount: e.driverAllowance, vehicleId: parseInt(e.vehicleId), tripId: parseInt(e.tripId) }));
      await Promise.all(promises);
      await fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const resetDemo = () => {};

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    [data, user],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
