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
      className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col"
    >
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center">
            <div className="w-3 h-3 bg-amber-400 rounded-sm" />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 tracking-tight text-lg leading-none">
              TransitOps
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5 tracking-wide">
              Smart Transport Ops
            </div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
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
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition",
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
              <span>{label}</span>
              {!allowed && (
                <span className="ml-auto text-[9px] uppercase tracking-wider text-gray-400">
                  locked
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
      <button
        data-testid="sidebar-logout"
        onClick={logout}
        className="mx-3 mb-4 flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 border border-gray-100"
      >
        <LogOut size={15} /> Sign out
      </button>
      <div className="px-4 py-3 border-t border-gray-100 text-[10px] text-gray-400">
        TransitOps © 2026 — Fleet OS
      </div>
    </aside>
  );
}
