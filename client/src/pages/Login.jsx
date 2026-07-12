import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { ROLES } from "@/lib/mockData";
import { Navigate } from "react-router-dom";
import { AlertCircle, ArrowRight } from "lucide-react";

export default function Login() {
  const { login, user } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("fleet_manager");
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(true);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(email.trim(), password, role);
    if (!res.ok) setError(res.error);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[420px_1fr] bg-white">
      {/* Left dark panel */}
      <aside className="bg-slate-900 text-white flex flex-col p-8 justify-between relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2">
            <img src="/icon-main.svg" alt="TransitOps" className="w-10 h-10" />
            <div>
              <div className="font-extrabold text-2xl tracking-tight leading-none">TransitOps</div>
              <div className="text-[11px] text-slate-400 mt-1 tracking-wide">
                Smart Transport Operations Platform
              </div>
            </div>
          </div>

          <div className="mt-12">
            <div className="text-xs uppercase tracking-widest text-slate-400 mb-3">
              One login, four roles
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Please use the credentials provided by your system administrator to log in. Ensure you select the correct role associated with your account.
            </p>
            <div className="text-xs text-slate-400 border border-slate-700 rounded-md p-3 bg-slate-800/50">
              <strong className="text-amber-400 block mb-1">Seeded Accounts:</strong>
              fleetmanager@gmail.com<br/>
              dispatcher@gmail.com<br/>
              safetyofficer@gmail.com<br/>
              financialanalyst@gmail.com<br/>
              <span className="text-slate-500 mt-2 block">Default password: password123</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-500">TransitOps © 2026 — Fleet Operating System</div>

        {/* decorative */}
        <div className="pointer-events-none absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl" />
      </aside>

      {/* Right form */}
      <section className="flex items-center justify-center p-6 md:p-12">
        <form
          data-testid="login-form"
          onSubmit={handleSubmit}
          className="w-full max-w-md"
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Enter your credentials to continue.
          </p>

          <div className="mt-8 space-y-5">
            <div>
              <label className="to-label">Email</label>
              <input
                data-testid="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@gmail.com"
                className="to-input"
              />
            </div>
            <div>
              <label className="to-label">Password</label>
              <input
                data-testid="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="to-input"
              />
            </div>
            <div>
              <label className="to-label">Role select</label>
              <select
                data-testid="login-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="to-input"
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div
              data-testid="login-error"
              className="mt-5 border-2 border-dashed border-red-300 bg-red-50 text-red-700 rounded-lg p-3 text-sm flex items-start gap-2"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold">Error state</div>
                <div className="text-red-600 text-xs mt-0.5">{error}</div>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-amber-500"
              />
              Remember me
            </label>
            <a href="#" className="text-sm text-amber-600 font-semibold hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            data-testid="login-submit"
            type="submit"
            className="mt-6 w-full to-btn-primary justify-center py-3 text-base"
          >
            Sign In
            <ArrowRight size={16} />
          </button>

          <div className="mt-8 text-xs text-gray-500 leading-6">
            <div className="font-semibold text-gray-600 mb-1">Access is scoped by role after login:</div>
            <ul className="space-y-0.5 pl-4 list-disc">
              <li>Fleet Manager → Fleet, Maintenance, Settings</li>
              <li>Dispatcher → Dashboard, Trips, Drivers, Fleet</li>
              <li>Safety Officer → Drivers, Compliance</li>
              <li>Financial Analyst → Fuel &amp; Expenses, Analytics</li>
            </ul>
          </div>
        </form>
      </section>
    </div>
  );
}
