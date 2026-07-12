import React, { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import StatusBadge from "@/components/StatusBadge";
import { Plus, X, Trash2, AlertCircle } from "lucide-react";

const empty = {
  regNo: "",
  name: "",
  type: "Van",
  capacity: 500,
  odometer: 0,
  acquisitionCost: 0,
  status: "Available",
};

export default function Fleet() {
  const { vehicles, addVehicle, deleteVehicle, updateVehicle, trips } = useApp();
  const [q, setQ] = useState("");
  const [type, setType] = useState("Type: All");
  const [status, setStatus] = useState("Status: All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  const rows = useMemo(
    () =>
      vehicles.slice().reverse().filter(
        (v) =>
          (type === "Type: All" || v.type === type.replace("Type: ", "")) &&
          (status === "Status: All" || v.status === status.replace("Status: ", "")) &&
          (q === "" ||
            v.regNo.toLowerCase().includes(q.toLowerCase()) ||
            v.name.toLowerCase().includes(q.toLowerCase())),
      ),
    [vehicles, q, type, status],
  );

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await addVehicle({
      ...form,
      capacity: Number(form.capacity),
      odometer: Number(form.odometer),
      acquisitionCost: Number(form.acquisitionCost),
    });
    if (!res.ok) return setError(res.error);
    setForm(empty);
    setShowForm(false);
  };

  const busy = (id) => trips.some((t) => t.vehicleId === id && (t.status === "On Trip" || t.status === "Dispatched"));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Vehicle Registry</h1>
          <p className="text-sm text-gray-500">Master data for all fleet assets.</p>
        </div>
        <button data-testid="fleet-add-btn" onClick={() => setShowForm((s) => !s)} className="to-btn-primary">
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? "Cancel" : "Add vehicle"}
        </button>
      </div>

      {/* filters */}
      <div className="to-card p-4 flex flex-wrap items-center gap-3">
        <select value={type} onChange={(e) => setType(e.target.value)} className="to-input w-auto min-w-[140px]" data-testid="fleet-filter-type">
          <option>Type: All</option><option>Type: Van</option><option>Type: Truck</option><option>Type: Mini</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="to-input w-auto min-w-[140px]" data-testid="fleet-filter-status">
          <option>Status: All</option><option>Status: Available</option><option>Status: On Trip</option><option>Status: In Shop</option><option>Status: Retired</option>
        </select>
        <input
          data-testid="fleet-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="to-input flex-1 min-w-[220px]"
          placeholder="Search reg no. or name…"
        />
      </div>

      {/* add form */}
      {showForm && (
        <form onSubmit={submit} data-testid="fleet-add-form" className="to-card p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><label className="to-label">Reg no.</label><input required className="to-input" data-testid="fleet-form-regno" value={form.regNo} onChange={(e) => setForm({ ...form, regNo: e.target.value })} /></div>
          <div><label className="to-label">Name / Model</label><input required className="to-input" data-testid="fleet-form-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="to-label">Type</label>
            <select className="to-input" data-testid="fleet-form-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option>Van</option><option>Truck</option><option>Mini</option>
            </select>
          </div>
          <div><label className="to-label">Capacity (kg)</label><input type="number" required className="to-input" data-testid="fleet-form-capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></div>
          <div><label className="to-label">Odometer</label><input type="number" className="to-input" data-testid="fleet-form-odometer" value={form.odometer} onChange={(e) => setForm({ ...form, odometer: e.target.value })} /></div>
          <div><label className="to-label">Acquisition cost (₹)</label><input type="number" className="to-input" data-testid="fleet-form-cost" value={form.acquisitionCost} onChange={(e) => setForm({ ...form, acquisitionCost: e.target.value })} /></div>
          <div><label className="to-label">Status</label>
            <select className="to-input" data-testid="fleet-form-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Available</option><option>In Shop</option><option>Retired</option>
            </select>
          </div>
          <div className="flex items-end">
            <button data-testid="fleet-form-submit" type="submit" className="to-btn-primary w-full justify-center">Save vehicle</button>
          </div>
          {error && (
            <div data-testid="fleet-form-error" className="col-span-full text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 text-sm flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </form>
      )}

      {/* table */}
      <div className="to-card overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-slate-200">
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Reg no.</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Name / model</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Capacity</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Odometer</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Acq. cost</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-5 py-3.5 text-right text-[11px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody data-testid="fleet-table">
            {rows.map((v, i) => (
              <tr key={v.id} className={`transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-100"} hover:bg-amber-50`}>
                <td className="px-5 py-4 text-sm font-mono text-slate-600">{v.regNo}</td>
                <td className="px-5 py-4 text-sm font-semibold text-slate-800">{v.name}</td>
                <td className="px-5 py-4 text-sm">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">{v.type}</span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{v.capacity} kg</td>
                <td className="px-5 py-4 text-sm tabular-nums text-slate-600">{v.odometer.toLocaleString()}</td>
                <td className="px-5 py-4 text-sm tabular-nums text-slate-600">₹{v.acquisitionCost.toLocaleString()}</td>
                <td className="px-5 py-4"><StatusBadge status={v.status} /></td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-1 divide-x divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    {v.status !== "Retired" && (
                      <button
                        onClick={() => updateVehicle(v.id, { status: "Retired" })}
                        className="px-3 py-1.5 text-xs font-semibold text-orange-600 hover:bg-orange-50 transition"
                        data-testid={`fleet-retire-${v.id}`}
                      >Retire</button>
                    )}
                    <button
                      disabled={busy(v.id)}
                      onClick={() => deleteVehicle(v.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition flex items-center gap-1 disabled:text-gray-400 disabled:cursor-not-allowed"
                      data-testid={`fleet-delete-${v.id}`}
                    ><Trash2 size={11} /> Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td className="px-5 py-12 text-center text-gray-400 text-sm" colSpan={8}>No vehicles match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}