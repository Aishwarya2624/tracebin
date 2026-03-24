import mongoose from "mongoose";

const wasteBatchSchema = new mongoose.Schema(
  {
    batchId: { type: String, unique: true },
    sourceBin: { type: mongoose.Schema.Types.ObjectId, ref: "Bin" },
    citizen: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    collector: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    truck: { type: mongoose.Schema.Types.ObjectId, ref: "Truck" },
    ward: String,
    predictedWasteType: String,
    segregationQuality: String,
    pickupWeight: Number,
    plantWeight: Number,
    status: { type: String, enum: ["created", "picked", "in_transit", "arrived", "processed", "lost", "flagged"], default: "created" },
    anomalyFlags: [{ type: String }],
    riskScore: { type: Number, default: 0 },
    finalOutcome: { type: String, enum: ["recycled", "composted", "rejected", "landfilled", "pending"], default: "pending" },
    aiVision: {
      category: String,
      contaminationRisk: String,
      recommendation: String
    },
    timeline: [{ type: mongoose.Schema.Types.ObjectId, ref: "WasteEvent" }]
  },
  { timestamps: true }
);

export default mongoose.model("WasteBatch", wasteBatchSchema);
