import WasteBatch from "../models/WasteBatch.js";
import Alert from "../models/Alert.js";
import ContractorPerformance from "../models/ContractorPerformance.js";
import WasteEvent from "../models/WasteEvent.js";

export const dashboard = async (_req, res) => {
  const [todayCount, processed, alerts, contractors] = await Promise.all([
    WasteBatch.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
    WasteBatch.countDocuments({ status: "processed" }),
    Alert.find().sort({ createdAt: -1 }).limit(10),
    ContractorPerformance.find().sort({ trustScore: -1 }).limit(5)
  ]);

  const risk = await Alert.aggregate([
    { $group: { _id: "$severity", count: { $sum: 1 } } }
  ]);

  res.json({ todayCount, processed, alerts, contractors, risk });
};

export const auditTrail = async (req, res) => {
  const batch = await WasteBatch.findOne({ batchId: req.params.id }).populate("timeline");
  if (!batch) return res.status(404).json({ message: "Batch not found" });
  const events = await WasteEvent.find({ batch: batch._id }).sort({ createdAt: 1 });
  res.json({ batch, events });
};
