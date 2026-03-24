import { MapPinned, QrCode, AlarmClock, Route, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { trucks } from "../../data/mock.js";

export default function CollectorDashboard() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const qrRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    if (!scannerOpen) return;

    const scannerId = "reader";

    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode(scannerId);
        html5QrCodeRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 220, height: 220 },
          },
          (decodedText) => {
            setScanResult(decodedText);
            stopScanner();
            setScannerOpen(false);
          },
          (errorMessage) => {
          }
        );
      } catch (error) {
        console.error("QR scanner error:", error);
        alert("Unable to access camera or start QR scanner.");
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [scannerOpen]);

  const stopScanner = async () => {
    try {
      if (html5QrCodeRef.current) {
        const state = html5QrCodeRef.current.getState();
        if (state === 2 || state === 1) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      }
    } catch (error) {
      console.error("Error stopping scanner:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">
      <div className="w-full space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Collector Operations
          </p>
          <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Collection Route Dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Track assigned trucks, scan bins, upload collection proof, and
                respond to route deviation alerts.
              </p>
            </div>

            <button
              onClick={() => setScannerOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#16a34a] px-5 py-3 font-semibold text-white shadow-sm hover:bg-[#15803d]"
            >
              <QrCode size={18} />
              Scan Bin QR
            </button>
          </div>

          {scanResult && (
            <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-semibold text-green-700">Scanned Result</p>
              <p className="mt-1 text-sm text-slate-700">{scanResult}</p>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {trucks.map((t) => (
            <motion.div
              key={t.id}
              whileHover={{ y: -3 }}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-slate-900">{t.plate}</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    t.status === "alert"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {t.status}
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-600">
                Deviation detected:{" "}
                <span className="font-semibold text-slate-900">
                  {t.deviation}%
                </span>
              </p>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-700">
                <MapPinned size={16} className="text-[#1d4ed8]" />
                Lat {t.lat.toFixed(3)} | Lng {t.lng.toFixed(3)}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Pickup Flow</h2>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              Standard Process
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                1) QR Verification
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Scan bin QR code and automatically geo-tag the collection event.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                2) Evidence Capture
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Record estimated weight and upload a photo for collection proof.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <div className="flex items-center gap-2 text-orange-700">
                <AlarmClock size={16} />
                <p className="text-sm font-semibold">3) Alert Monitoring</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Trigger route alerts if the vehicle pauses too long or deviates
                unexpectedly.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-bold text-slate-900">Current Route</h2>
          <div className="flex items-center gap-2 text-slate-700">
            <Route size={18} className="text-[#1d4ed8]" />
            Ward 1 → Plant South Recycling Park → ETA 32 min
          </div>
        </div>
      </div>

      {scannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Scan Bin QR</h3>
              <button
                onClick={async () => {
                  await stopScanner();
                  setScannerOpen(false);
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div
              id="reader"
              ref={qrRef}
              className="overflow-hidden rounded-2xl border border-slate-200"
            />

            <p className="mt-4 text-sm text-slate-500">
              Allow camera permission and point the camera at the QR code.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}