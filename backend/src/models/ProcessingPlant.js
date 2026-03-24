import mongoose from "mongoose";

const processingPlantSchema = new mongoose.Schema(
  {
    name: String,
    ward: String,
    location: { lat: Number, lng: Number },
    capacityPerDay: Number,
    type: { type: String, enum: ["recycling", "compost", "wte", "landfill"] },
    contact: String
  },
  { timestamps: true }
);

export default mongoose.model("ProcessingPlant", processingPlantSchema);
