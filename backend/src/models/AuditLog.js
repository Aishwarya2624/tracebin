import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    refType: String,
    refId: { type: mongoose.Schema.Types.ObjectId },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: String,
    hash: String,
    prevHash: String,
    meta: {},
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

auditLogSchema.index({ createdAt: 1 });

export default mongoose.model("AuditLog", auditLogSchema);
