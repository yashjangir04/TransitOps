import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import StatusBadge from "@/components/StatusBadge";
import { Save, ArrowRight } from "lucide-react";

export default function Maintenance() {
  const { maintenance, vehicles, addMaintenance, closeMaintenance } = useApp();
  const [form, setForm] = useState({ vehicleId: "", service: "", cost: "", date: "", status: "In Shop" });

  const submit = (e) => {
    e.preventDefault();
    if (!form.vehicleId) return;
    addMaintenance({ ...form, cost: Number(form.cost) });
    setForm({ vehicleId: "", service: "", cost: "", date: "", status: "In Shop" });
  };

  const nameOf = (id) => vehicles.find((v) => v.id === id)?.name || "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Maintenance</h1>
        <p className="text-sm text-gray-500">Service records — creating a record moves vehicle to &quot;In Shop&quot;.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.4fr] gap-6">
        <form onSubmit={submit} data-testid="maint-form" className="to-card p-5 space-y-4">
          <div className="text-sm font-bold text-slate-900">Log service record</div>
          <div>
            <label className="to-label">Vehicle</label>
            <select required value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} className="to-input" data-testid="maint-vehicle">
              <option value="">Select vehicle</option>
              {vehicles.filter((v) => v.status !== "Retired").map((v) => (<option key={v.id} value={v.id}>{v.name} · {v.regNo}</option>))}
            </select>
          </div>
          <div><label className="to-label">Service type</label><input required className="to-input" data-testid="maint-service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} placeholder="Oil change, tyre replace…" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="to-label">Cost (₹)</label><input required type="number" className="to-input" data-testid="maint-cost" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} /></div>
            <div><label className="to-label">Date</label><input required type="date" className="to-input" data-testid="maint-date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          </div>
          <div>
            <label className="to-label">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="to-input" data-testid="maint-status">
              <option>In Shop</option><option>Completed</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button className="to-btn-primary" data-testid="maint-submit"><Save size={14} /> Save record</button>
          </div>

          <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2">
            <StatusBadge status="Available" /> <ArrowRight size={12} /> <StatusBadge status="In Shop" />
            <span className="ml-2">→ vehicle auto-flagged when in shop.</span>
          </div>
        </form>

        <div className="to-card overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 text-sm font-bold text-slate-900">Service log</div>
          <table className="w-full">
            <thead>
              <tr className="bg-slate-200">
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Vehicle</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Service</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Cost</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-5 py-3.5 text-right text-[11px] font-bold text-slate-500 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody data-testid="maint-table">
              {maintenance.map((m, i) => (
                <tr key={m.id} className={`transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-100"} hover:bg-amber-50`}>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-800">{nameOf(m.vehicleId)}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{m.service}</td>
                  <td className="px-5 py-4 text-sm tabular-nums text-slate-600">₹{m.cost.toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{m.date}</td>
                  <td className="px-5 py-4"><StatusBadge status={m.status} /></td>
                  <td className="px-5 py-4 text-right">
                    {m.status === "In Shop" && (
                      <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        <button
                          data-testid={`maint-close-${m.id}`}
                          onClick={() => closeMaintenance(m.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition"
                        >Close &amp; return to service</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {maintenance.length === 0 && (
                <tr><td className="px-5 py-12 text-center text-gray-400 text-sm" colSpan={6}>No records.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
