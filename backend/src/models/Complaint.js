import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    citizen: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bin: { type: mongoose.Schema.Types.ObjectId, ref: "Bin" },
    type: String,
    description: String,
    status: { type: String, enum: ["open", "in_progress", "resolved"], default: "open" },
    linkedBatch: { type: mongoose.Schema.Types.ObjectId, ref: "WasteBatch" }
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
