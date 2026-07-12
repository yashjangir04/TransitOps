import React, { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import StatusBadge from "@/components/StatusBadge";
import { Plus, X, Trash2 } from "lucide-react";

const empty = {
  name: "",
  licenseNo: "",
  category: "LMV",
  expiry: "",
  contact: "",
  tripsCompleted: 0,
  safetyScore: 90,
  status: "Available",
};

export default function Drivers() {
  const { drivers, addDriver, deleteDriver, updateDriver } = useApp();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);

  const rows = useMemo(
    () =>
      drivers.slice().reverse().filter(
        (d) =>
          (status === "All" || d.status === status) &&
          (q === "" ||
            d.name.toLowerCase().includes(q.toLowerCase()) ||
            d.licenseNo.toLowerCase().includes(q.toLowerCase())),
      ),
    [drivers, q, status],
  );

  const submit = async (e) => {
    e.preventDefault();
    const res = await addDriver({ ...form, tripsCompleted: Number(form.tripsCompleted), safetyScore: Number(form.safetyScore) });
    if (!res.ok) return alert(res.error);
    setForm(empty);
    setShowForm(false);
  };

  const isExpired = (d) => new Date(d.expiry) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Drivers &amp; Safety Profiles</h1>
          <p className="text-sm text-gray-500">Track licenses, safety scores and duty status.</p>
        </div>
        <button data-testid="drivers-add-btn" onClick={() => setShowForm((s) => !s)} className="to-btn-primary">
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? "Cancel" : "Add driver"}
        </button>
      </div>

      <div className="to-card p-4 flex flex-wrap gap-3">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="to-input w-auto min-w-[140px]" data-testid="drivers-filter-status">
          <option>All</option><option>Available</option><option>On Trip</option><option>Off Duty</option><option>Suspended</option>
        </select>
        <input data-testid="drivers-search" value={q} onChange={(e) => setQ(e.target.value)} className="to-input flex-1 min-w-[220px]" placeholder="Search name or license…" />
      </div>

      {showForm && (
        <form onSubmit={submit} data-testid="drivers-add-form" className="to-card p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><label className="to-label">Name</label><input required className="to-input" data-testid="drivers-form-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label className="to-label">License no.</label><input required className="to-input" data-testid="drivers-form-license" value={form.licenseNo} onChange={(e) => setForm({ ...form, licenseNo: e.target.value })} /></div>
          <div><label className="to-label">Category</label>
            <select className="to-input" data-testid="drivers-form-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>LMV</option><option>HMV</option><option>MCWG</option>
            </select>
          </div>
          <div><label className="to-label">Expiry</label><input required type="date" className="to-input" data-testid="drivers-form-expiry" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} /></div>
          <div><label className="to-label">Contact</label><input className="to-input" data-testid="drivers-form-contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
          <div><label className="to-label">Trips completed</label><input type="number" className="to-input" value={form.tripsCompleted} onChange={(e) => setForm({ ...form, tripsCompleted: e.target.value })} /></div>
          <div><label className="to-label">Safety score</label><input type="number" min="0" max="100" className="to-input" value={form.safetyScore} onChange={(e) => setForm({ ...form, safetyScore: e.target.value })} /></div>
          <div><label className="to-label">Status</label>
            <select className="to-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Available</option><option>Off Duty</option><option>Suspended</option>
            </select>
          </div>
          <div className="col-span-full flex justify-end">
            <button data-testid="drivers-form-submit" className="to-btn-primary">Save driver</button>
          </div>
        </form>
      )}

      <div className="to-card overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="to-th">Driver</th>
              <th className="to-th">License no.</th>
              <th className="to-th">Category</th>
              <th className="to-th">Expiry</th>
              <th className="to-th">Contact</th>
              <th className="to-th">Trips</th>
              <th className="to-th">Safety</th>
              <th className="to-th">Status</th>
              <th className="to-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody data-testid="drivers-table">
            {rows.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 transition">
                <td className="to-td font-semibold text-slate-900">{d.name}</td>
                <td className="to-td font-mono">{d.licenseNo}</td>
                <td className="to-td">{d.category}</td>
                <td className="to-td">
                  <span className={isExpired(d) ? "text-red-600 font-semibold" : ""}>{d.expiry} {isExpired(d) && "· expired"}</span>
                </td>
                <td className="to-td text-gray-600">{d.contact}</td>
                <td className="to-td tabular-nums">{d.tripsCompleted}</td>
                <td className="to-td">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${d.safetyScore > 90 ? "bg-emerald-500" : d.safetyScore > 80 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${d.safetyScore}%` }} />
                    </div>
                    <span className="text-xs tabular-nums font-mono">{d.safetyScore}%</span>
                  </div>
                </td>
                <td className="to-td"><StatusBadge status={d.status} /></td>
                <td className="to-td text-right">
                  {d.status !== "Suspended" ? (
                    <button className="text-xs text-orange-600 font-semibold hover:underline mr-3" data-testid={`drivers-suspend-${d.id}`} onClick={() => updateDriver(d.id, { status: "Suspended" })}>Suspend</button>
                  ) : (
                    <button className="text-xs text-emerald-600 font-semibold hover:underline mr-3" data-testid={`drivers-reinstate-${d.id}`} onClick={() => updateDriver(d.id, { status: "Available" })}>Reinstate</button>
                  )}
                  <button className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline" data-testid={`drivers-delete-${d.id}`} onClick={() => deleteDriver(d.id)}><Trash2 size={12} /> Delete</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td className="to-td text-center text-gray-500 py-10" colSpan={9}>No drivers.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}


