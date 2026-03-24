export const trucks = [
  {
    id: 1,
    plate: "KA-01-TR-1234",
    status: "active",
    deviation: 0,
    lat: 12.971,
    lng: 77.620,
  },
  {
    id: 2,
    plate: "KA-02-TR-8888",
    status: "alert",
    deviation: 18,
    lat: 12.959,
    lng: 77.630,
  },
  {
    id: 3,
    plate: "KA-03-TR-4567",
    status: "active",
    deviation: 3,
    lat: 12.945,
    lng: 77.615,
  },
];

export const bins = [
  {
    id: "BIN-1001",
    area: "Ward 1",
    wasteType: "Mixed Waste",
    lastPickup: "Today 8:30 AM",
    assignedTruck: "KA-01-TR-1234",
    lat: 12.971,
    lng: 77.620,
    citizenName: "Resident - Ward 1",
  },
  {
    id: "BIN-1002",
    area: "Ward 2",
    wasteType: "Dry Waste",
    lastPickup: "Today 9:10 AM",
    assignedTruck: "KA-02-TR-8888",
    lat: 12.959,
    lng: 77.630,
    citizenName: "Resident - Ward 2",
  },
  {
    id: "BIN-1003",
    area: "Ward 3",
    wasteType: "Wet Waste",
    lastPickup: "Yesterday 6:45 PM",
    assignedTruck: "KA-03-TR-4567",
    lat: 12.945,
    lng: 77.615,
    citizenName: "Resident - Ward 3",
  },
];

export const authorizedZones = [
  { id: "COLLECTION_ZONE_1", name: "Ward 1 Collection Zone", lat: 12.971, lng: 77.620, radiusKm: 1.2 },
  { id: "COLLECTION_ZONE_2", name: "Ward 2 Collection Zone", lat: 12.959, lng: 77.630, radiusKm: 1.2 },
  { id: "COLLECTION_ZONE_3", name: "Ward 3 Collection Zone", lat: 12.945, lng: 77.615, radiusKm: 1.2 },
  { id: "PLANT_ZONE", name: "South Recycling Plant", lat: 12.930, lng: 77.600, radiusKm: 1.5 },
];

export const passport = {
  id: "BIN-1001",
  status: "Pending",
  risk: "Low",
  source: "Ward 1",
  collector: "Not assigned",
  truck: "KA-01-TR-1234",
  pickupWeight: 0,
  plantWeight: null,
  ai: {
    category: "Mixed Waste",
    recommendation: "Segregate at source",
  },
  chain: [],
};

export const alerts = [];