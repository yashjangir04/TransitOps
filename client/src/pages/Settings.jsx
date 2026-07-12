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
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Role Based Access Control</h1>
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
            {saved && <span className="text-xs text-emerald-600 font-semibold">Saved.</span>}
          </div>
        </div>


      </div>
    </div>
  );
}
