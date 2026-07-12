import React, { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import StatusBadge from "@/components/StatusBadge";
import { AlertCircle, Send, CheckCircle2, X } from "lucide-react";

const emptyTrip = { source: "", destination: "", vehicleId: "", driverId: "", cargoWeight: "", plannedDistance: "" };

export default function Trips() {
  const { trips, vehicles, drivers, createTrip, dispatchTrip, completeTrip, cancelTrip } = useApp();
  const [form, setForm] = useState(emptyTrip);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");

  const availableVehicles = vehicles.filter((v) => v.status === "Available");
  const availableDrivers = drivers.filter((d) => d.status === "Available" && new Date(d.expiry) >= new Date());

  const veh = vehicles.find((v) => v.id === form.vehicleId);
  const capacityWarn = veh && Number(form.cargoWeight) > veh.capacity;

  const submit = (e) => {
    e.preventDefault();
    setError("");
    const res = createTrip({ ...form, cargoWeight: Number(form.cargoWeight), plannedDistance: Number(form.plannedDistance) });
    if (!res.ok) return setError(res.error);
    setFlash(`Trip ${res.id} created in Draft. Dispatch when ready.`);
    setForm(emptyTrip);
    setTimeout(() => setFlash(""), 3000);
  };

  const grouped = useMemo(() => {
    const g = { Draft: [], Dispatched: [], "On Trip": [], Completed: [], Cancelled: [] };
    trips.forEach((t) => (g[t.status] || (g[t.status] = [])).push(t));
    return g;
  }, [trips]);

  const nameOf = (id, list) => list.find((x) => x.id === id)?.name || "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Trip Dispatcher</h1>
        <p className="text-sm text-gray-500">Create, dispatch and monitor trips end-to-end.</p>
      </div>

      {/* Lifecycle steps */}
      <div data-testid="trip-lifecycle" className="to-card p-5">
        <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">Trip lifecycle</div>
        <div className="flex items-center gap-3 flex-wrap">
          {["Draft", "Dispatched", "On Trip", "Completed", "Cancelled"].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${i === 0 ? "bg-gray-100 text-gray-700 border-gray-200" : i === 4 ? "bg-rose-100 text-rose-700 border-rose-200" : "bg-white text-slate-700 border-gray-200"}`}>
                <span className="tabular-nums font-mono text-[10px]">0{i + 1}</span>
                {s}
                <span className="text-gray-400 ml-1">· {grouped[s]?.length || 0}</span>
              </div>
              {i < 4 && <span className="text-gray-300">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Create trip */}
        <form onSubmit={submit} data-testid="trip-create-form" className="to-card p-5 space-y-4">
          <div className="text-sm font-bold text-slate-900">Create trip</div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="to-label">Source</label><input required className="to-input" data-testid="trip-source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} /></div>
            <div><label className="to-label">Destination</label><input required className="to-input" data-testid="trip-destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} /></div>
            <div><label className="to-label">Vehicle (available only)</label>
              <select required className="to-input" data-testid="trip-vehicle" value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}>
                <option value="">Select vehicle</option>
                {availableVehicles.map((v) => (
                  <option key={v.id} value={v.id}>{v.name} · {v.capacity}kg cap</option>
                ))}
              </select>
            </div>
            <div><label className="to-label">Driver (license valid)</label>
              <select required className="to-input" data-testid="trip-driver" value={form.driverId} onChange={(e) => setForm({ ...form, driverId: e.target.value })}>
                <option value="">Select driver</option>
                {availableDrivers.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} · {d.category}</option>
                ))}
              </select>
            </div>
            <div><label className="to-label">Cargo weight (kg)</label><input required type="number" className="to-input" data-testid="trip-cargo" value={form.cargoWeight} onChange={(e) => setForm({ ...form, cargoWeight: e.target.value })} /></div>
            <div><label className="to-label">Planned distance (km)</label><input required type="number" className="to-input" data-testid="trip-distance" value={form.plannedDistance} onChange={(e) => setForm({ ...form, plannedDistance: e.target.value })} /></div>
          </div>

          {capacityWarn && (
            <div data-testid="trip-capacity-warn" className="border-2 border-dashed border-red-300 bg-red-50 text-red-700 rounded-lg p-3 text-sm flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5" />
              <div>
                <div className="font-semibold">Vehicle capacity {veh.capacity} kg</div>
                <div className="text-xs">Cargo weight {form.cargoWeight} kg — capacity exceeded, dispatch will be blocked.</div>
              </div>
            </div>
          )}
          {error && (
            <div data-testid="trip-error" className="border border-red-200 bg-red-50 text-red-700 rounded-lg p-3 text-sm flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          {flash && (
            <div data-testid="trip-success" className="border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-lg p-3 text-sm flex items-center gap-2">
              <CheckCircle2 size={14} /> {flash}
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="reset" onClick={() => setForm(emptyTrip)} className="to-btn-ghost">Cancel</button>
            <button type="submit" data-testid="trip-submit" disabled={capacityWarn} className="to-btn-primary">Create draft</button>
          </div>
        </form>

        {/* Live board */}
        <div data-testid="trip-live-board" className="to-card p-5">
          <div className="text-sm font-bold text-slate-900 mb-3">Live board</div>
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {trips.slice().reverse().map((t) => (
              <div key={t.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-sm font-bold text-slate-900">{t.id}</div>
                  <StatusBadge status={t.status} />
                </div>
                <div className="text-xs text-gray-600">
                  {t.source} <span className="text-gray-400">→</span> {t.destination}
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                  <span>Vehicle: <b className="text-slate-800">{nameOf(t.vehicleId, vehicles)}</b></span>
                  <span>Driver: <b className="text-slate-800">{nameOf(t.driverId, drivers)}</b></span>
                  <span className="ml-auto tabular-nums">{t.cargoWeight}kg · {t.plannedDistance}km</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {t.status === "Draft" && (
                    <button onClick={() => dispatchTrip(t.id)} data-testid={`dispatch-${t.id}`} className="text-xs font-bold inline-flex items-center gap-1 text-indigo-700 hover:underline"><Send size={12} /> Dispatch</button>
                  )}
                  {(t.status === "On Trip" || t.status === "Dispatched") && (
                    <button onClick={() => completeTrip(t.id)} data-testid={`complete-${t.id}`} className="text-xs font-bold inline-flex items-center gap-1 text-emerald-700 hover:underline"><CheckCircle2 size={12} /> Complete</button>
                  )}
                  {t.status !== "Completed" && t.status !== "Cancelled" && (
                    <button onClick={() => cancelTrip(t.id)} data-testid={`cancel-${t.id}`} className="text-xs font-bold inline-flex items-center gap-1 text-rose-600 hover:underline ml-auto"><X size={12} /> Cancel</button>
                  )}
                </div>
              </div>
            ))}
            {trips.length === 0 && <div className="text-center text-sm text-gray-500 py-10">No trips yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
