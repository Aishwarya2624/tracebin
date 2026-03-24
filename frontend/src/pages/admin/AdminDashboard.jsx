import { useMemo, useState } from "react";
import {
  getAllAlerts,
  getAllEvents,
  getAllComplaints,
  resolveComplaint,
} from "../../utils/wasteStore";

export default function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [message, setMessage] = useState("");

  const events = useMemo(() => getAllEvents(), [refreshKey]);
  const alerts = useMemo(() => getAllAlerts(), [refreshKey]);
  const complaints = useMemo(() => getAllComplaints(), [refreshKey]);

  const highRisk = events.filter((e) => e.risk === "High").length;
  const processed = events.filter((e) => e.status === "Processed").length;
  const openComplaints = complaints.filter((c) => c.status === "Open").length;
  const manualResolved = complaints.filter(
    (c) => c.status === "Resolved - Manual"
  ).length;
  const operationalResolved = complaints.filter(
    (c) => c.status === "Resolved - Operational"
  ).length;

  const handleResolveComplaint = (complaintId) => {
    const updated = resolveComplaint(complaintId, "Admin Officer");
    if (!updated) return;

    setMessage(`Complaint ${updated.id} marked as manually resolved.`);
    setRefreshKey((k) => k + 1);
  };

  const getStatusBadge = (status) => {
    if (status === "Resolved - Operational") return "bg-green-100 text-green-700";
    if (status === "Resolved - Manual") return "bg-blue-100 text-blue-700";
    return "bg-orange-100 text-orange-700";
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">
      <div className="w-full space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Command Center
          </p>
          <h1 className="mt-2 text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Monitor complaint lifecycle, anomaly detection, and whether issues were operationally resolved.
          </p>
        </div>

        {message && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-7">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Pickup events</p>
            <p className="mt-2 text-3xl font-bold">{events.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Processed batches</p>
            <p className="mt-2 text-3xl font-bold">{processed}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">High-risk cases</p>
            <p className="mt-2 text-3xl font-bold text-red-600">{highRisk}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total complaints</p>
            <p className="mt-2 text-3xl font-bold">{complaints.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Open</p>
            <p className="mt-2 text-3xl font-bold text-orange-600">{openComplaints}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Manual resolved</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">{manualResolved}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Operationally resolved</p>
            <p className="mt-2 text-3xl font-bold text-green-600">{operationalResolved}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Recent Alerts</h2>
            <div className="mt-4 space-y-3">
              {alerts.length ? (
                alerts.map((a) => (
                  <div key={a.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{a.type}</p>
                    <p className="mt-1 text-sm text-slate-600">{a.message}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Severity: {a.severity} • {a.time}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No alerts yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Citizen Complaints</h2>
            <div className="mt-4 space-y-3">
              {complaints.length ? (
                complaints.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">
                          {c.binId} • {c.area}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">{c.complaintText}</p>
                        <p className="mt-2 text-xs text-slate-500">
                          Created: {c.createdLabel}
                        </p>

                        {c.linkedEventType && (
                          <p className="mt-1 text-xs text-slate-700">
                            Linked operational event: <b>{c.linkedEventType}</b>
                          </p>
                        )}

                        {c.status === "Resolved - Manual" && (
                          <p className="mt-1 text-xs text-blue-700">
                            Manually resolved by {c.resolvedBy} • {c.resolvedLabel}
                          </p>
                        )}

                        {c.status === "Resolved - Operational" && (
                          <p className="mt-1 text-xs text-green-700">
                            Operationally resolved by {c.resolvedBy} • {c.resolvedLabel}
                          </p>
                        )}

                        {c.operationalUpdates?.length > 0 && (
                          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Operational Timeline
                            </p>
                            <div className="mt-2 space-y-2">
                              {c.operationalUpdates.map((u, idx) => (
                                <div key={idx} className="text-xs text-slate-600">
                                  <p>
                                    <b>{u.type}</b> • {u.time}
                                  </p>
                                  <p>{u.note}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-start gap-2 md:items-end">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(c.status)}`}
                        >
                          {c.status}
                        </span>

                        {c.status === "Open" && (
                          <button
                            onClick={() => handleResolveComplaint(c.id)}
                            className="rounded-xl bg-[#16a34a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803d]"
                          >
                            Mark Manual Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No complaints submitted yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}