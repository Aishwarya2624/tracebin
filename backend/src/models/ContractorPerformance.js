import mongoose from "mongoose";

const contractorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: String,
    onTimeRate: { type: Number, default: 0.9 },
    avgWeightVariance: { type: Number, default: 0 },
    routeDeviationRate: { type: Number, default: 0 },
    anomalyFrequency: { type: Number, default: 0 },
    trustScore: { type: Number, default: 80 },
    isolationScore: { type: Number, default: 0 },
    notes: String
  },
  { timestamps: true }
);

export default mongoose.model("ContractorPerformance", contractorSchema);
