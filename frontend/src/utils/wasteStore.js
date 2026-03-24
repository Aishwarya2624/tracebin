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

/* ---------------- INTERNAL READ/WRITE ---------------- */

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

/* ---------------- EVENTS ---------------- */

export function getAllEvents() {
  return readEvents();
}

export function getLatestEventByBinId(binId) {
  const events = readEvents().filter((e) => e.binId === binId);
  if (!events.length) return null;
  return events[events.length - 1];
}

/* ---------------- COMPLAINTS ---------------- */

export function getAllComplaints() {
  return readComplaints();
}

export function getComplaintById(id) {
  return readComplaints().find((c) => c.id === id) || null;
}

export function saveComplaint({ bin, complaintText }) {
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

/* ---------------- OPERATIONAL LINKING ---------------- */

function autoLinkComplaintsToEvents(binId, eventType, eventData = {}) {
  const complaints = readComplaints();
  let changed = false;
  const now = new Date();

  const updated = complaints.map((complaint) => {
    if (complaint.binId !== binId) return complaint;
    if (complaint.status === "Resolved - Manual") return complaint;

    const operationalUpdates = [...(complaint.operationalUpdates || [])];

    const alreadyHasThisType = operationalUpdates.some((u) => u.type === eventType);
    if (!alreadyHasThisType) {
      operationalUpdates.push({
        type: eventType,
        time: now.toLocaleString(),
        note:
          eventType === "pickup"
            ? "Complaint linked to collector pickup event."
            : "Complaint linked to plant verification event.",
      });
    }

    changed = true;

    if (eventType === "pickup") {
      return {
        ...complaint,
        linkedEventType: "pickup",
        linkedEventId: eventData.id || complaint.linkedEventId,
        operationalUpdates,
      };
    }

    return {
      ...complaint,
      linkedEventType: "plant",
      linkedEventId: eventData.id || complaint.linkedEventId,
      operationalUpdates,
      status: "Resolved - Operational",
      resolvedAt: now.toISOString(),
      resolvedLabel: now.toLocaleString(),
      resolvedBy: "System (Plant Verification)",
    };
  });

  if (changed) writeComplaints(updated);
}

/* 
  IMPORTANT:
  This repairs old complaints by matching them to already-saved events.
  Use this when loading Admin so operational resolution appears even for old data.
*/
export function reconcileComplaintsWithEvents() {
  const complaints = readComplaints();
  const events = readEvents();

  let changed = false;

  const updatedComplaints = complaints.map((complaint) => {
    if (complaint.status === "Resolved - Manual") return complaint;

    const relatedEvents = events.filter((e) => e.binId === complaint.binId);
    if (!relatedEvents.length) return complaint;

    const latest = relatedEvents[relatedEvents.length - 1];
    const operationalUpdates = [...(complaint.operationalUpdates || [])];

    const hasPickup = operationalUpdates.some((u) => u.type === "pickup");
    const hasPlant = operationalUpdates.some((u) => u.type === "plant");

    if (!hasPickup) {
      operationalUpdates.push({
        type: "pickup",
        time: latest.createdAt
          ? new Date(latest.createdAt).toLocaleString()
          : "Recorded",
        note: "Complaint linked to collector pickup event.",
      });
    }

    if (latest.plantVerification && !hasPlant) {
      operationalUpdates.push({
        type: "plant",
        time: latest.plantVerification.verifiedAt
          ? new Date(latest.plantVerification.verifiedAt).toLocaleString()
          : "Recorded",
        note: "Complaint linked to plant verification event.",
      });
    }

    const nextComplaint = latest.plantVerification
      ? {
          ...complaint,
          linkedEventType: "plant",
          linkedEventId: latest.id,
          operationalUpdates,
          status: "Resolved - Operational",
          resolvedAt:
            complaint.resolvedAt || latest.plantVerification.verifiedAt || new Date().toISOString(),
          resolvedLabel:
            complaint.resolvedLabel ||
            (latest.plantVerification.verifiedAt
              ? new Date(latest.plantVerification.verifiedAt).toLocaleString()
              : new Date().toLocaleString()),
          resolvedBy: complaint.resolvedBy || "System (Plant Verification)",
        }
      : {
          ...complaint,
          linkedEventType: "pickup",
          linkedEventId: latest.id,
          operationalUpdates,
        };

    const hasChanged =
      JSON.stringify(nextComplaint) !== JSON.stringify(complaint);

    if (hasChanged) changed = true;
    return nextComplaint;
  });

  if (changed) {
    writeComplaints(updatedComplaints);
  }

  return updatedComplaints;
}

/* ---------------- EVENT SAVE / UPDATE ---------------- */

export function savePickupEvent({ bin, truck, collector = "Collector" }) {
  const events = readEvents();

  const now = new Date();
  const timestamp = now.toISOString();
  const timeLabel = now.toLocaleString();

  const event = {
    id: `EVT-${Date.now()}`,
    binId: bin.id,
    area: bin.area,
    wasteType: bin.wasteType,
    truck: truck || bin.assignedTruck,
    collector,
    status: "Collected",
    pickupWeight: 50,
    plantWeight: null,
    risk: "Low",
    source: bin.area,
    ai: {
      category: bin.wasteType,
      recommendation: "Segregate at source",
    },
    chain: [
      {
        label: "Collector Pickup",
        actor: collector,
        time: timeLabel,
        hash: `PK-${Date.now().toString().slice(-6)}`,
      },
    ],
    createdAt: timestamp,
  };

  events.push(event);
  writeEvents(events);

  autoLinkComplaintsToEvents(bin.id, "pickup", event);

  return event;
}

export function verifyPlantEntry(binId, plantWeight) {
  const events = readEvents();
  const idx = events.findIndex((e) => e.binId === binId);

  if (idx === -1) return null;

  const event = events[idx];
  const pickupWeight = Number(event.pickupWeight || 0);
  const finalPlantWeight = Number(plantWeight || 0);
  const diff = Math.abs(pickupWeight - finalPlantWeight);

  let risk = "Low";
  let alertType = null;

  if (diff >= 15) {
    risk = "High";
    alertType = "Weight Mismatch";
  } else if (diff >= 5) {
    risk = "Medium";
    alertType = "Minor Weight Variation";
  }

  const now = new Date();
  const timeLabel = now.toLocaleString();

  const updated = {
    ...event,
    plantWeight: finalPlantWeight,
    status: "Processed",
    risk,
    chain: [
      ...(event.chain || []),
      {
        label: "Plant Verification",
        actor: "Plant Operator",
        time: timeLabel,
        hash: `PL-${Date.now().toString().slice(-6)}`,
      },
    ],
    plantVerification: {
      verifiedAt: now.toISOString(),
      mismatch: diff,
      alertType,
    },
  };

  events[idx] = updated;
  writeEvents(events);

  autoLinkComplaintsToEvents(binId, "plant", updated);

  return updated;
}

/* ---------------- ALERTS ---------------- */

export function getAllAlerts() {
  const events = readEvents();
  const complaints = readComplaints();
  const alerts = [];

  events.forEach((e, idx) => {
    alerts.push({
      id: `pickup-${idx + 1}`,
      type: "Pickup Logged",
      message: `${e.binId} collected by ${e.collector} using truck ${e.truck}`,
      severity: "low",
      time: new Date(e.createdAt).toLocaleTimeString(),
    });

    if (e.plantVerification?.alertType) {
      alerts.push({
        id: `plant-${idx + 1}`,
        type: e.plantVerification.alertType,
        message: `${e.binId} pickup weight ${e.pickupWeight} kg vs plant weight ${e.plantWeight} kg`,
        severity: e.risk === "High" ? "high" : "medium",
        time: new Date(e.plantVerification.verifiedAt).toLocaleTimeString(),
      });
    }
  });

  complaints.forEach((c, idx) => {
    alerts.push({
      id: `complaint-${idx + 1}`,
      type:
        c.status === "Resolved - Manual"
          ? "Complaint Resolved Manually"
          : c.status === "Resolved - Operational"
          ? "Complaint Resolved Operationally"
          : "Citizen Complaint",
      message:
        c.status === "Resolved - Operational"
          ? `${c.binId} complaint resolved through linked ${c.linkedEventType} event`
          : c.status === "Resolved - Manual"
          ? `${c.binId} complaint resolved by ${c.resolvedBy}`
          : `${c.binId} in ${c.area}: ${c.complaintText}`,
      severity: c.status === "Open" ? "medium" : "low",
      time: new Date(c.createdAt).toLocaleTimeString(),
    });
  });

  return alerts;
}