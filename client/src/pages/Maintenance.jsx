import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import StatusBadge from "@/components/StatusBadge";
import { Save, ArrowRight } from "lucide-react";

export default function Maintenance() {
  const { maintenance, vehicles, addMaintenance, closeMaintenance } = useApp();
  const [form, setForm] = useState({ vehicleId: "", service: "", cost: "", date: "", status: "In Shop" });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.vehicleId) return;
    const res = await addMaintenance({ ...form, cost: Number(form.cost) });
    if (!res.ok) return alert(res.error);
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
        </form>

        <div className="to-card overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 text-sm font-bold text-slate-900">Service log</div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="to-th">Vehicle</th>
                <th className="to-th">Service</th>
                <th className="to-th">Cost</th>
                <th className="to-th">Date</th>
                <th className="to-th">Status</th>
                <th className="to-th text-right">Action</th>
              </tr>
            </thead>
            <tbody data-testid="maint-table">
              {maintenance.slice().reverse().map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition">
                  <td className="to-td font-semibold text-slate-900">{nameOf(m.vehicleId)}</td>
                  <td className="to-td">{m.service}</td>
                  <td className="to-td tabular-nums">₹{m.cost.toLocaleString()}</td>
                  <td className="to-td">{m.date}</td>
                  <td className="to-td"><StatusBadge status={m.status} /></td>
                  <td className="to-td text-right">
                    {m.status === "In Shop" && (
                      <button data-testid={`maint-close-${m.id}`} onClick={() => closeMaintenance(m.id)} className="text-xs font-semibold text-emerald-700 hover:underline">Close &amp; return to service</button>
                    )}
                  </td>
                </tr>
              ))}
              {maintenance.length === 0 && <tr><td className="to-td text-center text-gray-500 py-10" colSpan={6}>No records.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
