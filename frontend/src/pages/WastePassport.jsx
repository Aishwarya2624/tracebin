import { useParams } from "react-router-dom";
import { passport } from "../data/mock.js";
import { Lock } from "lucide-react";

export default function WastePassport() {
  const { id } = useParams();
  const p = passport;

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Waste Passport
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                {p.id}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Status: <span className="font-semibold text-slate-900">{p.status}</span>{" "}
                • Risk: <span className="font-semibold text-slate-900">{p.risk}</span>
              </p>
              {id && (
                <p className="mt-1 text-xs text-slate-500">
                  Route parameter received: {id}
                </p>
              )}
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
              <Lock size={16} />
              Signed hashes at every step
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              Chain of Custody
            </h2>

            <div className="space-y-4">
              {p.chain.map((c, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#1d4ed8]">
                        {c.label}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Actor: {c.actor}
                      </p>
                    </div>

                    <div className="text-sm text-slate-600 md:text-right">
                      <p>{c.time}</p>
                      <p className="mt-1 font-medium text-orange-700">
                        Hash {c.hash}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Details</h2>

            <div className="space-y-3 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">Source:</span>{" "}
                {p.source}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Collector:</span>{" "}
                {p.collector}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Truck:</span>{" "}
                {p.truck}
              </p>
              <p>
                <span className="font-semibold text-slate-900">
                  Pickup weight:
                </span>{" "}
                {p.pickupWeight} kg
              </p>
              <p>
                <span className="font-semibold text-slate-900">Plant weight:</span>{" "}
                {p.plantWeight} kg
              </p>
              <p>
                <span className="font-semibold text-slate-900">AI category:</span>{" "}
                {p.ai.category}
              </p>
              <p>
                <span className="font-semibold text-slate-900">
                  Recommendation:
                </span>{" "}
                {p.ai.recommendation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}