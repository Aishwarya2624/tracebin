import { useState } from "react";
import {
  QrCode,
  MapPin,
  Camera,
  FileText,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { bins } from "../../data/mock.js";
import {
  saveComplaint,
  updateCitizenConfirmation,
  getLatestEventByBinId,
} from "../../utils/wasteStore";

export default function CitizenDashboard() {
  const [binId, setBinId] = useState("");
  const [selectedBin, setSelectedBin] = useState(null);
  const [complaintText, setComplaintText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [searched, setSearched] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleFindBin = () => {
    const found = bins.find(
      (b) => b.id.toUpperCase() === binId.trim().toUpperCase()
    );
    setSelectedBin(found || null);
    setSubmitted(false);
    setSubmittedComplaint(null);
    setConfirmationMessage("");
    setSearched(true);
  };

  const handleSubmitComplaint = async () => {
    if (!selectedBin || !complaintText.trim()) return;

    const saved = await saveComplaint({
      bin: selectedBin,
      complaintText: complaintText.trim(),
    });

    setSubmittedComplaint(saved);
    setSubmitted(true);
    setComplaintText("");
  };

  const handleCitizenConfirm = async (status) => {
    if (!selectedBin) return;

    const latest = getLatestEventByBinId(selectedBin.id);
    if (!latest) {
      setConfirmationMessage("No pickup event exists yet for this bin.");
      return;
    }

    await updateCitizenConfirmation(selectedBin.id, status);

    setConfirmationMessage(
      status === "confirmed"
        ? "Citizen confirmation saved."
        : "Citizen anomaly report saved."
    );
  };

  const latestEvent = selectedBin ? getLatestEventByBinId(selectedBin.id) : null;

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-6 py-8 text-slate-900">
      <div className="w-full space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Citizen Services
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Citizen Transparency Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Check bin details, report issues, and confirm whether collection truly happened.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <QrCode size={18} className="text-[#1d4ed8]" />
              <h2 className="text-xl font-bold text-slate-900">
                Check Bin Information
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-600">
              Enter a bin ID like <b>BIN-1001</b>.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={binId}
                onChange={(e) => setBinId(e.target.value)}
                placeholder="Enter bin ID e.g. BIN-1001"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
              />

              <button
                onClick={handleFindBin}
                className="rounded-xl bg-[#1d4ed8] px-5 py-3 font-semibold text-white hover:bg-[#1e40af]"
              >
                Find Bin
              </button>
            </div>

            {searched && binId && !selectedBin && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-700">Bin not found</p>
              </div>
            )}

            {selectedBin && (
              <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-700">Bin Details</p>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-blue-100 bg-white p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Bin ID</p>
                    <p className="mt-1 font-semibold text-slate-900">{selectedBin.id}</p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-white p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Area</p>
                    <p className="mt-1 font-semibold text-slate-900">{selectedBin.area}</p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-white p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Waste Type</p>
                    <p className="mt-1 font-semibold text-slate-900">{selectedBin.wasteType}</p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-white p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Last Pickup</p>
                    <p className="mt-1 font-semibold text-slate-900">{selectedBin.lastPickup}</p>
                  </div>
                </div>

                {latestEvent && (
                  <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4">
                    <p className="text-sm font-semibold text-green-700">
                      Collection Notification
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      Waste for <b>{selectedBin.id}</b> was marked collected by{" "}
                      <b>{latestEvent.collector}</b>.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleCitizenConfirm("confirmed")}
                        className="rounded-xl bg-[#16a34a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#15803d]"
                      >
                        Yes, Collected
                      </button>

                      <button
                        onClick={() => handleCitizenConfirm("reported-anomaly")}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        Report Anomaly
                      </button>
                    </div>

                    {confirmationMessage && (
                      <p className="mt-3 text-sm text-slate-700">
                        {confirmationMessage}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-[#1d4ed8]" />
              <h2 className="text-xl font-bold text-slate-900">Raise Complaint</h2>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-800">
                  <MapPin size={16} className="text-[#1d4ed8]" />
                  <p className="font-semibold">Location-linked complaint</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Report overflowing bins, delayed pickup, or improper handling.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-800">
                  <Camera size={16} className="text-[#1d4ed8]" />
                  <p className="font-semibold">Photo upload support</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Future enhancement: attach evidence images.
                </p>
              </div>

              <textarea
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                placeholder="Write your complaint here..."
                className="min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
              />

              <button
                onClick={handleSubmitComplaint}
                disabled={!selectedBin || !complaintText.trim()}
                className="w-full rounded-xl bg-[#16a34a] px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Submit Complaint
              </button>

              {submitted && submittedComplaint && (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 size={18} />
                    <p className="font-semibold">Complaint submitted</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">
                    Complaint ID: <b>{submittedComplaint.id}</b>
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <div className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle size={18} />
                  <p className="font-semibold">Closing the loop</p>
                </div>
                <p className="mt-2 text-sm text-slate-700">
                  After collector pickup, citizen can confirm collection or report anomaly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}