export default function Landing() {
  const features = [
    "End-to-end waste traceability",
    "AI-based anomaly detection",
    "Live truck and route monitoring",
    "QR-linked bin verification",
    "Tamper-evident audit trail",
    "Waste Passport for each collection event",
  ];

  const roles = [
    {
      title: "Citizens",
      desc: "Report waste issues, track complaint status, and view pickup transparency.",
    },
    {
      title: "Collectors",
      desc: "Scan bins, capture geo-tagged pickups, upload evidence, and follow assigned routes.",
    },
    {
      title: "Plant Operators",
      desc: "Verify loads, match incoming weight, and confirm final processing records.",
    },
    {
      title: "Authorities",
      desc: "Monitor anomalies, leakage hotspots, contractor performance, and city-wide dashboards.",
    },
  ];

  const stats = [
    { label: "Today tracked", value: "428 t" },
    { label: "Trust index", value: "82/100" },
    { label: "Leakage caught", value: "12 events" },
    { label: "Financial leakage prevented", value: "₹3.8L" },
  ];

  const quickLinks = ["Live Command Center", "Public Transparency", "Collector App", "Waste Passport"];

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="border-b-4 border-orange-500 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-300 bg-white text-xl font-bold text-slate-700">
              भारत
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Government of India</p>
              <h1 className="text-2xl font-bold text-slate-900">TraceBin Smart Waste Accountability Portal</h1>
              <p className="text-sm text-slate-600">Ministry-style city waste monitoring, accountability, and compliance platform</p>
            </div>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#overview" className="text-sm font-medium text-slate-700 hover:text-slate-950">Home</a>
            <a href="#features" className="text-sm font-medium text-slate-700 hover:text-slate-950">Services</a>
            <a href="#roles" className="text-sm font-medium text-slate-700 hover:text-slate-950">Stakeholders</a>
            <a href="#dashboard" className="text-sm font-medium text-slate-700 hover:text-slate-950">Reports</a>
            <button className="rounded-xl border border-slate-300 bg-slate-50 px-5 py-2 font-semibold text-slate-800 shadow-sm hover:bg-slate-100">
              Login
            </button>
          </div>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-green-600 via-white to-orange-500" />
      </div>

      <section id="overview" className="relative overflow-hidden bg-[linear-gradient(180deg,#eef5ff_0%,#f8fbff_100%)]">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-green-100 blur-3xl" />
          <div className="absolute right-10 top-16 h-80 w-80 rounded-full bg-orange-100 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-100 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
          <div>
            <div className="mb-4 inline-flex items-center rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-800">
              National-style Smart City Waste Monitoring Portal
            </div>
            <h2 className="max-w-3xl text-4xl font-extrabold leading-tight text-slate-900 lg:text-5xl">
              From Bin to Processing Plant — End-to-End Waste Traceability for Smart Cities
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
              Track every waste collection event from QR scan at the bin to weighbridge verification at the plant, with anomaly alerts, route intelligence, geo-tagged evidence, and a cryptographic audit trail.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-xl bg-[#1d4ed8] px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-[#1e40af]">
                Live Command Center
              </button>
              <button className="rounded-xl bg-[#16a34a] px-6 py-3 font-semibold text-white shadow-lg shadow-green-200 transition hover:-translate-y-0.5 hover:bg-[#15803d]">
                Public Transparency Portal
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {features.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-green-600" />
                  <p className="text-sm font-medium text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pl-4">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Operational Snapshot</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">Command Status</h3>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Live</span>
              </div>

              <div className="grid gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-[linear-gradient(135deg,#e0f2fe,#f8fafc,#ecfccb)] p-4">
                <p className="text-sm font-semibold text-slate-800">Priority actions</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  <li>• Verify collector route deviation alerts</li>
                  <li>• Review plant-side weight mismatch cases</li>
                  <li>• Confirm AI segregation audit evidence</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Core Services</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">What the portal provides</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {quickLinks.map((link) => (
                <button key={link} className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                  {link}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "QR Bin Verification",
                body: "Each bin is linked to a unique QR identity for authenticated collection and route proof.",
              },
              {
                title: "AI Vision Audit",
                body: "Image-based waste checks flag likely segregation issues, tampering, or suspicious loads.",
              },
              {
                title: "Live Route Monitoring",
                body: "Collector movement, ETA, route deviations, and stoppage alerts are tracked in real time.",
              },
              {
                title: "Waste Passport",
                body: "Every event receives a verifiable chain-of-custody record from source to plant.",
              },
            ].map((card) => (
              <div key={card.title} className="rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-sm">
                <div className="mb-4 h-12 w-12 rounded-2xl bg-slate-900/5" />
                <h4 className="text-lg font-bold text-slate-900">{card.title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="bg-[#f8fafc] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Portal Access</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">Role-based access for all stakeholders</h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {roles.map((role) => (
              <div key={role.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Role</p>
                <h4 className="mt-2 text-xl font-bold text-slate-900">{role.title}</h4>
                <p className="mt-3 text-sm leading-6 text-slate-600">{role.desc}</p>
                <button className="mt-6 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                  Open dashboard
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="dashboard" className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Public Trust Layer</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">Built for transparency and governance</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The platform combines municipal operations, contractor accountability, and citizen-facing transparency in one interface. It is designed to feel official, reliable, and easy to use for both field staff and decision-makers.
            </p>
            <div className="mt-6 space-y-3">
              {[
                "Plant verification against collected weight",
                "Anomaly detection for ghost pickups and route leaks",
                "Audit-friendly records with event-level history",
                "Clean role-wise navigation for city operations",
              ].map((line) => (
                <div key={line} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  <p className="text-sm font-medium text-slate-700">{line}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#0f172a,#1e3a8a)] p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">Live Monitoring</p>
                <h3 className="mt-2 text-3xl font-bold">Command Center Preview</h3>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">Active</span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-blue-100">Tracked trucks</p>
                <p className="mt-2 text-3xl font-bold">18</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-blue-100">Open anomalies</p>
                <p className="mt-2 text-3xl font-bold">04</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-blue-100">Verified pickups</p>
                <p className="mt-2 text-3xl font-bold">267</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-blue-100">Plant confirmations</p>
                <p className="mt-2 text-3xl font-bold">251</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-blue-100">
              Ideal next step: wire this landing page to your existing sidebar dashboards so the portal feels like a public-facing homepage leading into Citizen, Collector, Plant, and Command modules.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
