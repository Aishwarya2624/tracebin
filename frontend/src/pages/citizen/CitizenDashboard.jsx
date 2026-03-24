import { useState } from "react";
import { QrCode, MapPin, Camera, FileText, CheckCircle2 } from "lucide-react";
import { bins } from "../../data/mock.js";
import { saveComplaint } from "../../utils/wasteStore";

export default function CitizenDashboard() {
  const [binId, setBinId] = useState("");
  const [selectedBin, setSelectedBin] = useState(null);
  const [complaintText, setComplaintText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleFindBin = () => {
    const found = bins.find(
      (b) => b.id.toUpperCase() === binId.trim().toUpperCase()
    );

    setSelectedBin(found || null);
    setSubmitted(false);
    setSubmittedComplaint(null);
    setSearched(true);
  };

  const handleSubmitComplaint = () => {
    if (!selectedBin || !complaintText.trim()) return;

    const saved = saveComplaint({
      bin: selectedBin,
      complaintText: complaintText.trim(),
    });

    setSubmittedComplaint(saved);
    setSubmitted(true);
    setComplaintText("");
  };

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
            Check bin details, raise complaints, and improve accountability in
            the waste management process.
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
              Enter a bin ID like <b>BIN-1001</b> to view current details.
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
                <p className="text-sm font-semibold text-red-700">
                  Bin not found
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  Please enter a valid bin ID available in the system.
                </p>
              </div>
            )}

            {selectedBin && (
              <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-blue-700">
                  Bin Details
                </p>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-blue-100 bg-white p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Bin ID
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedBin.id}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-white p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Area
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedBin.area}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-white p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Waste Type
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedBin.wasteType}
                    </p>
                  </div>

                  <div className="rounded-xl border border-blue-100 bg-white p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Last Pickup
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedBin.lastPickup}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-[#1d4ed8]" />
              <h2 className="text-xl font-bold text-slate-900">
                Raise Complaint
              </h2>
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
                  Future enhancement: upload waste images for visual evidence.
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
      Your complaint has been registered for bin <b>{submittedComplaint.binId}</b>.
    </p>
    <p className="mt-1 text-xs text-slate-500">
      Complaint ID: {submittedComplaint.id}
    </p>
    <p className="mt-1 text-xs text-slate-500">
      Status: {submittedComplaint.status} • {submittedComplaint.createdLabel}
    </p>
  </div>
)}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Citizen Workflow
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">1) Identify Bin</p>
              <p className="mt-2 text-sm text-slate-600">
                Enter the bin ID to fetch current system details.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">2) Review Status</p>
              <p className="mt-2 text-sm text-slate-600">
                Check area, waste type, and latest pickup information.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">3) Raise Complaint</p>
              <p className="mt-2 text-sm text-slate-600">
                Submit a complaint that becomes visible to administrators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}