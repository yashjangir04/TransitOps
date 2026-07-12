import React, { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import KpiCard from "@/components/KpiCard";
import { Fuel, Gauge, DollarSign, TrendingUp, Download, Printer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

export default function Analytics() {
  const { vehicles, trips, fuel, expenses, maintenance } = useApp();

  const totals = useMemo(() => {
    const totalFuelL = fuel.reduce((s, f) => s + f.liters, 0);
    const totalKm = trips.filter((t) => t.status === "Completed" || t.status === "On Trip").reduce((s, t) => s + (t.plannedDistance || 0), 0);
    const eff = totalFuelL > 0 ? (totalKm / totalFuelL).toFixed(1) : "0.0";
    const totalOps = fuel.reduce((s, f) => s + f.cost, 0) + expenses.reduce((s, e) => s + e.total, 0) + maintenance.reduce((s, m) => s + m.cost, 0);
    const busy = vehicles.filter((v) => v.status === "On Trip" || v.status === "In Shop").length;
    const util = vehicles.length ? Math.round((busy / vehicles.length) * 100) : 0;
    
    // Use ACTUAL revenue from database trips instead of mock multiplier
    const revenue = trips.reduce((s, t) => s + (t.revenue || 0), 0);
    
    const acquisitionTotal = vehicles.reduce((s, v) => s + v.acquisitionCost, 0) || 1;
    const roi = ((revenue - totalOps) / acquisitionTotal) * 100;
    return { eff, util, totalOps, roi: roi.toFixed(1), revenue };
  }, [vehicles, trips, fuel, expenses, maintenance]);

  const monthly = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const data = [];
    
    // Initialize the last 6 months
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      if (m < 0) m += 12;
      data.push({ m: months[m], rev: 0, index: m });
    }

    // Since we don't have createdAt in the frontend Trip context yet, we'll just aggregate all revenue into the current month 
    // for this demonstration, or if we added it, we'd parse it here.
    // For now, let's just put all completed trip revenues into the current month so the chart works without mock data.
    trips.forEach(t => {
        if (t.status === "Completed" && t.revenue > 0) {
            // Assume it was completed this month since we don't have a completion date in the state
            data[5].rev += t.revenue; 
        }
    });

    return data;
  }, [trips]);

  const costliest = useMemo(() => {
    const map = {};
    fuel.forEach((f) => (map[f.vehicleId] = (map[f.vehicleId] || 0) + f.cost));
    maintenance.forEach((m) => (map[m.vehicleId] = (map[m.vehicleId] || 0) + m.cost));
    expenses.forEach((e) => (map[e.vehicleId] = (map[e.vehicleId] || 0) + e.total));
    return Object.entries(map)
      .map(([id, cost]) => ({ vehicle: vehicles.find((v) => v.id == id)?.name || id, cost }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 4);
  }, [fuel, maintenance, expenses, vehicles]);

  const exportCSV = () => {
    const rows = [
      ["--- VEHICLE LOGS ---"],
      ["Vehicle", "Reg no", "Type", "Capacity", "Odometer", "Cost", "Status"],
      ...vehicles.map((v) => [v.name, v.regNo, v.type, v.capacity, v.odometer, v.acquisitionCost, v.status]),
      [],
      ["--- TRIP LOGS ---"],
      ["Trip ID", "Source", "Destination", "Cargo (kg)", "Distance (km)", "Revenue", "Status"],
      ...trips.map((t) => [t.id, t.source, t.destination, t.cargoWeightKg, t.plannedDistance, t.revenue || 0, t.status]),
      [],
      ["--- FUEL LOGS ---"],
      ["Date", "Vehicle", "Liters", "Cost"],
      ...fuel.map((f) => [new Date(f.createdAt).toLocaleDateString(), vehicles.find(v => v.id === f.vehicleId)?.name || f.vehicleId, f.liters, f.cost]),
      [],
      ["--- MAINTENANCE LOGS ---"],
      ["Date", "Vehicle", "Service", "Cost", "Status"],
      ...maintenance.map((m) => [new Date(m.createdAt).toLocaleDateString(), vehicles.find(v => v.id === m.vehicleId)?.name || m.vehicleId, m.service, m.cost, m.status])
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transitops-complete-logs.csv";
    link.click();
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      <div className="flex items-center justify-between flex-wrap gap-3 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reports &amp; Analytics</h1>
        </div>
        <div className="flex items-center gap-2">
          <button data-testid="analytics-export-pdf" onClick={exportPDF} className="to-btn-ghost"><Printer size={14} /> PDF Report</button>
          <button data-testid="analytics-export" onClick={exportCSV} className="to-btn-ghost"><Download size={14} /> Export CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard testid="kpi-efficiency" label="Fuel efficiency" value={`${totals.eff} km/L`} icon={Fuel} accent="emerald" />
        <KpiCard testid="kpi-utilization2" label="Fleet utilization" value={`${totals.util}%`} icon={Gauge} accent="amber" />
        <KpiCard testid="kpi-opcost" label="Operational cost" value={`₹${totals.totalOps.toLocaleString()}`} icon={DollarSign} accent="rose" />
        <KpiCard testid="kpi-roi" label="Vehicle ROI" value={`${totals.roi}%`} icon={TrendingUp} accent="sky" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
        <div className="to-card p-5">
          <div className="text-sm font-bold text-slate-900 mb-4">Revenue (Last 6 Months)</div>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={monthly} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="m" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip cursor={{ fill: "rgba(245,158,11,0.08)" }} formatter={(v) => `₹${v.toLocaleString()}`} />
                <Bar dataKey="rev" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="to-card p-5">
          <div className="text-sm font-bold text-slate-900 mb-4">Top costliest vehicles</div>
          {costliest.map((c) => {
            const max = costliest[0]?.cost || 1;
            const pct = Math.round((c.cost / max) * 100);
            return (
              <div key={c.vehicle} className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800">{c.vehicle}</span>
                  <span className="font-mono tabular-nums text-gray-500">₹{c.cost.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-amber-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          {costliest.length === 0 && <div className="text-sm text-gray-500 py-6 text-center">No cost data.</div>}
        </div>
      </div>
    </div>
  );
}
