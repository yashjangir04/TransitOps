import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/context/AppContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Fleet from "@/pages/Fleet";
import Drivers from "@/pages/Drivers";
import Trips from "@/pages/Trips";
import Maintenance from "@/pages/Maintenance";
import FuelExpenses from "@/pages/FuelExpenses";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import "@/App.css";

function Protected({ module, children }) {
  const { user, can } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (module && !can(module))
    return (
      <div className="to-card p-10 max-w-lg mx-auto text-center mt-16" data-testid="access-denied">
        <div className="text-2xl font-extrabold text-slate-900">Access denied</div>
        <div className="text-sm text-gray-500 mt-2">
          Your role does not have access to this module. Sign in with a role that does.
        </div>
      </div>
    );
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Protected module="dashboard"><Dashboard /></Protected>} />
      <Route path="/fleet" element={<Protected module="fleet"><Fleet /></Protected>} />
      <Route path="/drivers" element={<Protected module="drivers"><Drivers /></Protected>} />
      <Route path="/trips" element={<Protected module="trips"><Trips /></Protected>} />
      <Route path="/maintenance" element={<Protected module="maintenance"><Maintenance /></Protected>} />
      <Route path="/fuel" element={<Protected module="fuel"><FuelExpenses /></Protected>} />
      <Route path="/analytics" element={<Protected module="analytics"><Analytics /></Protected>} />
      <Route path="/settings" element={<Protected module="settings"><Settings /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
