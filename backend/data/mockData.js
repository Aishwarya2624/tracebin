export const wards = ["Ward 1", "Ward 2", "Ward 3"];
export const contractors = [
  { name: "GreenLoop Logistics", onTimeRate: 0.93, routeDeviationRate: 0.05, anomalyFrequency: 0.02, avgWeightVariance: 0.03 },
  { name: "MetroWaste Services", onTimeRate: 0.88, routeDeviationRate: 0.1, anomalyFrequency: 0.12, avgWeightVariance: 0.15 },
  { name: "EcoTrust Movers", onTimeRate: 0.97, routeDeviationRate: 0.02, anomalyFrequency: 0.01, avgWeightVariance: 0.02 }
];
export const plants = [
  { name: "South Recycling Park", ward: "Ward 1", capacityPerDay: 120, type: "recycling", location: { lat: 12.93, lng: 77.6 } },
  { name: "Riverbend Compost", ward: "Ward 2", capacityPerDay: 90, type: "compost", location: { lat: 12.98, lng: 77.58 } }
];
