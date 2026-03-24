import WasteBatch from "../models/WasteBatch.js";
import WasteEvent from "../models/WasteEvent.js";
import { signEvent } from "../utils/hashChain.js";
import { massBalanceCheck } from "../services/anomalyService.js";
import { io } from "../app.js";

export const recordPlantWeight = async (req, res) => {
  try {
    const { batchId, plantWeight, outcome, plantId } = req.body;
    const batch = await WasteBatch.findOne({ batchId });
    if (!batch) return res.status(404).json({ message: "Batch not found" });
    batch.plantWeight = plantWeight;
    batch.status = "arrived";
    if (outcome) batch.finalOutcome = outcome;

    const prev = await WasteEvent.findOne({ batch: batch._id }).sort({ createdAt: -1 });
    const signed = signEvent({ payload: { plantWeight, plantId }, prevHash: prev?.hash, actor: req.user._id });
    const event = await WasteEvent.create({
      batch: batch._id,
      type: "plant_weight",
      actor: req.user._id,
      payload: { plantWeight, outcome },
      ...signed
    });

    batch.timeline.push(event._id);
    await batch.save();
    const alert = await massBalanceCheck(batch._id);
    io.emit("plant", { batchId, event, alert });
    res.json({ batch, event, alert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const closeProcessing = async (req, res) => {
  try {
    const { batchId, outcome } = req.body;
    const batch = await WasteBatch.findOne({ batchId });
    if (!batch) return res.status(404).json({ message: "Batch not found" });
    batch.finalOutcome = outcome || batch.finalOutcome || "recycled";
    batch.status = "processed";

    const prev = await WasteEvent.findOne({ batch: batch._id }).sort({ createdAt: -1 });
    const signed = signEvent({ payload: { outcome }, prevHash: prev?.hash, actor: req.user._id });
    const event = await WasteEvent.create({ batch: batch._id, type: "processing_complete", actor: req.user._id, payload: { outcome }, ...signed });

    batch.timeline.push(event._id);
    await batch.save();
    io.emit("processed", { batchId, event });
    res.json({ batch, event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
