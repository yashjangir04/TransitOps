import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { RBAC, ROLES } from "@/lib/mockData";
import { RotateCcw, Save, Check, X } from "lucide-react";

const MODULES = [
  { key: "fleet", label: "Fleet" },
  { key: "drivers", label: "Drivers" },
  { key: "trips", label: "Trips" },
  { key: "fuel", label: "Fuel & Exp" },
  { key: "analytics", label: "Analytics" },
];

export default function Settings() {
  const { user, resetDemo } = useApp();
  const [company, setCompany] = useState("Gandhinagar Depot HQ");
  const [currency, setCurrency] = useState("INR (₹)");
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings &amp; RBAC</h1>
        <p className="text-sm text-gray-500">Company preferences and role-based access matrix.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="to-card p-5 space-y-4">
          <div className="text-sm font-bold text-slate-900">General</div>
          <div><label className="to-label">Depot / Company</label><input className="to-input" data-testid="settings-company" value={company} onChange={(e) => setCompany(e.target.value)} /></div>
          <div><label className="to-label">Currency</label>
            <select className="to-input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option>INR (₹)</option><option>USD ($)</option><option>EUR (€)</option>
            </select>
          </div>
          <div><label className="to-label">Signed in as</label>
            <input className="to-input" readOnly value={`${user?.name} · ${user?.email} · ${ROLES.find(r => r.id === user?.role)?.label}`} />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button data-testid="settings-save" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1500); }} className="to-btn-primary"><Save size={14} /> Save changes</button>
            <button data-testid="settings-reset-demo" onClick={() => { if (window.confirm("Reset all demo data?")) resetDemo(); }} className="to-btn-ghost"><RotateCcw size={14} /> Reset demo data</button>
            {saved && <span className="text-xs text-emerald-600 font-semibold">Saved.</span>}
          </div>
        </div>

        <div className="to-card p-5">
          <div className="text-sm font-bold text-slate-900 mb-3">Role-based access (RBAC)</div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="to-th">Role</th>
                  {MODULES.map((m) => <th key={m.key} className="to-th text-center">{m.label}</th>)}
                </tr>
              </thead>
              <tbody data-testid="settings-rbac-table">
                {ROLES.map((r) => (
                  <tr key={r.id}>
                    <td className="to-td font-semibold text-slate-900">{r.label}</td>
                    {MODULES.map((m) => {
                      const allowed = RBAC[m.key]?.includes(r.id);
                      return (
                        <td key={m.key} className="to-td text-center">
                          {allowed ? <Check size={16} className="text-emerald-600 inline" /> : <X size={16} className="text-gray-300 inline" />}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[11px] text-gray-500 mt-3">
            RBAC is enforced on the sidebar (locked entries) and each route guard. Change requires re-login for another role.
          </div>
        </div>
      </div>
    </div>
  );
}
