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
      drivers.filter(
        (d) =>
          (status === "All" || d.status === status) &&
          (q === "" ||
            d.name.toLowerCase().includes(q.toLowerCase()) ||
            d.licenseNo.toLowerCase().includes(q.toLowerCase())),
      ),
    [drivers, q, status],
  );

  const submit = (e) => {
    e.preventDefault();
    addDriver({ ...form, tripsCompleted: Number(form.tripsCompleted), safetyScore: Number(form.safetyScore) });
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
          <thead>
            <tr className="bg-slate-200">
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Driver</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">License No.</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Category</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Expiry</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Contact</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Trips</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Safety</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-5 py-3.5 text-right text-[11px] font-bold text-slate-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody data-testid="drivers-table">
            {rows.map((d, i) => (
              <tr key={d.id} className={`transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-100"} hover:bg-amber-50`}>
                <td className="px-5 py-4 text-sm font-semibold text-slate-800">{d.name}</td>
                <td className="px-5 py-4 text-sm font-mono text-slate-600">{d.licenseNo}</td>
                <td className="px-5 py-4 text-sm">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">{d.category}</span>
                </td>
                <td className="px-5 py-4 text-sm">
                  {isExpired(d) ? (
                    <span className="inline-flex items-center gap-1.5 text-red-500 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
                      {d.expiry} · expired
                    </span>
                  ) : (
                    <span className="text-slate-600">{d.expiry}</span>
                  )}
                </td>
                <td className="px-5 py-4 text-sm text-slate-500">{d.contact}</td>
                <td className="px-5 py-4 text-sm tabular-nums font-semibold text-slate-700">{d.tripsCompleted}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${d.safetyScore > 90 ? "bg-emerald-500" : d.safetyScore > 80 ? "bg-amber-400" : "bg-red-500"}`}
                        style={{ width: `${d.safetyScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold tabular-nums text-slate-600">{d.safetyScore}%</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  {d.status === "Available" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Available
                    </span>
                  )}
                  {d.status === "Suspended" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Suspended
                    </span>
                  )}
                  {d.status === "On Trip" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>On Trip
                    </span>
                  )}
                  {d.status === "Off Duty" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Off Duty
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-1 divide-x divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    {d.status !== "Suspended" ? (
                      <button
                        className="px-3 py-1.5 text-xs font-semibold text-orange-600 hover:bg-orange-50 transition"
                        data-testid={`drivers-suspend-${d.id}`}
                        onClick={() => updateDriver(d.id, { status: "Suspended" })}
                      >Suspend</button>
                    ) : (
                      <button
                        className="px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 transition"
                        data-testid={`drivers-reinstate-${d.id}`}
                        onClick={() => updateDriver(d.id, { status: "Available" })}
                      >Reinstate</button>
                    )}
                    <button
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition flex items-center gap-1"
                      data-testid={`drivers-delete-${d.id}`}
                      onClick={() => deleteDriver(d.id)}
                    ><Trash2 size={11} /> Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td className="px-5 py-12 text-center text-gray-400 text-sm" colSpan={9}>No drivers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



