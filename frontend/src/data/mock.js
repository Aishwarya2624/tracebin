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
  },
  {
    id: "BIN-1002",
    area: "Ward 2",
    wasteType: "Dry Waste",
    lastPickup: "Today 9:10 AM",
    assignedTruck: "KA-02-TR-8888",
  },
];

export const alerts = [
  {
    id: 1,
    type: "Weight Mismatch",
    message: "Truck KA-01-TR-1234 reported 50kg but plant received 30kg",
    severity: "high",
    time: "10:45 AM",
  },
  {
    id: 2,
    type: "Route Deviation",
    message: "Truck KA-02-TR-8888 deviated from assigned route",
    severity: "medium",
    time: "11:20 AM",
  },
];

export const passport = {
  id: "BIN-1001",
  status: "Collected",
  risk: "Low",

  source: "Ward 1",
  collector: "Ravi Kumar",
  truck: "KA-01-TR-1234",

  pickupWeight: 50,
  plantWeight: 48,

  ai: {
    category: "Mixed Waste",
    recommendation: "Segregate at source",
  },

  chain: [
    {
      label: "Citizen Upload",
      actor: "Citizen",
      time: "08:30 AM",
      hash: "A1B2C3",
    },
    {
      label: "Collector Pickup",
      actor: "Collector",
      time: "09:15 AM",
      hash: "D4E5F6",
    },
    {
      label: "Plant Verification",
      actor: "Plant",
      time: "10:10 AM",
      hash: "G7H8I9",
    },
  ],
};