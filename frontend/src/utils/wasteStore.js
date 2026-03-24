import { authorizedZones } from "../data/mock";
import { buildStepHash } from "./hash";

const EVENT_STORAGE_KEY = "tracebin_events";
const COMPLAINT_STORAGE_KEY = "tracebin_complaints";

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

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function isInsideAuthorizedZone(lat, lng) {
  return authorizedZones.some((zone) => {
    const dist = haversineKm(lat, lng, zone.lat, zone.lng);
    return dist <= zone.radiusKm;
  });
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

  if (event.transit?.lastStopMinutes > 10 && event.transit?.unauthorizedStop) {
    issues.push({
      type: "Unauthorized Stop",
      severity: "high",
      note: `Truck stopped ${event.transit.lastStopMinutes} minutes outside authorized zones.`,
    });
  }

  if (event.citizenConfirmation?.status === "reported-anomaly") {
    issues.push({
      type: "Citizen Reported Anomaly",
      severity: "high",
      note: "Citizen explicitly reported collection anomaly.",
    });
  }

  if (event.citizenConfirmation?.status === "pending") {
    issues.push({
      type: "Citizen Confirmation Pending",
      severity: "medium",
      note: "Citizen has not yet confirmed pickup.",
    });
  }

  let risk = "Low";
  if (issues.some((i) => i.severity === "high")) risk = "High";
  else if (issues.length) risk = "Medium";

  return { issues, risk };
}

async function appendChain(event, label, actor, metadata = {}) {
  const prevHash =
    event.chain?.length > 0 ? event.chain[event.chain.length - 1].hash : "GENESIS";

  const stepData = {
    binId: event.binId,
    label,
    actor,
    time: new Date().toISOString(),
    ...metadata,
  };

  const hash = await buildStepHash(stepData, prevHash);

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

export function getAllEvents() {
  return readEvents();
}

export function getLatestEventByBinId(binId) {
  const events = readEvents().filter((e) => e.binId === binId);
  return events.length ? events[events.length - 1] : null;
}

export function getAllComplaints() {
  return readComplaints();
}

export async function saveComplaint({ bin, complaintText }) {
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
          : "Complaint linked to plant verification.",
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

export async function savePickupEvent({
  bin,
  truck,
  collector = "Collector",
  estimatedWeight = 50,
}) {
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
      gpsSource: { lat: bin.lat, lng: bin.lng },
    },
    transit: {
      routeId: `ROUTE-${bin.assignedTruck}`,
      lastStopMinutes: 0,
      unauthorizedStop: false,
      liveGps: { lat: bin.lat, lng: bin.lng },
    },
    citizenConfirmation: {
      status: "pending",
      updatedAt: null,
    },
    chain: [],
    anomalyIssues: [],
    createdAt: now.toISOString(),
  };

  const chain = await appendChain(baseEvent, "Source Scan", collector, baseEvent.sourceStamp);

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

export async function updateTransitStatus(binId, lat, lng, stopMinutes = 0) {
  const events = readEvents();
  const idx = events.findIndex((e) => e.binId === binId);
  if (idx === -1) return null;

  const event = events[idx];
  const unauthorizedStop = stopMinutes > 10 && !isInsideAuthorizedZone(lat, lng);

  const updated = {
    ...event,
    transit: {
      ...event.transit,
      liveGps: { lat, lng },
      lastStopMinutes: stopMinutes,
      unauthorizedStop,
    },
  };

  updated.chain = await appendChain(updated, "Transit Update", "Truck System", {
    lat,
    lng,
    stopMinutes,
    unauthorizedStop,
  });

  const analysis = analyzeEvent(updated);
  updated.risk = analysis.risk;
  updated.anomalyIssues = analysis.issues;

  events[idx] = updated;
  writeEvents(events);
  return updated;
}

export async function verifyPlantEntry(binId, plantWeight, processingType = "Mixed Sorting") {
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

export function getAllAlerts() {
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