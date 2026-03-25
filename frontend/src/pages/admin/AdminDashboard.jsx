import { useMemo, useState } from "react";
import {
  getAllAlerts,
  getAllEvents,
  getAllComplaints,
  resolveComplaint,
  updateTransitSimulation,
  resetDemoData,
} from "../../utils/wasteStore";
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const authorizedRoute = [
  [12.971, 77.620],
  [12.966, 77.615],
  [12.958, 77.610],
  [12.948, 77.606],
  [12.938, 77.603],
  [12.930, 77.600],
];

const deviationRoute = [
  [12.971, 77.620],
  [12.966, 77.615],
  [12.974, 77.632],
  [12.982, 77.645],
];

const redZone = { lat: 12.982, lng: 77.645, radius: 500 };
const plantPoint = [12.930, 77.600];

export default function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedBin, setSelectedBin] = useState("");
  const [truckPosition, setTruckPosition] = useState(authorizedRoute[0]);
  const [currentPath, setCurrentPath] = useState(authorizedRoute);
  const [routeColor, setRouteColor] = useState("green");
  const [statusLabel, setStatusLabel] = useState("On Track");
  const [simulating, setSimulating] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [stopMinutes, setStopMinutes] = useState("12");
  const [locationType, setLocationType] = useState("Unlisted Area");
  const [logicResult, setLogicResult] = useState(null);

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

  const simulateTruckMovement = async (path, isDeviation = false) => {
    if (!selectedBin) {
      setMessage("Select a collected bin first from the Transit section.");
      return;
    }

    setSimulating(true);
    setCurrentPath(path);
    setRouteColor(isDeviation ? "red" : "green");
    setStatusLabel(isDeviation ? "Route Deviation" : "On Track");

    for (let i = 0; i < path.length; i++) {
      setTruckPosition(path[i]);
      await new Promise((resolve) => setTimeout(resolve, 700));
    }

    const last = path[path.length - 1];

    const updated = await updateTransitSimulation(selectedBin, {
      lat: last[0],
      lng: last[1],
      stopMinutes: isDeviation ? 12 : 0,
      locationType: isDeviation ? "Unlisted Area" : "Authorized Route",
      routeDeviation: isDeviation,
    });

    if (isDeviation) {
      setMessage(`Warning: Route Deviation detected for bin ${selectedBin}.`);
    } else {
      setMessage(
        `Transit simulation complete. Truck stayed on route for ${selectedBin}.`
      );
    }

    setLogicResult(updated?.transit || null);
    setRefreshKey((k) => k + 1);
    setSimulating(false);
  };

  const handleUnauthorizedStopDemo = async () => {
    if (!selectedBin) {
      setMessage("Select a collected bin first from the Transit section.");
      return;
    }

    const locationMap = {
      "Authorized Route": authorizedRoute[2],
      "Collection Zone": [12.971, 77.620],
      "Plant Zone": plantPoint,
      "Unlisted Area": [12.985, 77.648],
    };

    const coords = locationMap[locationType] || authorizedRoute[2];

    const updated = await updateTransitSimulation(selectedBin, {
      lat: coords[0],
      lng: coords[1],
      stopMinutes: Number(stopMinutes),
      locationType,
      routeDeviation: false,
    });

    setLogicResult(updated?.transit || null);
    setRefreshKey((k) => k + 1);

    if (updated?.transit?.unauthorizedStop) {
      setMessage(
        `Unauthorized stop detected: ${stopMinutes} minutes in ${locationType}.`
      );
    } else {
      setMessage("Transit stop evaluated. No unauthorized stop triggered.");
    }
  };

  const handleResetDemo = () => {
    resetDemoData();
    setSelectedBin("");
    setTruckPosition(authorizedRoute[0]);
    setCurrentPath(authorizedRoute);
    setRouteColor("green");
    setStatusLabel("On Track");
    setSimulating(false);
    setStopMinutes("12");
    setLocationType("Unlisted Area");
    setLogicResult(null);
    setMessage("Demo data reset successfully.");
    setRefreshKey((k) => k + 1);
    setShowResetModal(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">
      <div className="w-full space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Command Center
              </p>
              <h1 className="mt-2 text-3xl font-bold">Admin Dashboard</h1>
              <p className="mt-2 text-sm text-slate-600">
                Monitor complaint lifecycle, anomaly detection, live transit,
                and whether issues were resolved operationally.
              </p>
            </div>

            <button
              onClick={() => setShowResetModal(true)}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
            >
              Reset Demo Data
            </button>
          </div>
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
            <p className="mt-2 text-3xl font-bold text-orange-600">
              {openComplaints}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Manual resolved</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {manualResolved}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Operationally resolved</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {operationalResolved}
            </p>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold">Transit Monitoring & Live Map</h2>
              <p className="mt-1 text-sm text-slate-600">
                Demonstrate normal flow, route deviation, and unauthorized stop logic.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedBin}
                onChange={(e) => setSelectedBin(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select collected bin</option>
                {events
                  .filter((e) => e.status === "Collected" || e.status === "Processed")
                  .map((e) => (
                    <option key={e.id} value={e.binId}>
                      {e.binId}
                    </option>
                  ))}
              </select>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  statusLabel === "On Track"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                Status: {statusLabel}
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="overflow-hidden rounded-3xl border border-slate-200">
              <MapContainer
                center={[12.958, 77.615]}
                zoom={13}
                style={{ height: "420px", width: "100%" }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline positions={authorizedRoute} pathOptions={{ color: "green", weight: 5 }} />
                <Polyline positions={currentPath} pathOptions={{ color: routeColor, weight: 6 }} />
                <Circle
                  center={[redZone.lat, redZone.lng]}
                  radius={redZone.radius}
                  pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0.18 }}
                />
                <CircleMarker
                  center={truckPosition}
                  radius={10}
                  pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.9 }}
                >
                  <Popup>Truck Simulation</Popup>
                </CircleMarker>
                <CircleMarker
                  center={plantPoint}
                  radius={8}
                  pathOptions={{ color: "green", fillColor: "green", fillOpacity: 0.9 }}
                >
                  <Popup>Processing Plant</Popup>
                </CircleMarker>
              </MapContainer>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Live Route Demo</p>
                <p className="mt-2 text-sm text-slate-600">
                  Green line = authorized route. Red route = deviation toward a flagged zone.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => simulateTruckMovement(authorizedRoute, false)}
                    disabled={simulating}
                    className="rounded-xl bg-[#16a34a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803d] disabled:bg-slate-300"
                  >
                    Simulate On Track
                  </button>

                  <button
                    onClick={() => simulateTruckMovement(deviationRoute, true)}
                    disabled={simulating}
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-slate-300"
                  >
                    Simulate Deviation
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Unauthorized Stop Logic Demo</p>
                <p className="mt-2 text-sm text-slate-600">
                  If stop time is greater than 10 minutes in an unlisted area, the transit stamp is compromised.
                </p>

                <div className="mt-4 grid gap-3">
                  <input
                    type="number"
                    value={stopMinutes}
                    onChange={(e) => setStopMinutes(e.target.value)}
                    placeholder="Current stop time (mins)"
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                  />

                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    <option>Authorized Route</option>
                    <option>Collection Zone</option>
                    <option>Plant Zone</option>
                    <option>Unlisted Area</option>
                  </select>

                  <button
                    onClick={handleUnauthorizedStopDemo}
                    className="rounded-xl bg-[#1d4ed8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e40af]"
                  >
                    Evaluate Stop
                  </button>
                </div>
              </div>

              {logicResult && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Transit Stamp Output</p>
                  <pre className="mt-3 overflow-auto rounded-xl bg-white p-3 text-xs text-slate-700">
{JSON.stringify(logicResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
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
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            c.status === "Resolved - Operational"
                              ? "bg-green-100 text-green-700"
                              : c.status === "Resolved - Manual"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
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

      {showResetModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">Reset Demo Data?</h3>
            <p className="mt-2 text-sm text-slate-600">
              This will clear current demo changes and restore the default sample events,
              alerts, complaints, and transit simulation state.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResetDemo}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}