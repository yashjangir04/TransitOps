import React from "react";

export default function KpiCard({ label, value, hint, accent = "amber", icon: Icon, testid }) {
  const bar = {
    amber: "from-amber-400 to-amber-600",
    emerald: "from-emerald-400 to-emerald-600",
    sky: "from-sky-400 to-sky-600",
    indigo: "from-indigo-400 to-indigo-600",
    rose: "from-rose-400 to-rose-600",
    slate: "from-slate-600 to-slate-900",
  }[accent];
  return (
    <div
      data-testid={testid}
      className="relative to-card p-4 overflow-hidden hover:shadow-sm transition"
    >
      <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${bar}`} />
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            {label}
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900 tabular-nums font-mono">
            {value}
          </div>
          {hint && <div className="mt-1 text-[11px] text-gray-500">{hint}</div>}
        </div>
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center">
            <Icon size={16} />
          </div>
        )}
      </div>
    </div>
  );
}
