import React from "react";
import { Search, Bell } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ROLES } from "@/lib/mockData";

export default function Topbar() {
  const { user } = useApp();
  const roleLabel = ROLES.find((r) => r.id === user?.role)?.label || user?.role;
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";
  return (
    <header
      data-testid="topbar"
      className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4"
    >
      <div className="relative flex-1 max-w-xl">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          data-testid="topbar-search"
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="Search vehicles, drivers, trips…"
        />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
        </button>
        <div
          data-testid="topbar-user"
          className="flex items-center gap-2 pl-3 border-l border-gray-100"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
            {initial}
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-semibold text-slate-900 leading-none">
              {user?.name}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">{user?.email}</div>
          </div>
        </div>
        <span
          data-testid="topbar-role"
          className="ml-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-white text-xs font-bold shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          {roleLabel}
        </span>
      </div>
    </header>
  );
}
