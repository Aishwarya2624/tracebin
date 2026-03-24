import mongoose from "mongoose";

const wasteEventSchema = new mongoose.Schema(
  {
    batch: { type: mongoose.Schema.Types.ObjectId, ref: "WasteBatch", required: true },
    type: {
      type: String,
      enum: [
        "pickup",
        "gps_ping",
        "stop",
        "route_checkpoint",
        "plant_arrival",
        "plant_weight",
        "processing_complete",
        "alert"
      ],
      required: true
    },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    truck: { type: mongoose.Schema.Types.ObjectId, ref: "Truck" },
    payload: {},
    geo: { lat: Number, lng: Number },
    hash: String,
    prevHash: String,
    signature: String,
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

wasteEventSchema.index({ createdAt: 1 });

export default mongoose.model("WasteEvent", wasteEventSchema);
