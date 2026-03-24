const STORAGE_KEY = "tracebin_events";

function readEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function getAllEvents() {
  return readEvents();
}

export function getLatestEventByBinId(binId) {
  const events = readEvents().filter((e) => e.binId === binId);
  if (!events.length) return null;
  return events[events.length - 1];
}

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
  return event;
}

export function getAllAlerts() {
  const events = readEvents();

  return events.map((e, idx) => ({
    id: idx + 1,
    type: "Pickup Logged",
    message: `${e.binId} collected by ${e.collector} using truck ${e.truck}`,
    severity: "low",
    time: new Date(e.createdAt).toLocaleTimeString(),
  }));
}