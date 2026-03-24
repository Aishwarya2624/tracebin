import { getAllAlerts, getAllEvents } from "../../utils/wasteStore";

export default function AdminDashboard() {
  const alerts = getAllAlerts();
  const events = getAllEvents();

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">
      <div className="w-full space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Command Center
          </p>
          <h1 className="mt-2 text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Monitor collection events, alerts, and accountability records.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total pickup events</p>
            <p className="mt-2 text-3xl font-bold">{events.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Generated alerts</p>
            <p className="mt-2 text-3xl font-bold">{alerts.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">System status</p>
            <p className="mt-2 text-3xl font-bold text-green-700">Active</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Recent Alerts</h2>

          <div className="mt-4 space-y-3">
            {alerts.length ? (
              alerts.map((a) => (
                <div
                  key={a.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="font-semibold text-slate-900">{a.type}</p>
                  <p className="mt-1 text-sm text-slate-600">{a.message}</p>
                  <p className="mt-1 text-xs text-slate-500">{a.time}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No alerts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}