import React, { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { Plus, Fuel } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

export default function FuelExpenses() {
  const { fuel, expenses, vehicles, trips, addFuel, addExpense } = useApp();
  const [fForm, setFForm] = useState({ vehicleId: "", date: "", liters: "", cost: "" });
  const [eForm, setEForm] = useState({ tripId: "", vehicleId: "", toll: 0, misc: 0, driverAllowance: 0 });

  const nameOfVeh = (id) => vehicles.find((v) => v.id === id)?.name || "—";

  const totalOps = useMemo(() => {
    const f = fuel.reduce((s, x) => s + Number(x.cost || 0), 0);
    const e = expenses.reduce((s, x) => s + Number(x.total || 0), 0);
    return f + e;
  }, [fuel, expenses]);

  const submitFuel = (e) => {
    e.preventDefault();
    addFuel({ ...fForm, liters: Number(fForm.liters), cost: Number(fForm.cost) });
    setFForm({ vehicleId: "", date: "", liters: "", cost: "" });
  };
  const submitExp = (e) => {
    e.preventDefault();
    const total = Number(eForm.toll || 0) + Number(eForm.misc || 0) + Number(eForm.driverAllowance || 0);
    addExpense({ ...eForm, toll: Number(eForm.toll), misc: Number(eForm.misc), driverAllowance: Number(eForm.driverAllowance), total });
    setEForm({ tripId: "", vehicleId: "", toll: 0, misc: 0, driverAllowance: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Fuel &amp; Expense Management</h1>
        </div>
        <div className="to-card px-4 py-2">
          <div className="text-[10px] uppercase tracking-wider text-gray-500">Total operational cost</div>
          <div data-testid="total-ops-cost" className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">₹{totalOps.toLocaleString()}</div>
          <div className="text-[10px] text-gray-400">= FUEL + EXPENSES + MAINTENANCE</div>
        </div>
      </div>

      {/* Fuel logs */}
      <div className="to-card overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="text-sm font-bold text-slate-900 flex items-center gap-2"><Fuel size={14} /> Fuel logs</div>
          <form onSubmit={submitFuel} data-testid="fuel-form" className="flex flex-wrap items-end gap-2">
            <select required className="to-input w-36" data-testid="fuel-vehicle" value={fForm.vehicleId} onChange={(e) => setFForm({ ...fForm, vehicleId: e.target.value })}>
              <option value="">Vehicle</option>
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            <input required type="date" className="to-input w-40" data-testid="fuel-date" value={fForm.date} onChange={(e) => setFForm({ ...fForm, date: e.target.value })} />
            <input required type="number" placeholder="Liters" className="to-input w-24" data-testid="fuel-liters" value={fForm.liters} onChange={(e) => setFForm({ ...fForm, liters: e.target.value })} />
            <input required type="number" placeholder="Cost ₹" className="to-input w-28" data-testid="fuel-cost" value={fForm.cost} onChange={(e) => setFForm({ ...fForm, cost: e.target.value })} />
            <button data-testid="fuel-add" className="to-btn-primary"><Plus size={14} /> Log fuel</button>
          </form>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-200">
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Vehicle</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Liters</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Cost</th>
            </tr>
          </thead>
          <tbody data-testid="fuel-table">
            {fuel.map((f, i) => (
              <tr key={f.id} className={`transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-100"} hover:bg-amber-50`}>
                <td className="px-5 py-4 text-sm font-semibold text-slate-800">{nameOfVeh(f.vehicleId)}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{f.date}</td>
                <td className="px-5 py-4 text-sm tabular-nums text-slate-600">{f.liters} L</td>
                <td className="px-5 py-4 text-sm tabular-nums text-slate-600">₹{f.cost.toLocaleString()}</td>
              </tr>
            ))}
            {fuel.length === 0 && <tr><td className="px-5 py-12 text-center text-gray-400 text-sm" colSpan={4}>No fuel entries yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Expenses */}
      <div className="to-card overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="text-sm font-bold text-slate-900">Other expenses (toll / misc / allowance)</div>
          <form onSubmit={submitExp} data-testid="expense-form" className="flex flex-wrap items-end gap-2">
            <select required className="to-input w-32" data-testid="expense-trip" value={eForm.tripId} onChange={(e) => setEForm({ ...eForm, tripId: e.target.value })}>
              <option value="">Trip</option>
              {trips.map((t) => <option key={t.id} value={t.id}>{t.id}</option>)}
            </select>
            <select required className="to-input w-32" data-testid="expense-vehicle" value={eForm.vehicleId} onChange={(e) => setEForm({ ...eForm, vehicleId: e.target.value })}>
              <option value="">Vehicle</option>
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            <input type="number" placeholder="Toll" className="to-input w-24" data-testid="expense-toll" value={eForm.toll} onChange={(e) => setEForm({ ...eForm, toll: e.target.value })} />
            <input type="number" placeholder="Misc" className="to-input w-24" data-testid="expense-misc" value={eForm.misc} onChange={(e) => setEForm({ ...eForm, misc: e.target.value })} />
            <input type="number" placeholder="Allowance" className="to-input w-28" data-testid="expense-allowance" value={eForm.driverAllowance} onChange={(e) => setEForm({ ...eForm, driverAllowance: e.target.value })} />
            <button data-testid="expense-add" className="to-btn-primary"><Plus size={14} /> Add expense</button>
          </form>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-200">
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Trip</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Vehicle</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Toll</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Misc</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Allowance</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Total</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody data-testid="expense-table">
            {expenses.map((x, i) => {
              const trip = trips.find((t) => t.id === x.tripId);
              return (
                <tr key={x.id} className={`transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-100"} hover:bg-amber-50`}>
                  <td className="px-5 py-4 text-sm font-mono text-slate-600">{x.tripId}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-800">{nameOfVeh(x.vehicleId)}</td>
                  <td className="px-5 py-4 text-sm tabular-nums text-slate-600">₹{x.toll.toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm tabular-nums text-slate-600">₹{x.misc.toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm tabular-nums text-slate-600">₹{x.driverAllowance.toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm tabular-nums font-bold text-slate-800">₹{x.total.toLocaleString()}</td>
                  <td className="px-5 py-4">{trip && <StatusBadge status={trip.status} />}</td>
                </tr>
              );
            })}
            {expenses.length === 0 && <tr><td className="px-5 py-12 text-center text-gray-400 text-sm" colSpan={7}>No expenses yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
