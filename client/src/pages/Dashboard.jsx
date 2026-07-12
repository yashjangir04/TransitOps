// This is the DashBoard of the TransitOps
import React, { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import KpiCard from "@/components/KpiCard";
import StatusBadge from "@/components/StatusBadge";
import { Truck, CheckCircle2, Wrench, Route, Clock, Users, Gauge } from "lucide-react";

export default function Dashboard() {
  const { vehicles, drivers, trips } = useApp();
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const [region, setRegion] = useState("All");

  const filtered = useMemo(
    () =>
      vehicles.filter(
        (v) =>
          (type === "All" || v.type === type) &&
          (status === "All" || v.status === status),
      ),
    [vehicles, type, status],
  );

  const kpis = useMemo(() => {
    const total = vehicles.length;
    const available = vehicles.filter((v) => v.status === "Available").length;
    const inShop = vehicles.filter((v) => v.status === "In Shop").length;
    const active = trips.filter((t) => t.status === "On Trip" || t.status === "Dispatched").length;
    const pending = trips.filter((t) => t.status === "Draft").length;
    const onDuty = drivers.filter((d) => d.status === "Available" || d.status === "On Trip").length;
    const utilization = total ? Math.round(((total - available) / total) * 100) : 0;
    return { total, available, inShop, active, pending, onDuty, utilization };
  }, [vehicles, drivers, trips]);

  const statusCounts = useMemo(() => {
    const counts = { "On Trip": 0, "In Shop": 0, Retired: 0, Available: 0 };
    filtered.forEach((v) => (counts[v.status] = (counts[v.status] || 0) + 1));
    return counts;
  }, [filtered]);

  const recentTrips = trips.slice(-4).reverse();
  const nameOf = (id, list, key = "name") =>
    list.find((x) => x.id === id)?.[key] || "—";

  return (
    <div className="space-y-6">
      {/* Header removed */}

      {/* Filters */}
      <div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Filters</div>
        <div data-testid="dashboard-filters" className="to-card p-4 flex flex-wrap gap-3">
          <select value={type} onChange={(e) => setType(e.target.value)} className="to-input w-auto min-w-[160px]" data-testid="filter-type">
            <option value="All">Vehicle Type: All</option><option value="Van">Van</option><option value="Truck">Truck</option><option value="Mini">Mini</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="to-input w-auto min-w-[160px]" data-testid="filter-status">
            <option value="All">Status: All</option><option value="Available">Available</option><option value="On Trip">On Trip</option><option value="In Shop">In Shop</option><option value="Retired">Retired</option>
          </select>
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="to-input w-auto min-w-[160px]" data-testid="filter-region">
            <option value="All">Region: All</option><option value="North">North</option><option value="South">South</option><option value="East">East</option><option value="West">West</option>
          </select>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4">
        <KpiCard testid="kpi-active-vehicles" label="Active vehicles" value={kpis.total} icon={Truck} accent="slate" />
        <KpiCard testid="kpi-available" label="Available" value={kpis.available} icon={CheckCircle2} accent="emerald" />
        <KpiCard testid="kpi-in-shop" label="In maintenance" value={kpis.inShop} icon={Wrench} accent="amber" />
        <KpiCard testid="kpi-active-trips" label="Active trips" value={kpis.active} icon={Route} accent="sky" />
        <KpiCard testid="kpi-pending" label="Pending trips" value={kpis.pending} icon={Clock} accent="indigo" />
        <KpiCard testid="kpi-on-duty" label="Drivers on duty" value={kpis.onDuty} icon={Users} accent="rose" />
        <KpiCard testid="kpi-utilization" label="Fleet utilization" value={`${kpis.utilization}%`} icon={Gauge} accent="amber" />
      </div>

      {/* Recent trips + Vehicle status */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 to-card overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="text-sm font-bold text-slate-900">Recent trips</div>
            <div className="text-xs text-gray-500">{recentTrips.length} shown</div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-200">
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Trip</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Vehicle</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Driver</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">ETA</th>
              </tr>
            </thead>
            <tbody data-testid="dashboard-recent-trips">
              {recentTrips.map((t, i) => (
                <tr key={t.id} className={`transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-100"} hover:bg-amber-50`}>
                  <td className="px-5 py-4 text-sm font-mono font-semibold text-slate-800">{t.id}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{nameOf(t.vehicleId, vehicles)}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{nameOf(t.driverId, drivers)}</td>
                  <td className="px-5 py-4"><StatusBadge status={t.status} /></td>
                  <td className="px-5 py-4 text-sm text-slate-500">{t.status === "Completed" ? "—" : t.plannedDistance ? `~${t.plannedDistance} km` : "Awaiting vehicle"}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

        <div className="to-card p-5">
          <div className="text-sm font-bold text-slate-900 mb-4">Vehicle status</div>
          {Object.entries(statusCounts).map(([label, count]) => {
            const total = filtered.length || 1;
            const pct = Math.round((count / total) * 100);
            const bar = {
              "On Trip": "bg-sky-500",
              "In Shop": "bg-amber-500",
              Retired: "bg-red-500",
              Available: "bg-emerald-500",
            }[label];
            return (
              <div key={label} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">{label}</span>
                  <span className="text-gray-500 tabular-nums">{count} · {pct}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${bar} transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
