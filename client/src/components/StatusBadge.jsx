import React from "react";

const STYLES = {
  Available: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "On Trip": "bg-sky-100 text-sky-700 border-sky-200",
  Completed: "bg-amber-100 text-amber-700 border-amber-200",
  Retired: "bg-red-100 text-red-700 border-red-200",
  Suspended: "bg-orange-100 text-orange-700 border-orange-200",
  Draft: "bg-gray-200 text-gray-700 border-gray-300",
  Dispatched: "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Off Duty": "bg-teal-100 text-teal-700 border-teal-200",
  "In Shop": "bg-yellow-100 text-yellow-800 border-yellow-200",
  Cancelled: "bg-rose-100 text-rose-700 border-rose-200",
};

const DOT = {
  Available: "bg-emerald-500",
  "On Trip": "bg-sky-500",
  Completed: "bg-amber-500",
  Retired: "bg-red-500",
  Suspended: "bg-orange-500",
  Draft: "bg-gray-500",
  Dispatched: "bg-indigo-500",
  "Off Duty": "bg-teal-500",
  "In Shop": "bg-yellow-500",
  Cancelled: "bg-rose-500",
};

export default function StatusBadge({ status }) {
  const cls = STYLES[status] || "bg-gray-100 text-gray-700 border-gray-200";
  const dot = DOT[status] || "bg-gray-500";
  return (
    <span data-testid={`status-${status}`} className={`to-badge border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}
