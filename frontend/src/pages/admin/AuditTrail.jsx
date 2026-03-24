import { useParams } from "react-router-dom";
import { GitBranch } from "lucide-react";
import { getLatestEventByBinId } from "../../utils/wasteStore";

export default function AuditTrail() {
  const { id } = useParams();
  const event = id ? getLatestEventByBinId(id) : null;
  const events = event?.chain || [];

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">
      <div className="w-full space-y-4">
        <div className="flex items-center gap-2 text-[#1d4ed8]">
          <GitBranch size={18} />
          Tamper-evident audit chain for {id}
        </div>

        <div className="space-y-3">
          {events.length ? (
            events.map((e, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{e.label}</p>
                  <p className="text-xs text-slate-500">
                    Prev hash → {idx === 0 ? "GENESIS" : events[idx - 1].hash}
                  </p>
                </div>

                <div className="text-right text-xs text-orange-700">
                  <p>{e.time}</p>
                  <p>Hash {e.hash}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-sm text-slate-500">
              No audit events found for this bin yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}