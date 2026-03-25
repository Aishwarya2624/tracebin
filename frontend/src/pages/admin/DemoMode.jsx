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

  const clearDemoData = () => {
    localStorage.removeItem("tracebin_events");
    localStorage.removeItem("tracebin_complaints");
  };

  const runNormalFlow = async () => {
    setRunning(true);
    clearDemoData();

    const bin = bins.find((b) => b.id === "BIN-1001");

    await saveComplaint({
      bin,
      complaintText: "Pickup delayed in my area",
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

    setMessage(
      "Normal flow completed. BIN-1001 is now operationally resolved with low risk."
    );
    setRunning(false);
  };

  const runAnomalyFlow = async () => {
    setRunning(true);
    clearDemoData();

    const bin = bins.find((b) => b.id === "BIN-1002");

    await saveComplaint({
      bin,
      complaintText: "Waste not picked up and transport looks suspicious",
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

    setMessage(
      "Anomaly flow completed. BIN-1002 is flagged with route deviation, unauthorized stop, citizen anomaly, and weight mismatch."
    );
    setRunning(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">
      <div className="w-full space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Demo Control
          </p>
          <h1 className="mt-2 text-3xl font-bold">TraceBin Demo Mode</h1>
          <p className="mt-2 text-sm text-slate-600">
            Run pre-configured scenarios to demonstrate normal operations and anomaly detection.
          </p>
        </div>

        {message && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-green-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Normal Flow</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Simulates a clean collection lifecycle:
              citizen complaint → pickup → citizen confirmation → safe transit →
              plant verification.
            </p>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p><b>Bin:</b> BIN-1001</p>
              <p><b>Pickup Weight:</b> 50 kg</p>
              <p><b>Plant Weight:</b> 48 kg</p>
              <p><b>Transit:</b> Authorized route</p>
              <p><b>Expected Result:</b> Low risk, operational resolution</p>
            </div>

            <button
              onClick={runNormalFlow}
              disabled={running}
              className="mt-5 rounded-xl bg-[#16a34a] px-5 py-3 font-semibold text-white hover:bg-[#15803d] disabled:bg-slate-300"
            >
              Run Normal Flow
            </button>
          </div>

          <div className="rounded-[28px] border border-red-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Anomaly Flow</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Simulates a compromised lifecycle:
              citizen complaint → pickup → citizen anomaly → route deviation →
              unauthorized stop → plant mismatch.
            </p>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p><b>Bin:</b> BIN-1002</p>
              <p><b>Pickup Weight:</b> 50 kg</p>
              <p><b>Plant Weight:</b> 20 kg</p>
              <p><b>Transit:</b> Route deviation + unlisted stop</p>
              <p><b>Expected Result:</b> High risk, flagged passport</p>
            </div>

            <button
              onClick={runAnomalyFlow}
              disabled={running}
              className="mt-5 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:bg-slate-300"
            >
              Run Anomaly Flow
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Quick Navigation</h2>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/admin"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Open Admin Dashboard
            </Link>

            <Link
              to="/passport/BIN-1001"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Open Normal Passport
            </Link>

            <Link
              to="/passport/BIN-1002"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Open Anomaly Passport
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}