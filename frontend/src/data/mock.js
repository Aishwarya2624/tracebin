export const trucks = [
  { id: "T-1", plate: "KA-01-TR-1234", status: "active", lat: 12.975, lng: 77.595, deviation: 0 },
  { id: "T-2", plate: "KA-02-TR-8888", status: "alert", lat: 12.99, lng: 77.62, deviation: 18 }
];

export const alerts = [
  { id: 1, severity: "critical", title: "Leakage Event", detail: "Loss of 8.5 kg vs plant weight", batch: "WB-AX93PZ" },
  { id: 2, severity: "high", title: "Truck Entered Red Zone", detail: "T-2 paused 24 min near riverbank", batch: "WB-AX93PZ" },
  { id: 3, severity: "medium", title: "Isolation Score Spike", detail: "Contractor MetroWaste risk +12", batch: "-" }
];

export const passport = {
  id: "WB-AX93PZ",
  source: "BIN-001",
  ward: "Ward 1",
  collector: "Collector Joy",
  truck: "KA-01-TR-1234",
  citizen: "Aditi Citizen",
  predicted: "Mixed",
  segregationQuality: "Medium",
  pickupWeight: 52,
  plantWeight: 44,
  status: "Flagged",
  outcome: "Pending",
  risk: "High",
  ai: { category: "Mixed", contaminationRisk: "Medium", recommendation: "Improve dry segregation" },
  chain: [
    { label: "Pickup", hash: "a12f...", actor: "Collector Joy", time: "08:12" },
    { label: "GPS", hash: "b8cc...", actor: "Collector Joy", time: "08:30" },
    { label: "Plant Weight", hash: "c33e...", actor: "Plant Ops", time: "09:15" }
  ]
};
