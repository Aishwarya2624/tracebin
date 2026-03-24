import { useParams } from "react-router-dom";
import { GitBranch } from "lucide-react";
import { passport } from "../../data/mock.js";

export default function AuditTrail() {
  const { id } = useParams();
  const events = passport.chain;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-cyan">
        <GitBranch size={18} />
        Tamper-evident audit chain for {id}
      </div>

      <div className="space-y-3">
        {events.map((e, idx) => (
          <div
            key={idx}
            className="glass p-3 rounded-lg border border-white/5 flex justify-between items-center"
          >
            <div>
              <p className="text-sm text-neon">{e.label}</p>
              <p className="text-xs text-white/60">
                Prev hash → {idx === 0 ? "GENESIS" : events[idx - 1].hash}
              </p>
            </div>

            <div className="text-right text-xs text-amber">
              Hash {e.hash}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}