import Alert from "../models/Alert.js";
import WasteBatch from "../models/WasteBatch.js";
import { io } from "../app.js";

export const massBalanceCheck = async (batchId, tolerance = 0.1) => {
  const batch = await WasteBatch.findById(batchId);
  if (!batch?.pickupWeight || !batch?.plantWeight) return null;
  const diff = batch.pickupWeight - batch.plantWeight;
  const ratio = diff / (batch.pickupWeight || 1);
  if (ratio > tolerance) {
    const alert = await Alert.create({
      severity: "high",
      type: "Leakage Event",
      reason: `Loss of ${diff.toFixed(2)} kg (${(ratio * 100).toFixed(1)}%) between pickup and plant`,
      batch: batch._id,
      recommendedAction: "Audit route and request proof images"
    });
    io.emit("alert", alert);
    return alert;
  }
  return null;
};

// Spatio-temporal anomaly (ghost truck)
export const detectRouteAnomaly = async ({ truckId, deviationMinutes, reason, batch }) => {
  if (deviationMinutes < 15) return null;
  const alert = await Alert.create({
    severity: deviationMinutes > 30 ? "critical" : "medium",
    type: "Route Deviation",
    reason: reason || `Truck deviated for ${deviationMinutes} minutes`,
    truck: truckId,
    batch,
    recommendedAction: "Call driver, check GPS, send enforcement"
  });
  io.emit("alert", alert);
  return alert;
};

// Lightweight Isolation Forest style scoring (mocked deterministic logic)
export const isolationScore = (contractor) => {
  const features = [
    contractor.onTimeRate,
    1 - contractor.routeDeviationRate,
    1 - contractor.anomalyFrequency,
    1 - Math.abs(contractor.avgWeightVariance)
  ];
  const score = features.reduce((a, b) => a + b, 0) / features.length;
  return Number((score * 100).toFixed(1));
};

export const updateContractorTrust = async (contractor) => {
  contractor.isolationScore = isolationScore(contractor);
  contractor.trustScore = Math.max(10, Math.min(100, contractor.isolationScore - contractor.anomalyFrequency * 10));
  await contractor.save();
  return contractor;
};
