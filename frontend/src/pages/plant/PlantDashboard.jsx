import { Weight, CheckCircle2, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function PlantDashboard() {
  const incoming = [
    { id: "WB-AX93PZ", eta: "12 min", predicted: 52 },
    { id: "WB-BB129Q", eta: "24 min", predicted: 46 },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Plant Operations
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Processing and Verification Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Verify incoming waste loads, confirm weighbridge records, upload
            evidence, and close processing outcomes.
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Incoming Batches
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {incoming.map((b) => (
              <motion.div
                key={b.id}
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-[#1d4ed8]">{b.id}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Predicted weight:{" "}
                      <span className="font-semibold text-slate-900">
                        {b.predicted} kg
                      </span>
                    </p>
                  </div>
                  <div className="text-right text-sm text-slate-600">
                    ETA <span className="font-semibold text-slate-900">{b.eta}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Weighbridge Entry
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-900">
                <Weight size={18} className="text-[#1d4ed8]" />
                <p className="font-semibold">Record Verified Weight</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Capture final incoming weight from the weighbridge system.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-900">
                <ClipboardCheck size={18} className="text-[#1d4ed8]" />
                <p className="font-semibold">Upload Proof Image</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Upload visual evidence for audit, inspection, and verification.
              </p>
            </div>

            <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 size={18} />
                <p className="font-semibold">Close Processing Outcome</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Finalize processing status and confirm completion of the batch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}