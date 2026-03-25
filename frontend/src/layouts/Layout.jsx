import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, MapPinned, Radar, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/tracebin-logo.png";

const links = [
  { to: "/", label: "Landing" },
  { to: "/citizen", label: "Citizen" },
  { to: "/collector", label: "Collector" },
  { to: "/plant", label: "Plant" },
  { to: "/admin", label: "Command" },
  { to: "/demo", label: "Demo Mode" },
];

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.10),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(132,204,22,0.10),_transparent_30%),linear-gradient(to_bottom,_#f8fbff,_#eef4f8)] text-slate-900">
      {/* Top Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0a4b78] via-[#20b7e5] to-[#7cc51c]" />

      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-white/40 bg-white/65 backdrop-blur-xl">
        <div className="flex items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              className="inline-flex items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 p-3 text-slate-700 shadow-sm sm:hidden"
              onClick={() => setOpen((s) => !s)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/30 via-sky-400/25 to-lime-400/30 blur-xl" />
                <div className="relative rounded-2xl border border-white/50 bg-white/80 p-2 shadow-lg shadow-cyan-100/50 backdrop-blur-md">
                  <img
                    src={logo}
                    alt="TraceBin Logo"
                    className="h-12 w-12 object-contain"
                  />
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                  TraceBin
                </h1>
                <p className="text-sm text-slate-500 sm:text-base">
                  Portal Navigation
                </p>
              </div>
            </motion.div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="rounded-full border border-white/60 bg-white/70 p-3 shadow-sm backdrop-blur-md">
              <Activity size={18} className="text-emerald-600" />
            </div>
            <div className="rounded-full border border-white/60 bg-white/70 p-3 shadow-sm backdrop-blur-md">
              <MapPinned size={18} className="text-sky-600" />
            </div>
            <div className="rounded-full border border-white/60 bg-white/70 p-3 shadow-sm backdrop-blur-md">
              <Radar size={18} className="text-cyan-600" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Overlay */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="fixed inset-0 z-30 bg-slate-950/25 sm:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />
              <motion.aside
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -280, opacity: 0 }}
                transition={{ duration: 0.28 }}
                className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-white/40 bg-white/78 shadow-2xl backdrop-blur-2xl sm:hidden"
              >
                <Sidebar pathname={pathname} setOpen={setOpen} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside className="hidden w-[290px] border-r border-white/40 bg-white/55 backdrop-blur-2xl sm:block">
          <Sidebar pathname={pathname} setOpen={setOpen} />
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 px-5 py-6 lg:px-10 lg:py-8">
          {/* Premium Brand Hero */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative mb-8 overflow-hidden rounded-[34px] border border-white/50 bg-white/55 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl"
          >
            {/* background glow */}
            <div className="pointer-events-none absolute -left-20 top-0 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="pointer-events-none absolute right-0 top-0 h-52 w-52 rounded-full bg-lime-300/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-sky-200/20 blur-3xl" />

            {/* inner border glow */}
            <div className="absolute inset-0 rounded-[34px] bg-gradient-to-r from-sky-400/20 via-transparent to-lime-400/20 p-[1px]">
              <div className="h-full w-full rounded-[34px] bg-transparent" />
            </div>

            <div className="relative flex flex-col gap-6 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-10">
              <div className="flex items-center gap-5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-cyan-400/35 via-sky-400/25 to-lime-400/35 blur-2xl" />
                  <div className="relative rounded-[28px] border border-white/60 bg-white/80 p-3 shadow-[0_16px_40px_rgba(6,182,212,0.16)] backdrop-blur-xl">
                    <img
                      src={logo}
                      alt="TraceBin Logo"
                      className="h-20 w-20 object-contain sm:h-24 sm:w-24"
                    />
                  </div>
                </motion.div>

                <div>
                  <motion.h2
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.45 }}
                    className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
                  >
                    TraceBin
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.45 }}
                    className="mt-3 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl"
                  >
                    Smart waste traceability for transparent cities.
                  </motion.p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28, duration: 0.45 }}
                className="self-start lg:self-center"
              >
                <div className="rounded-full border border-emerald-100 bg-emerald-50/80 px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm backdrop-blur-md">
                  System Active
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Page Content */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.45 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ pathname, setOpen }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200/70 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-300/25 to-lime-300/25 blur-lg" />
            <div className="relative rounded-2xl border border-white/60 bg-white/80 p-2 shadow-md backdrop-blur-md">
              <img
                src={logo}
                alt="TraceBin Logo"
                className="h-11 w-11 object-contain"
              />
            </div>
          </div>

          <div>
            <p className="text-xl font-extrabold tracking-tight text-slate-950">
              TraceBin
            </p>
            <p className="text-sm text-slate-500">Portal Navigation</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Modules
        </p>

        <nav className="space-y-3">
          {links.map((link) => {
            const active = pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`group block rounded-2xl px-4 py-3.5 text-base font-medium transition-all duration-200 ${
                  active
                    ? "border border-sky-100 bg-white/80 text-slate-950 shadow-[0_10px_25px_rgba(14,165,233,0.10)] backdrop-blur-md"
                    : "border border-transparent text-slate-700 hover:border-white/60 hover:bg-white/65 hover:shadow-sm"
                }`}
              >
                <span className="flex items-center justify-between">
                  {link.label}
                  {active && (
                    <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-sky-500 to-lime-500 shadow-sm" />
                  )}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-5">
        <div className="rounded-[28px] border border-white/50 bg-white/60 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            TraceBin Note
          </p>
          <p className="mt-3 text-base leading-8 text-slate-600">
            Unified monitoring for collection, transport, verification, and audit
            visibility.
          </p>
        </div>
      </div>
    </div>
  );
}