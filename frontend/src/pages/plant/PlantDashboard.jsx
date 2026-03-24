import { useMemo, useState } from "react";
import { Weight, CheckCircle2, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";
import { getAllEvents, verifyPlantEntry } from "../../utils/wasteStore";

export default function PlantDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedBin, setSelectedBin] = useState("");
  const [plantWeight, setPlantWeight] = useState("");
  const [message, setMessage] = useState("");

  const incoming = useMemo(() => {
    return getAllEvents().filter((e) => e.status === "Collected");
  }, [refreshKey]);

  const processed = useMemo(() => {
    return getAllEvents().filter((e) => e.status === "Processed");
  }, [refreshKey]);

  const handleVerify = () => {
    if (!selectedBin || !plantWeight) {
      setMessage("Please select a bin and enter plant weight.");
      return;
    }

    const updated = verifyPlantEntry(selectedBin, plantWeight);

    if (!updated) {
      setMessage("Could not verify this bin.");
      return;
    }

    if (updated.risk === "High") {
      setMessage(
        `Plant verification saved. High risk alert: pickup ${updated.pickupWeight} kg vs plant ${updated.plantWeight} kg.`
      );
    } else if (updated.risk === "Medium") {
      setMessage(
        `Plant verification saved. Medium variation detected for ${updated.binId}.`
      );
    } else {
      setMessage(`Plant verification saved successfully for ${updated.binId}.`);
    }

    setSelectedBin("");
    setPlantWeight("");
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">
      <div className="w-full space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Plant Operations
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Processing and Verification Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Verify incoming batches, record final weight, and flag possible
            mismatches.
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Incoming Batches Awaiting Verification
          </h2>

          {incoming.length === 0 ? (
            <p className="text-sm text-slate-500">
              No collected batches are waiting for plant verification.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {incoming.map((b) => (
                <motion.div
                  key={b.id}
                  whileHover={{ y: -2 }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-[#1d4ed8]">
                        {b.binId}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Pickup weight:{" "}
                        <span className="font-semibold text-slate-900">
                          {b.pickupWeight} kg
                        </span>
                      </p>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      Truck{" "}
                      <span className="font-semibold text-slate-900">
                        {b.truck}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Weighbridge Verification
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-900">
                <Weight size={18} className="text-[#1d4ed8]" />
                <p className="font-semibold">Select Bin</p>
              </div>
              <select
                value={selectedBin}
                onChange={(e) => setSelectedBin(e.target.value)}
                className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">Choose collected bin</option>
                {incoming.map((item) => (
                  <option key={item.id} value={item.binId}>
                    {item.binId}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-900">
                <ClipboardCheck size={18} className="text-[#1d4ed8]" />
                <p className="font-semibold">Enter Plant Weight</p>
              </div>
              <input
                type="number"
                value={plantWeight}
                onChange={(e) => setPlantWeight(e.target.value)}
                placeholder="e.g. 42"
                className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 size={18} />
                <p className="font-semibold">Close Verification</p>
              </div>
              <button
                onClick={handleVerify}
                className="mt-3 w-full rounded-xl bg-[#16a34a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803d]"
              >
                Verify and Process
              </button>
            </div>
          </div>

          {message && (
            <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-slate-700">
              {message}
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Recently Processed
          </h2>

          {processed.length === 0 ? (
            <p className="text-sm text-slate-500">
              No processed batches yet.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {processed.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="font-semibold text-slate-900">{b.binId}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Pickup: {b.pickupWeight} kg | Plant: {b.plantWeight} kg
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Risk: <span className="font-semibold">{b.risk}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}