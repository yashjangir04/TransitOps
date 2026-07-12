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
      vehicles.filter(
        (v) =>
          (type === "Type: All" || v.type === type.replace("Type: ", "")) &&
          (status === "Status: All" || v.status === status.replace("Status: ", "")) &&
          (q === "" ||
            v.regNo.toLowerCase().includes(q.toLowerCase()) ||
            v.name.toLowerCase().includes(q.toLowerCase())),
      ),
    [vehicles, q, type, status],
  );

  const submit = (e) => {
    e.preventDefault();
    setError("");
    const res = addVehicle({
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
          <thead className="bg-gray-50">
            <tr>
              <th className="to-th">Reg no.</th>
              <th className="to-th">Name / model</th>
              <th className="to-th">Type</th>
              <th className="to-th">Capacity</th>
              <th className="to-th">Odometer</th>
              <th className="to-th">Acq. cost</th>
              <th className="to-th">Status</th>
              <th className="to-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody data-testid="fleet-table">
            {rows.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50 transition">
                <td className="to-td font-mono">{v.regNo}</td>
                <td className="to-td font-semibold text-slate-900">{v.name}</td>
                <td className="to-td">{v.type}</td>
                <td className="to-td">{v.capacity} kg</td>
                <td className="to-td tabular-nums">{v.odometer.toLocaleString()}</td>
                <td className="to-td tabular-nums">₹{v.acquisitionCost.toLocaleString()}</td>
                <td className="to-td"><StatusBadge status={v.status} /></td>
                <td className="to-td text-right">
                  {v.status !== "Retired" && (
                    <button
                      onClick={() => updateVehicle(v.id, { status: "Retired" })}
                      className="text-xs font-semibold text-orange-600 hover:underline mr-3"
                      data-testid={`fleet-retire-${v.id}`}
                    >Retire</button>
                  )}
                  <button
                    disabled={busy(v.id)}
                    onClick={() => deleteVehicle(v.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline disabled:text-gray-400 disabled:no-underline"
                    data-testid={`fleet-delete-${v.id}`}
                  ><Trash2 size={12} /> Delete</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td className="to-td text-center text-gray-500 py-10" colSpan={8}>No vehicles match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}