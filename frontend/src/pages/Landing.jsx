import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  Factory,
  Users,
  ScanLine,
  MapPinned,
  AlertTriangle,
  FileCheck2,
  ArrowRight,
} from "lucide-react";

export default function Landing() {
  const stats = [
    { label: "Tracked Pickups", value: "428+" },
    { label: "Verified Routes", value: "96%" },
    { label: "Anomalies Flagged", value: "12" },
    { label: "Audit Visibility", value: "24/7" },
  ];

  const features = [
    {
      icon: <ScanLine size={24} />,
      title: "QR Bin Verification",
      desc: "Every collection begins with a unique bin identity for traceable pickup proof.",
    },
    {
      icon: <MapPinned size={24} />,
      title: "Live Route Monitoring",
      desc: "Track truck movement, route deviations, and suspicious stoppages in real time.",
    },
    {
      icon: <AlertTriangle size={24} />,
      title: "Anomaly Detection",
      desc: "Flag weight mismatch, ghost pickups, route leakage, and operational irregularities.",
    },
    {
      icon: <FileCheck2 size={24} />,
      title: "Waste Passport",
      desc: "Generate a tamper-evident event trail from source scan to plant verification.",
    },
  ];

  const roles = [
    {
      icon: <Users size={22} />,
      title: "Citizen",
      desc: "Report waste issues, track complaints, and verify pickup status transparently.",
      to: "/citizen",
      button: "Open Citizen Portal",
    },
    {
      icon: <Truck size={22} />,
      title: "Collector",
      desc: "Scan bins, upload proof, follow routes, and update transport events live.",
      to: "/collector",
      button: "Open Collector Portal",
    },
    {
      icon: <Factory size={22} />,
      title: "Plant",
      desc: "Validate incoming loads, check weight consistency, and confirm processing.",
      to: "/plant",
      button: "Open Plant Portal",
    },
    {
      icon: <ShieldCheck size={22} />,
      title: "Command",
      desc: "Monitor complaints, anomalies, route deviations, and city-wide accountability.",
      to: "/admin",
      button: "Open Command Center",
    },
  ];

  return (
    <div className="w-full space-y-8">
      {/* HERO */}
      <section className="rounded-[32px] border border-slate-200 bg-white px-8 py-10 shadow-sm lg:px-12 lg:py-14">
        <div className="max-w-4xl">
          <div className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
            Smart Waste Accountability Platform
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-900 lg:text-6xl">
            From Bin to Processing Plant — Complete Waste Traceability
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600 lg:text-xl">
            TraceBin helps city authorities monitor collection, transport, verification,
            and complaint resolution through one connected platform built for transparency,
            accountability, and operational trust.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-[#239008] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#1e40af]"
            >
              Open Command Center
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/demo"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Run Demo Mode
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="rounded-[32px] border border-slate-200 bg-white px-8 py-8 shadow-sm lg:px-10">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Operational Snapshot
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Live Overview</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-6"
            >
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-3 text-4xl font-bold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="rounded-[32px] border border-slate-200 bg-white px-8 py-8 shadow-sm lg:px-10 lg:py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Core Features
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Built for visibility and control
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#1d4ed8]">
                {item.icon}
              </div>
              <h3 className="mt-5 text-2xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-base leading-8 text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MODULES */}
      <section className="rounded-[32px] border border-slate-200 bg-white px-8 py-8 shadow-sm lg:px-10 lg:py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Role Access
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            One portal, four working modules
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {roles.map((role) => (
            <div
              key={role.title}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-7"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
                {role.icon}
              </div>

              <h3 className="mt-5 text-2xl font-bold text-slate-900">{role.title}</h3>
              <p className="mt-3 text-base leading-8 text-slate-600">{role.desc}</p>

              <Link
                to={role.to}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {role.button}
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}