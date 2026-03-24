import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "low" },
    type: String,
    reason: String,
    batch: { type: mongoose.Schema.Types.ObjectId, ref: "WasteBatch" },
    truck: { type: mongoose.Schema.Types.ObjectId, ref: "Truck" },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    evidence: String,
    recommendedAction: String,
    resolved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Alert", alertSchema);
