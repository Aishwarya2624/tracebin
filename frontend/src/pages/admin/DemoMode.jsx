import { useState } from "react";
import { Link } from "react-router-dom";
import {
  saveComplaint,
  savePickupEvent,
  updateCitizenConfirmation,
  updateTransitSimulation,
  verifyPlantEntry,
} from "../../utils/wasteStore";
import { bins } from "../../data/mock";

export default function DemoMode() {
  const [message, setMessage] = useState("");
  const [running, setRunning] = useState(false);
  const [selectedBinId, setSelectedBinId] = useState("BIN-1001");

  const clearDemoData = () => {
    localStorage.removeItem("tracebin_events");
    localStorage.removeItem("tracebin_complaints");
  };

  const getSelectedBin = () =>
    bins.find((b) => b.id === selectedBinId);

  const runNormalFlow = async () => {
    setRunning(true);
    clearDemoData();

    const bin = getSelectedBin();

    await saveComplaint({
      bin,
      complaintText: "Pickup completed successfully",
    });

    await savePickupEvent({
      bin,
      truck: bin.assignedTruck,
      collector: "Ravi Kumar",
      estimatedWeight: 50,
    });

    await updateCitizenConfirmation(bin.id, "confirmed");

    await updateTransitSimulation(bin.id, {
      lat: 12.948,
      lng: 77.606,
      stopMinutes: 0,
      locationType: "Authorized Route",
      routeDeviation: false,
    });

    await verifyPlantEntry(bin.id, 48, "Mixed Sorting");

    setMessage(`${bin.id} completed NORMAL flow successfully`);
    setRunning(false);
  };

  const runAnomalyFlow = async () => {
    setRunning(true);
    clearDemoData();

    const bin = getSelectedBin();

    await saveComplaint({
      bin,
      complaintText: "Suspicious waste handling detected",
    });

    await savePickupEvent({
      bin,
      truck: bin.assignedTruck,
      collector: "Ravi Kumar",
      estimatedWeight: 50,
    });

    await updateCitizenConfirmation(bin.id, "reported-anomaly");

    await updateTransitSimulation(bin.id, {
      lat: 12.985,
      lng: 77.648,
      stopMinutes: 12,
      locationType: "Unlisted Area",
      routeDeviation: true,
    });

    await verifyPlantEntry(bin.id, 20, "Landfill Transfer");

    setMessage(`${bin.id} flagged with anomalies 🚨`);
    setRunning(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">
      <div className="space-y-6">

        <div className="rounded-3xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold">TraceBin Demo Mode</h1>

          {/* 🔥 BIN SELECT DROPDOWN */}
          <div className="mt-4">
            <label className="text-sm font-semibold">Select Bin</label>
            <select
              value={selectedBinId}
              onChange={(e) => setSelectedBinId(e.target.value)}
              className="mt-2 w-full rounded-xl border px-4 py-3"
            >
              {bins.map((bin) => (
                <option key={bin.id} value={bin.id}>
                  {bin.id} ({bin.area})
                </option>
              ))}
            </select>
          </div>
        </div>

        {message && (
          <div className="rounded-xl bg-green-100 p-3 text-green-700">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* NORMAL FLOW */}
          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold text-green-700">Normal Flow</h2>

            <button
              onClick={runNormalFlow}
              disabled={running}
              className="mt-4 w-full rounded-xl bg-green-600 py-3 text-white"
            >
              Run Normal Flow
            </button>
          </div>

          {/* ANOMALY FLOW */}
          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold text-red-600">Anomaly Flow</h2>

            <button
              onClick={runAnomalyFlow}
              disabled={running}
              className="mt-4 w-full rounded-xl bg-red-600 py-3 text-white"
            >
              Run Anomaly Flow
            </button>
          </div>

        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold">Quick Navigation</h2>

          <div className="mt-4 flex gap-3 flex-wrap">
            <Link to="/admin" className="btn">Admin Dashboard</Link>
            <Link to={`/passport/${selectedBinId}`} className="btn">
              Open Selected Passport
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}