import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route as RouteIcon,
  Wrench,
  Fuel,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { to: "/fleet", label: "Fleet", icon: Truck, key: "fleet" },
  { to: "/drivers", label: "Drivers", icon: Users, key: "drivers" },
  { to: "/trips", label: "Trips", icon: RouteIcon, key: "trips" },
  { to: "/maintenance", label: "Maintenance", icon: Wrench, key: "maintenance" },
  { to: "/fuel", label: "Fuel & Expenses", icon: Fuel, key: "fuel" },
  { to: "/analytics", label: "Analytics", icon: BarChart3, key: "analytics" },
  { to: "/settings", label: "Settings", icon: SettingsIcon, key: "settings" },
];

export default function Sidebar() {
  const { can, logout } = useApp();
  return (
    <aside
      data-testid="sidebar"
      className="w-full md:w-60 shrink-0 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col md:flex-col print:hidden"
    >
      <div className="px-5 py-3 md:py-5 border-b border-gray-100 flex items-center justify-between md:justify-start">
        <div className="flex items-center gap-2">
          <img src="/icon-main.svg" alt="TransitOps" className="w-8 h-8" />
          <div>
            <div className="font-extrabold text-slate-900 tracking-tight text-lg leading-none">
              TransitOps
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5 tracking-wide hidden md:block">
              Smart Transport Ops
            </div>
          </div>
        </div>
        <button
          data-testid="sidebar-logout"
          onClick={logout}
          className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-gray-100 border border-gray-100"
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
      <nav className="flex-1 px-3 py-2 md:py-4 flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-0.5 overflow-x-auto">
        {items.map(({ to, label, icon: Icon, key }) => {
          const allowed = can(key);
          return (
            <NavLink
              key={to}
              to={to}
              data-testid={`nav-${key}`}
              end={to === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-2 md:gap-3 px-3 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap",
                  isActive
                    ? "bg-amber-50 text-amber-800 border border-amber-100"
                    : allowed
                      ? "text-gray-700 hover:bg-gray-100"
                      : "text-gray-300 cursor-not-allowed",
                ].join(" ")
              }
              onClick={(e) => {
                if (!allowed) e.preventDefault();
              }}
            >
              <Icon size={16} />
              <span className="hidden md:inline">{label}</span>
            </NavLink>
          );
        })}
      </nav>
      <button
        data-testid="sidebar-logout-desktop"
        onClick={logout}
        className="hidden md:flex mx-3 mb-4 items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 border border-gray-100"
      >
        <LogOut size={15} /> Sign out
      </button>
      <div className="hidden md:block px-4 py-3 border-t border-gray-100 text-[10px] text-gray-400">
        TransitOps © 2026 — Fleet OS
      </div>
    </aside>
  );
}
