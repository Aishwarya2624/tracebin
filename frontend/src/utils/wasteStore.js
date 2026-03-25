import { buildStepHash } from "./hash";

const EVENT_STORAGE_KEY = "tracebin_events";
const COMPLAINT_STORAGE_KEY = "tracebin_complaints";

/* --------------------------------
   DEFAULT DEMO DATA
-------------------------------- */
const DEFAULT_EVENTS = [
  {
    id: "EVT-DEMO-001",
    binId: "BIN-101",
    area: "Ward 12",
    wasteType: "Mixed Waste",
    truck: "KA-02-TR-8888",
    collector: "Collector Arun",
    status: "Collected",
    pickupWeight: 58,
    plantWeight: null,
    risk: "Low",
    source: "Ward 12",
    ai: {
      category: "Mixed Waste",
      recommendation: "Segregate at source",
    },
    sourceStamp: {
      binId: "BIN-101",
      timestamp: new Date().toISOString(),
      estimatedWeight: 58,
      gpsSource: { lat: 12.971, lng: 77.62 },
    },
    transit: {
      truckId: "KA-02-TR-8888",
      routeId: "ROUTE-KA-02-TR-8888",
      liveGps: { lat: 12.971, lng: 77.62 },
      lastStopMinutes: 0,
      locationType: "Collection Zone",
      unauthorizedStop: false,
      routeDeviation: false,
    },
    destinationStamp: null,
    citizenConfirmation: {
      status: "pending",
      updatedAt: null,
    },
    chain: [
      {
        label: "Source Scan",
        actor: "Collector Arun",
        time: new Date().toLocaleString(),
        hash: "demo-source-scan",
      },
    ],
    anomalyIssues: [
      {
        type: "Citizen Confirmation Pending",
        severity: "medium",
        note: "Citizen has not yet confirmed that collection happened.",
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "EVT-DEMO-002",
    binId: "BIN-102",
    area: "Ward 8",
    wasteType: "Dry Waste",
    truck: "KA-01-EF-1234",
    collector: "Collector Meena",
    status: "Processed",
    pickupWeight: 42,
    plantWeight: 41,
    risk: "Low",
    source: "Ward 8",
    ai: {
      category: "Dry Waste",
      recommendation: "Send for sorting and recycling",
    },
    sourceStamp: {
      binId: "BIN-102",
      timestamp: new Date().toISOString(),
      estimatedWeight: 42,
      gpsSource: { lat: 12.948, lng: 77.606 },
    },
    transit: {
      truckId: "KA-01-EF-1234",
      routeId: "ROUTE-KA-01-EF-1234",
      liveGps: { lat: 12.93, lng: 77.6 },
      lastStopMinutes: 0,
      locationType: "Plant Zone",
      unauthorizedStop: false,
      routeDeviation: false,
    },
    destinationStamp: {
      finalWeight: 41,
      verificationId: "VR-DEMO-001",
      processingType: "Mixed Sorting",
    },
    citizenConfirmation: {
      status: "confirmed",
      updatedAt: new Date().toISOString(),
    },
    chain: [
      {
        label: "Source Scan",
        actor: "Collector Meena",
        time: new Date().toLocaleString(),
        hash: "demo-scan-102",
      },
      {
        label: "Plant Verification",
        actor: "Plant Operator",
        time: new Date().toLocaleString(),
        hash: "demo-plant-102",
      },
    ],
    anomalyIssues: [],
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_COMPLAINTS = [
  {
    id: "CMP-DEMO-001",
    binId: "BIN-101",
    area: "Ward 12",
    wasteType: "Mixed Waste",
    complaintText: "Waste was not cleared properly near the market area.",
    status: "Open",
    createdAt: new Date().toISOString(),
    createdLabel: new Date().toLocaleString(),
    resolvedAt: null,
    resolvedLabel: null,
    resolvedBy: null,
    linkedEventType: null,
    linkedEventId: null,
    operationalUpdates: [],
  },
  {
    id: "CMP-DEMO-002",
    binId: "BIN-102",
    area: "Ward 8",
    wasteType: "Dry Waste",
    complaintText: "Bin overflow issue was reported in the morning.",
    status: "Resolved - Operational",
    createdAt: new Date().toISOString(),
    createdLabel: new Date().toLocaleString(),
    resolvedAt: new Date().toISOString(),
    resolvedLabel: new Date().toLocaleString(),
    resolvedBy: "System (Operational Flow)",
    linkedEventType: "plant",
    linkedEventId: "EVT-DEMO-002",
    operationalUpdates: [
      {
        type: "plant",
        time: new Date().toLocaleString(),
        note: "Complaint linked to plant verification.",
      },
    ],
  },
];

/* --------------------------------
   BASIC STORAGE HELPERS
-------------------------------- */
function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readEvents() {
  return readJson(EVENT_STORAGE_KEY);
}

function writeEvents(events) {
  writeJson(EVENT_STORAGE_KEY, events);
}

function readComplaints() {
  return readJson(COMPLAINT_STORAGE_KEY);
}

function writeComplaints(complaints) {
  writeJson(COMPLAINT_STORAGE_KEY, complaints);
}

/* --------------------------------
   DEMO DATA INITIALIZATION / RESET
-------------------------------- */
export function initializeDemoData() {
  const events = readEvents();
  const complaints = readComplaints();

  if (!events.length) {
    writeEvents(DEFAULT_EVENTS);
  }

  if (!complaints.length) {
    writeComplaints(DEFAULT_COMPLAINTS);
  }
}

export function resetDemoData() {
  localStorage.removeItem(EVENT_STORAGE_KEY);
  localStorage.removeItem(COMPLAINT_STORAGE_KEY);

  writeEvents(DEFAULT_EVENTS);
  writeComplaints(DEFAULT_COMPLAINTS);

  return {
    events: readEvents(),
    complaints: readComplaints(),
  };
}

/* --------------------------------
   CHAIN / ANALYSIS HELPERS
-------------------------------- */
async function appendChain(event, label, actor, metadata = {}) {
  const previousHash =
    event.chain?.length > 0 ? event.chain[event.chain.length - 1].hash : "GENESIS";

  const stepData = {
    binId: event.binId,
    label,
    actor,
    time: new Date().toISOString(),
    ...metadata,
  };

  const hash = await buildStepHash(stepData, previousHash);

  return [
    ...(event.chain || []),
    {
      label,
      actor,
      time: new Date().toLocaleString(),
      hash: hash.slice(0, 16),
    },
  ];
}

function evaluateUnauthorizedStop(stopMinutes, locationType) {
  return Number(stopMinutes) > 10 && locationType === "Unlisted Area";
}

function analyzeEvent(event) {
  const issues = [];

  const pickupWeight = Number(event.pickupWeight || 0);
  const plantWeight = Number(event.plantWeight || 0);

  if (pickupWeight > 0 && plantWeight > 0) {
    const variancePct = Math.abs(pickupWeight - plantWeight) / pickupWeight;
    if (variancePct > 0.05) {
      issues.push({
        type: "Weight Variance",
        severity: variancePct > 0.2 ? "high" : "medium",
        note: `Weight mismatch exceeded 5%. Pickup ${pickupWeight} kg vs Plant ${plantWeight} kg.`,
      });
    }
  }

  if (event.transit?.routeDeviation) {
    issues.push({
      type: "Route Deviation",
      severity: "high",
      note: "Truck moved outside the authorized route corridor.",
    });
  }

  if (event.transit?.unauthorizedStop) {
    issues.push({
      type: "Unauthorized Stop",
      severity: "high",
      note: `Truck stopped ${event.transit.lastStopMinutes} minutes in an unlisted area.`,
    });
  }

  if (event.citizenConfirmation?.status === "reported-anomaly") {
    issues.push({
      type: "Citizen Reported Anomaly",
      severity: "high",
      note: "Citizen reported that collection did not happen correctly.",
    });
  }

  if (event.citizenConfirmation?.status === "pending") {
    issues.push({
      type: "Citizen Confirmation Pending",
      severity: "medium",
      note: "Citizen has not yet confirmed that collection happened.",
    });
  }

  let risk = "Low";
  if (issues.some((i) => i.severity === "high")) risk = "High";
  else if (issues.length > 0) risk = "Medium";

  return { issues, risk };
}

function updateComplaintOperationalStatus(binId, eventType, eventId, finalStatus) {
  const complaints = readComplaints();
  let changed = false;

  const updated = complaints.map((c) => {
    if (c.binId !== binId) return c;
    if (c.status === "Resolved - Manual") return c;

    changed = true;

    const operationalUpdates = [...(c.operationalUpdates || [])];
    operationalUpdates.push({
      type: eventType,
      time: new Date().toLocaleString(),
      note:
        eventType === "pickup"
          ? "Complaint linked to collector pickup."
          : eventType === "plant"
          ? "Complaint linked to plant verification."
          : eventType === "transit"
          ? "Complaint linked to transit anomaly monitoring."
          : "Complaint linked to operational flow.",
    });

    return {
      ...c,
      linkedEventType: eventType,
      linkedEventId: eventId,
      operationalUpdates,
      status: finalStatus ? "Resolved - Operational" : c.status,
      resolvedAt: finalStatus ? new Date().toISOString() : c.resolvedAt,
      resolvedLabel: finalStatus ? new Date().toLocaleString() : c.resolvedLabel,
      resolvedBy: finalStatus ? "System (Operational Flow)" : c.resolvedBy,
    };
  });

  if (changed) writeComplaints(updated);
}

/* --------------------------------
   PUBLIC GETTERS
-------------------------------- */
export function getAllEvents() {
  initializeDemoData();
  return readEvents();
}

export function getLatestEventByBinId(binId) {
  initializeDemoData();
  const events = readEvents().filter((e) => e.binId === binId);
  return events.length ? events[events.length - 1] : null;
}

export function getAllComplaints() {
  initializeDemoData();
  return readComplaints();
}

export function getAllAlerts() {
  initializeDemoData();

  const events = readEvents();
  const complaints = readComplaints();
  const alerts = [];

  events.forEach((e, idx) => {
    alerts.push({
      id: `evt-${idx + 1}`,
      type: "Pickup Logged",
      message: `${e.binId} collected by ${e.collector} using truck ${e.truck}`,
      severity: "low",
      time: new Date(e.createdAt).toLocaleTimeString(),
    });

    e.anomalyIssues?.forEach((issue, issueIdx) => {
      alerts.push({
        id: `anomaly-${idx + 1}-${issueIdx + 1}`,
        type: issue.type,
        message: `${e.binId}: ${issue.note}`,
        severity: issue.severity,
        time: new Date(e.createdAt).toLocaleTimeString(),
      });
    });
  });

  complaints.forEach((c, idx) => {
    alerts.push({
      id: `cmp-${idx + 1}`,
      type:
        c.status === "Resolved - Operational"
          ? "Complaint Resolved Operationally"
          : c.status === "Resolved - Manual"
          ? "Complaint Resolved Manually"
          : "Citizen Complaint",
      message:
        c.status === "Resolved - Operational"
          ? `${c.binId} complaint resolved through ${c.linkedEventType}`
          : c.status === "Resolved - Manual"
          ? `${c.binId} complaint manually resolved by ${c.resolvedBy}`
          : `${c.binId}: ${c.complaintText}`,
      severity: c.status === "Open" ? "medium" : "low",
      time: new Date(c.createdAt).toLocaleTimeString(),
    });
  });

  return alerts;
}

/* --------------------------------
   EVENT ACTIONS
-------------------------------- */
export async function savePickupEvent({
  bin,
  truck,
  collector = "Collector",
  estimatedWeight = 50,
}) {
  initializeDemoData();

  const events = readEvents();
  const now = new Date();

  const baseEvent = {
    id: `EVT-${Date.now()}`,
    binId: bin.id,
    area: bin.area,
    wasteType: bin.wasteType,
    truck: truck || bin.assignedTruck,
    collector,
    status: "Collected",
    pickupWeight: Number(estimatedWeight),
    plantWeight: null,
    risk: "Low",
    source: bin.area,
    ai: {
      category: bin.wasteType,
      recommendation: "Segregate at source",
    },
    sourceStamp: {
      binId: bin.id,
      timestamp: now.toISOString(),
      estimatedWeight: Number(estimatedWeight),
      gpsSource: { lat: bin.lat ?? 12.971, lng: bin.lng ?? 77.62 },
    },
    transit: {
      truckId: truck || bin.assignedTruck,
      routeId: `ROUTE-${truck || bin.assignedTruck}`,
      liveGps: { lat: bin.lat ?? 12.971, lng: bin.lng ?? 77.62 },
      lastStopMinutes: 0,
      locationType: "Collection Zone",
      unauthorizedStop: false,
      routeDeviation: false,
    },
    destinationStamp: null,
    citizenConfirmation: {
      status: "pending",
      updatedAt: null,
    },
    chain: [],
    anomalyIssues: [],
    createdAt: now.toISOString(),
  };

  const chain = await appendChain(baseEvent, "Source Scan", collector, {
    sourceStamp: baseEvent.sourceStamp,
  });

  const event = {
    ...baseEvent,
    chain,
  };

  const analysis = analyzeEvent(event);
  event.risk = analysis.risk;
  event.anomalyIssues = analysis.issues;

  events.push(event);
  writeEvents(events);

  updateComplaintOperationalStatus(bin.id, "pickup", event.id, false);

  return event;
}

export async function updateCitizenConfirmation(binId, status) {
  initializeDemoData();

  const events = readEvents();
  const idx = events.findIndex((e) => e.binId === binId);
  if (idx === -1) return null;

  const event = events[idx];

  const updated = {
    ...event,
    citizenConfirmation: {
      status,
      updatedAt: new Date().toISOString(),
    },
  };

  updated.chain = await appendChain(
    updated,
    status === "confirmed" ? "Citizen Confirmation" : "Citizen Reported Anomaly",
    "Citizen",
    { status }
  );

  const analysis = analyzeEvent(updated);
  updated.risk = analysis.risk;
  updated.anomalyIssues = analysis.issues;

  events[idx] = updated;
  writeEvents(events);

  return updated;
}

export async function updateTransitSimulation(
  binId,
  {
    lat,
    lng,
    stopMinutes = 0,
    locationType = "Authorized Route",
    routeDeviation = false,
  }
) {
  initializeDemoData();

  const events = readEvents();
  const idx = events.findIndex((e) => e.binId === binId);
  if (idx === -1) return null;

  const event = events[idx];
  const unauthorizedStop = evaluateUnauthorizedStop(stopMinutes, locationType);

  const updated = {
    ...event,
    transit: {
      ...event.transit,
      liveGps: { lat, lng },
      lastStopMinutes: Number(stopMinutes),
      locationType,
      unauthorizedStop,
      routeDeviation,
    },
  };

  updated.chain = await appendChain(updated, "Transit Update", "Truck System", {
    lat,
    lng,
    stopMinutes,
    locationType,
    unauthorizedStop,
    routeDeviation,
  });

  const analysis = analyzeEvent(updated);
  updated.risk = analysis.risk;
  updated.anomalyIssues = analysis.issues;

  events[idx] = updated;
  writeEvents(events);

  if (routeDeviation || unauthorizedStop) {
    updateComplaintOperationalStatus(binId, "transit", updated.id, false);
  }

  return updated;
}

export async function verifyPlantEntry(
  binId,
  plantWeight,
  processingType = "Mixed Sorting"
) {
  initializeDemoData();

  const events = readEvents();
  const idx = events.findIndex((e) => e.binId === binId);
  if (idx === -1) return null;

  const event = events[idx];

  const updated = {
    ...event,
    plantWeight: Number(plantWeight),
    status: "Processed",
    destinationStamp: {
      finalWeight: Number(plantWeight),
      verificationId: `VR-${Date.now()}`,
      processingType,
    },
  };

  updated.chain = await appendChain(updated, "Plant Verification", "Plant Operator", {
    finalWeight: Number(plantWeight),
    processingType,
  });

  const analysis = analyzeEvent(updated);
  updated.risk = analysis.risk;
  updated.anomalyIssues = analysis.issues;

  events[idx] = updated;
  writeEvents(events);

  updateComplaintOperationalStatus(binId, "plant", updated.id, true);

  return updated;
}

/* --------------------------------
   COMPLAINT ACTIONS
-------------------------------- */
export async function saveComplaint({ bin, complaintText }) {
  initializeDemoData();

  const complaints = readComplaints();
  const now = new Date();

  const complaint = {
    id: `CMP-${Date.now()}`,
    binId: bin.id,
    area: bin.area,
    wasteType: bin.wasteType,
    complaintText,
    status: "Open",
    createdAt: now.toISOString(),
    createdLabel: now.toLocaleString(),
    resolvedAt: null,
    resolvedLabel: null,
    resolvedBy: null,
    linkedEventType: null,
    linkedEventId: null,
    operationalUpdates: [],
  };

  complaints.unshift(complaint);
  writeComplaints(complaints);
  return complaint;
}

export function resolveComplaint(complaintId, resolvedBy = "Admin Officer") {
  initializeDemoData();

  const complaints = readComplaints();
  const idx = complaints.findIndex((c) => c.id === complaintId);
  if (idx === -1) return null;

  const now = new Date();

  complaints[idx] = {
    ...complaints[idx],
    status: "Resolved - Manual",
    resolvedAt: now.toISOString(),
    resolvedLabel: now.toLocaleString(),
    resolvedBy,
  };

  writeComplaints(complaints);
  return complaints[idx];
}