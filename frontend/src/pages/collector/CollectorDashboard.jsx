import { MapPinned, QrCode, AlarmClock, Route, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { trucks, bins } from "../../data/mock.js";

export default function CollectorDashboard() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [cleanedResult, setCleanedResult] = useState("");
  const [binData, setBinData] = useState(null);
  const [pickupConfirmed, setPickupConfirmed] = useState(false);

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
            handleScan(decodedText);
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

  const extractBinId = (decodedText) => {
    if (!decodedText) return "";

    const raw = decodedText.trim();

    // Case 1: direct BIN code like BIN-1001
    if (/^BIN-\d+$/i.test(raw)) {
      return raw.toUpperCase();
    }

    // Case 2: QR contains URL, query string, or path
    try {
      const url = new URL(raw);

      // Check query params first, e.g. ?id=BIN-1001 or ?bin=BIN-1001
      const queryId =
        url.searchParams.get("id") ||
        url.searchParams.get("bin") ||
        url.searchParams.get("binId");

      if (queryId && /^BIN-\d+$/i.test(queryId.trim())) {
        return queryId.trim().toUpperCase();
      }

      // Check last path segment, e.g. /BIN-1001
      const parts = url.pathname.split("/").filter(Boolean);
      const lastPart = parts[parts.length - 1];

      if (lastPart && /^BIN-\d+$/i.test(lastPart.trim())) {
        return lastPart.trim().toUpperCase();
      }
    } catch {
      // Not a valid URL, continue fallback
    }

    // Case 3: find BIN-xxxx anywhere in text
    const match = raw.match(/BIN-\d+/i);
    if (match) {
      return match[0].toUpperCase();
    }

    // Nothing usable found
    return raw;
  };

  const handleScan = (decodedText) => {
    setScanResult(decodedText);

    const normalizedId = extractBinId(decodedText);
    setCleanedResult(normalizedId);

    const foundBin = bins.find(
      (b) => b.id.toUpperCase() === normalizedId.toUpperCase()
    );

    if (foundBin) {
      setBinData(foundBin);
    } else {
      setBinData(null);
    }

    setPickupConfirmed(false);
  };

  const handleConfirmPickup = () => {
    if (!binData) return;
    setPickupConfirmed(true);
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
              <p className="text-sm font-semibold text-green-700">
                Scanned Result
              </p>
              <p className="mt-1 break-all text-sm text-slate-700">
                {scanResult}
              </p>

              {cleanedResult && cleanedResult !== scanResult && (
                <>
                  <p className="mt-3 text-sm font-semibold text-blue-700">
                    Detected Bin ID
                  </p>
                  <p className="mt-1 text-sm text-slate-700">{cleanedResult}</p>
                </>
              )}
            </div>
          )}

          {scanResult && !binData && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">
                Bin not found
              </p>
              <p className="mt-1 text-sm text-slate-700">
                This QR was scanned successfully, but it does not match any bin
                in your system.
              </p>
              <p className="mt-2 text-sm text-slate-700">
                Use QR values like <b>BIN-1001</b>, or URLs that contain a bin
                ID such as <b>.../BIN-1001</b> or <b>?id=BIN-1001</b>.
              </p>
            </div>
          )}

          {binData && (
            <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-700">Bin Details</p>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-blue-100 bg-white p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Bin ID
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {binData.id}
                  </p>
                </div>

                <div className="rounded-xl border border-blue-100 bg-white p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Area
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {binData.area}
                  </p>
                </div>

                <div className="rounded-xl border border-blue-100 bg-white p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Waste Type
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {binData.wasteType}
                  </p>
                </div>

                <div className="rounded-xl border border-blue-100 bg-white p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Last Pickup
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {binData.lastPickup}
                  </p>
                </div>

                <div className="rounded-xl border border-blue-100 bg-white p-3 md:col-span-2">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Assigned Truck
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {binData.assignedTruck}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleConfirmPickup}
                  className="rounded-xl bg-[#16a34a] px-5 py-3 font-semibold text-white shadow-sm hover:bg-[#15803d]"
                >
                  Confirm Pickup
                </button>

                {pickupConfirmed && (
                  <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                    Pickup confirmed successfully
                  </span>
                )}
              </div>
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
          <h2 className="mb-3 text-xl font-bold text-slate-900">
            Current Route
          </h2>
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
              id="collector-qr-reader"
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