import mongoose from "mongoose";

const truckSchema = new mongoose.Schema(
  {
    plate: { type: String, unique: true },
    contractor: { type: mongoose.Schema.Types.ObjectId, ref: "ContractorPerformance" },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["active", "maintenance", "offline"], default: "active" },
    lastPing: { lat: Number, lng: Number, at: Date },
    route: [{ lat: Number, lng: Number, at: Date }]
  },
  { timestamps: true }
);

export default mongoose.model("Truck", truckSchema);
