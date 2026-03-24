import { MapPinned, QrCode, AlarmClock, Route, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { trucks } from "../../data/mock.js";

export default function CollectorDashboard() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    if (!scannerOpen) return;

    const scannerId = "collector-qr-reader";

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
          async (decodedText) => {
            setScanResult(decodedText);
            await stopScanner();
            setScannerOpen(false);
          },
          () => {}
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
        if (state === 1 || state === 2) {
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
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        {trucks.map((t) => (
          <motion.div
            key={t.id}
            className="glass rounded-xl border border-white/10 p-4"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold">{t.plate}</p>
              <span
                className={`rounded px-2 py-1 text-xs ${
                  t.status === "alert" ? "bg-amber/30" : "bg-neon/20"
                }`}
              >
                {t.status}
              </span>
            </div>

            <p className="text-sm text-white/60">Deviation {t.deviation}%</p>

            <div className="mt-2 flex items-center gap-2 text-sm text-cyan">
              <MapPinned size={16} />
              Lat {t.lat.toFixed(3)} | Lng {t.lng.toFixed(3)}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-xl border border-white/10 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Pickup flow</h3>
          <button
            onClick={() => setScannerOpen(true)}
            className="flex items-center gap-2 rounded bg-neon px-4 py-2 font-semibold text-ink"
          >
            <QrCode size={16} />
            Scan QR
          </button>
        </div>

        {scanResult && (
          <div className="mb-4 rounded-lg border border-green-400/30 bg-green-500/10 p-3">
            <p className="text-sm font-semibold text-green-300">Scanned Result</p>
            <p className="mt-1 break-all text-sm text-white/80">{scanResult}</p>
          </div>
        )}

        <div className="grid gap-3 text-sm md:grid-cols-3">
          <div className="glass rounded-lg p-3">1) Scan bin QR and auto geotag</div>
          <div className="glass rounded-lg p-3">2) Weight estimation + photo upload</div>
          <div className="glass rounded-lg p-3 flex items-center gap-2 text-amber">
            <AlarmClock size={16} />
            3) Route alerts if you pause too long
          </div>
        </div>
      </div>

      <div className="glass rounded-xl border border-white/10 p-4">
        <h3 className="mb-2 font-semibold">Current route</h3>
        <div className="flex items-center gap-2 text-white/70">
          <Route size={16} />
          Ward 1 → Plant South Recycling Park → ETA 32 min
        </div>
      </div>

      {scannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="glass w-full max-w-md rounded-2xl border border-white/10 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Scan Bin QR</h3>
              <button
                onClick={async () => {
                  await stopScanner();
                  setScannerOpen(false);
                }}
                className="rounded p-2 text-white/70 hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div
              id="collector-qr-reader"
              className="overflow-hidden rounded-xl bg-white"
            />

            <p className="mt-3 text-sm text-white/60">
              Allow camera permission and point the camera at the QR code.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}