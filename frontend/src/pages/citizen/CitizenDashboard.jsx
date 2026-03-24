import { MapPinned, QrCode, AlarmClock, Route, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { trucks, bins } from "../../data/mock.js";

export default function CollectorDashboard() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [binData, setBinData] = useState(null);
  const [pickupDone, setPickupDone] = useState(false);

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

            // 🔥 FIND BIN
            const found = bins.find((b) => b.id === decodedText);

            if (found) {
              setBinData(found);
            } else {
              setBinData(null);
            }

            setPickupDone(false);

            await stopScanner();
            setScannerOpen(false);
          },
          () => {}
        );
      } catch (error) {
        console.error("QR scanner error:", error);
        alert("Camera access failed");
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
    } catch (err) {
      console.error(err);
    }
  };

  const handlePickup = () => {
    setPickupDone(true);
  };

  return (
    <div className="space-y-5">

      {/* TRUCKS */}
      <div className="grid gap-4 md:grid-cols-3">
        {trucks.map((t) => (
          <motion.div
            key={t.id}
            className="glass rounded-xl border border-white/10 p-4"
            whileHover={{ y: -2 }}
          >
            <div className="flex justify-between">
              <p className="font-semibold">{t.plate}</p>
              <span className={`text-xs px-2 py-1 rounded ${
                t.status === "alert" ? "bg-amber/30" : "bg-neon/20"
              }`}>
                {t.status}
              </span>
            </div>

            <p className="text-sm text-white/60">Deviation {t.deviation}%</p>

            <div className="mt-2 flex gap-2 text-cyan text-sm">
              <MapPinned size={16}/>
              {t.lat.toFixed(3)} | {t.lng.toFixed(3)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* QR + RESULT */}
      <div className="glass p-4 rounded-xl border border-white/10">
        <div className="flex justify-between mb-3">
          <h3 className="font-semibold">Pickup flow</h3>

          <button
            onClick={() => setScannerOpen(true)}
            className="bg-neon px-4 py-2 rounded font-semibold flex items-center gap-2 text-ink"
          >
            <QrCode size={16}/> Scan QR
          </button>
        </div>

        {scanResult && (
          <div className="mb-3 p-3 bg-green-500/10 border border-green-400/30 rounded">
            <p className="text-green-300 text-sm">Scanned Result</p>
            <p className="text-white text-sm">{scanResult}</p>
          </div>
        )}

        {/* BIN DETAILS */}
        {binData && (
          <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded space-y-2">
            <p className="text-blue-300 font-semibold">Bin Details</p>

            <p>ID: {binData.id}</p>
            <p>Area: {binData.area}</p>
            <p>Waste: {binData.wasteType}</p>
            <p>Last Pickup: {binData.lastPickup}</p>
            <p>Truck: {binData.assignedTruck}</p>

            <button
              onClick={handlePickup}
              className="mt-2 bg-green-600 px-4 py-2 rounded text-white"
            >
              Confirm Pickup
            </button>

            {pickupDone && (
              <p className="text-green-400 text-sm mt-2">
                ✔ Pickup confirmed
              </p>
            )}
          </div>
        )}

        {!binData && scanResult && (
          <p className="text-red-400 text-sm">
            ❌ Invalid QR — use BIN-1001
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-3 mt-4 text-sm">
          <div className="glass p-3 rounded">1) Scan QR</div>
          <div className="glass p-3 rounded">2) Upload proof</div>
          <div className="glass p-3 rounded text-amber flex gap-2 items-center">
            <AlarmClock size={16}/> 3) Alerts
          </div>
        </div>
      </div>

      {/* ROUTE */}
      <div className="glass p-4 rounded-xl border border-white/10">
        <h3 className="mb-2 font-semibold">Current route</h3>
        <div className="flex gap-2 text-white/70">
          <Route size={16}/>
          Ward 1 → Plant → ETA 32 min
        </div>
      </div>

      {/* SCANNER MODAL */}
      {scannerOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="glass p-5 rounded-xl w-full max-w-md">
            <div className="flex justify-between mb-3">
              <h3>Scan QR</h3>
              <button onClick={() => setScannerOpen(false)}>
                <X />
              </button>
            </div>

            <div id="collector-qr-reader" className="bg-white rounded"/>

            <p className="text-sm text-white/60 mt-3">
              Point camera to QR
            </p>
          </div>
        </div>
      )}
    </div>
  );
}