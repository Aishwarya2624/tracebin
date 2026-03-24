import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, MapPinned, Activity, Radar, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Landing" },
  { to: "/citizen", label: "Citizen" },
  { to: "/collector", label: "Collector" },
  { to: "/plant", label: "Plant" },
  { to: "/admin", label: "Command" },
];

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#f5f7fb] text-slate-900">
      <div className="border-b border-slate-200 bg-white shadow-sm">
        <div className="flex w-full items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm sm:hidden"
              onClick={() => setOpen((s) => !s)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-[10px] font-bold text-slate-700">
                भारत
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Government Style Portal
                </p>
                <h1 className="text-base font-bold text-slate-900 sm:text-lg">
                  TraceBin Smart Waste Accountability Portal
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block">
                  From bin to processing plant — transparent, trackable, auditable
                </p>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="rounded-full bg-green-50 p-2 text-green-700">
              <Activity size={16} />
            </div>
            <div className="rounded-full bg-blue-50 p-2 text-blue-700">
              <MapPinned size={16} />
            </div>
            <div className="rounded-full bg-orange-50 p-2 text-orange-700">
              <Radar size={16} />
            </div>
          </div>
        </div>

        <div className="h-1 w-full bg-gradient-to-r from-green-600 via-white to-orange-500" />
      </div>

      <div className="flex w-full">
        {open && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/30 sm:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <motion.aside
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`fixed left-0 top-0 z-40 h-screen w-72 border-r border-slate-200 bg-white shadow-xl transition-transform sm:sticky sm:top-0 sm:z-10 sm:h-[calc(100vh-0px)] sm:w-72 sm:translate-x-0 sm:shadow-none ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-200 px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#1d4ed8]/10 p-2 text-[#1d4ed8]">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">TraceBin</p>
                  <p className="text-xs text-slate-500">Portal Navigation</p>
                </div>
              </div>
            </div>

            <div className="px-4 py-4">
              <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Modules
              </p>

              <nav className="space-y-2">
                {links.map((link) => {
                  const active = pathname === link.to;

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        active
                          ? "border border-blue-200 bg-blue-50 text-blue-800"
                          : "border border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto p-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Portal Note
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Unified access for citizen reporting, collector operations, plant verification,
                  and command monitoring.
                </p>
              </div>
            </div>
          </div>
        </motion.aside>

        <main className="min-w-0 flex-1">
          <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Waste Accountability
              </p>
              <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    From Bin to Processing Plant — Total Traceability
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Monitor collection, transport, verification, and audit trails through a
                    consistent government-style portal.
                  </p>
                </div>

                <div className="inline-flex items-center rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                  System Active
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}