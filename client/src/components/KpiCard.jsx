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
  const iconTheme = {
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    sky: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    slate: "bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400",
  }[accent];

  return (
    <div
      data-testid={testid}
      className="relative to-card p-4 overflow-hidden hover:shadow-sm transition"
    >
      <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${bar}`} />
      <div className="flex items-start justify-between">
        <div>
          <div className="h-8 flex items-start text-[11px] font-semibold text-gray-500 uppercase tracking-wider leading-tight">
            {label}
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums font-mono">
            {value}
          </div>
          {hint && <div className="mt-1 text-[11px] text-gray-500">{hint}</div>}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${iconTheme}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
    </div>
  );
}
