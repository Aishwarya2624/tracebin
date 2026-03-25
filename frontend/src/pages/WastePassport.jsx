import { useParams, Link } from "react-router-dom";
import {
  Lock,
  ShieldAlert,
  ShieldCheck,
  Truck,
  MapPin,
  Weight,
  FileCheck,
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  UserCheck,
} from "lucide-react";
import { passport as defaultPassport } from "../data/mock.js";
import { getLatestEventByBinId } from "../utils/wasteStore";

function StatBadge({ label, value, tone = "default" }) {
  const toneClasses = {
    default: "bg-slate-100 text-slate-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
  };

  return (
    <div className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}>
      {label}: {value}
    </div>
  );
}

function SectionCard({ title, subtitle, icon, children }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">{icon}</div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900 break-words">
        {value ?? "-"}
      </p>
    </div>
  );
}

export default function WastePassport() {
  const { id } = useParams();
  const storedEvent = id ? getLatestEventByBinId(id) : null;

  const p = storedEvent
    ? {
        id: storedEvent.binId,
        status: storedEvent.status,
        risk: storedEvent.risk,
        source: storedEvent.source,
        collector: storedEvent.collector,
        truck: storedEvent.truck,
        pickupWeight: storedEvent.pickupWeight,
        plantWeight: storedEvent.plantWeight,
        ai: storedEvent.ai,
        chain: storedEvent.chain || [],
        sourceStamp: storedEvent.sourceStamp || null,
        transit: storedEvent.transit || null,
        destinationStamp: storedEvent.destinationStamp || null,
        anomalyIssues: storedEvent.anomalyIssues || [],
        citizenConfirmation: storedEvent.citizenConfirmation || null,
      }
    : {
        ...defaultPassport,
        sourceStamp: null,
        transit: null,
        destinationStamp: null,
        anomalyIssues: [],
        citizenConfirmation: null,
      };

  const riskTone =
    p.risk === "High" ? "red" : p.risk === "Medium" ? "orange" : "green";

  const isCompromised = p.anomalyIssues?.some((issue) => issue.severity === "high");

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Waste Passport
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">{p.id}</h1>
              <p className="mt-2 text-sm text-slate-600">
                End-to-end accountability record from source to plant verification.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <StatBadge label="Status" value={p.status || "Pending"} tone="blue" />
              <StatBadge label="Risk" value={p.risk || "Low"} tone={riskTone} />
              <StatBadge
                label="Integrity"
                value={isCompromised ? "Flagged" : "Valid"}
                tone={isCompromised ? "red" : "green"}
              />
              <Link
                to={`/audit/${p.id}`}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Open Audit Trail
              </Link>
            </div>
          </div>
        </div>

        {/* Top Overview */}
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <SectionCard
            title="Three-Way Handshake"
            subtitle="Source, transit, and destination must align for a clean accountability trail."
            icon={<Lock size={20} />}
          >
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Source */}
              <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-blue-700" />
                  <p className="font-semibold text-blue-900">1. Source Stamp</p>
                </div>
                <div className="space-y-3">
                  <InfoTile label="Bin ID" value={p.sourceStamp?.binId || p.id} />
                  <InfoTile
                    label="Timestamp"
                    value={p.sourceStamp?.timestamp
                      ? new Date(p.sourceStamp.timestamp).toLocaleString()
                      : "-"}
                  />
                  <InfoTile
                    label="Estimated Weight"
                    value={
                      p.sourceStamp?.estimatedWeight != null
                        ? `${p.sourceStamp.estimatedWeight} kg`
                        : p.pickupWeight != null
                        ? `${p.pickupWeight} kg`
                        : "-"
                    }
                  />
                  <InfoTile
                    label="GPS Source"
                    value={
                      p.sourceStamp?.gpsSource
                        ? `${p.sourceStamp.gpsSource.lat}, ${p.sourceStamp.gpsSource.lng}`
                        : "-"
                    }
                  />
                </div>
              </div>

              {/* Transit */}
              <div className="rounded-3xl border border-orange-200 bg-orange-50 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Truck size={18} className="text-orange-700" />
                  <p className="font-semibold text-orange-900">2. Transit Stamp</p>
                </div>
                <div className="space-y-3">
                  <InfoTile label="Truck ID" value={p.truck} />
                  <InfoTile label="Route ID" value={p.transit?.routeId || "-"} />
                  <InfoTile
                    label="Live GPS"
                    value={
                      p.transit?.liveGps
                        ? `${p.transit.liveGps.lat}, ${p.transit.liveGps.lng}`
                        : "-"
                    }
                  />
                  <InfoTile
                    label="Stop Duration"
                    value={
                      p.transit?.lastStopMinutes != null
                        ? `${p.transit.lastStopMinutes} min`
                        : "-"
                    }
                  />
                  <InfoTile
                    label="Unauthorized Stop"
                    value={p.transit?.unauthorizedStop ? "Yes" : "No"}
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="rounded-3xl border border-green-200 bg-green-50 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <FileCheck size={18} className="text-green-700" />
                  <p className="font-semibold text-green-900">3. Destination Stamp</p>
                </div>
                <div className="space-y-3">
                  <InfoTile
                    label="Final Weight"
                    value={
                      p.destinationStamp?.finalWeight != null
                        ? `${p.destinationStamp.finalWeight} kg`
                        : p.plantWeight != null
                        ? `${p.plantWeight} kg`
                        : "-"
                    }
                  />
                  <InfoTile
                    label="Verification ID"
                    value={p.destinationStamp?.verificationId || "-"}
                  />
                  <InfoTile
                    label="Processing Type"
                    value={p.destinationStamp?.processingType || "-"}
                  />
                  <InfoTile label="Collector" value={p.collector || "-"} />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Validation Summary"
            subtitle="Anomaly engine output and operational trust indicators."
            icon={
              isCompromised ? (
                <ShieldAlert size={20} />
              ) : (
                <ShieldCheck size={20} />
              )
            }
          >
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoTile
                  label="Pickup Weight"
                  value={p.pickupWeight != null ? `${p.pickupWeight} kg` : "-"}
                />
                <InfoTile
                  label="Plant Weight"
                  value={p.plantWeight != null ? `${p.plantWeight} kg` : "-"}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoTile label="Current Status" value={p.status || "-"} />
                <InfoTile label="Risk Level" value={p.risk || "-"} />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <UserCheck size={16} className="text-[#1d4ed8]" />
                  <p className="font-semibold text-slate-900">Citizen Confirmation</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {p.citizenConfirmation?.status === "confirmed" &&
                    "Citizen confirmed collection."}
                  {p.citizenConfirmation?.status === "reported-anomaly" &&
                    "Citizen reported an anomaly after pickup."}
                  {p.citizenConfirmation?.status === "pending" &&
                    "Citizen confirmation still pending."}
                  {!p.citizenConfirmation?.status && "No citizen confirmation recorded."}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <Clock3 size={16} className="text-[#1d4ed8]" />
                  <p className="font-semibold text-slate-900">Decision</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {isCompromised
                    ? "Waste Passport flagged as compromised due to one or more high-severity anomalies."
                    : "Waste Passport remains valid. No high-severity anomaly has compromised the chain."}
                </p>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Anomaly Engine */}
        <SectionCard
          title="Anomaly Engine Output"
          subtitle="System checks for weight variance, unauthorized stops, and citizen-reported issues."
          icon={<AlertTriangle size={20} />}
        >
          {p.anomalyIssues?.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {p.anomalyIssues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border p-4 ${
                    issue.severity === "high"
                      ? "border-red-200 bg-red-50"
                      : issue.severity === "medium"
                      ? "border-orange-200 bg-orange-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{issue.type}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        issue.severity === "high"
                          ? "bg-red-100 text-red-700"
                          : issue.severity === "medium"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {issue.severity}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{issue.note}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 size={18} />
                <p className="font-semibold">No anomaly triggered</p>
              </div>
              <p className="mt-2 text-sm text-slate-700">
                The validation engine did not detect significant inconsistencies in the current record.
              </p>
            </div>
          )}
        </SectionCard>

        {/* Immutable Chain + Details */}
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <SectionCard
            title="Immutable Chain"
            subtitle="Each step includes the previous hash, creating a tamper-evident digital audit trail."
            icon={<GitBranch size={20} />}
          >
            {p.chain?.length ? (
              <div className="space-y-4">
                {p.chain.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#1d4ed8]">
                          {c.label}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Actor: {c.actor}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Previous Hash:{" "}
                          <span className="font-medium">
                            {i === 0 ? "GENESIS" : p.chain[i - 1].hash}
                          </span>
                        </p>
                      </div>

                      <div className="lg:text-right">
                        <p className="text-sm text-slate-600">{c.time}</p>
                        <p className="mt-1 text-sm font-medium text-orange-700">
                          Hash: {c.hash}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No chain records available yet.</p>
            )}
          </SectionCard>

          <SectionCard
            title="Passport Details"
            subtitle="Operational metadata and accountability fields."
            icon={<Weight size={20} />}
          >
            <div className="grid gap-3">
              <InfoTile label="Source Area" value={p.source} />
              <InfoTile label="Collector" value={p.collector} />
              <InfoTile label="Truck" value={p.truck} />
              <InfoTile label="Pickup Weight" value={p.pickupWeight != null ? `${p.pickupWeight} kg` : "-"} />
              <InfoTile label="Plant Weight" value={p.plantWeight != null ? `${p.plantWeight} kg` : "-"} />
              <InfoTile label="AI Category" value={p.ai?.category || "-"} />
              <InfoTile label="Recommendation" value={p.ai?.recommendation || "-"} />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}