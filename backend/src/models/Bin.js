import mongoose from "mongoose";

const binSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    citizen: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    address: String,
    ward: String,
    geo: { lat: Number, lng: Number },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: true }
);

export default mongoose.model("Bin", binSchema);
