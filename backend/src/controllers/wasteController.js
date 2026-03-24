import { nanoid } from "nanoid";
import WasteBatch from "../models/WasteBatch.js";
import WasteEvent from "../models/WasteEvent.js";
import Bin from "../models/Bin.js";
import { signEvent } from "../utils/hashChain.js";
import { io } from "../app.js";

export const createPickup = async (req, res) => {
  try {
    const { binCode, weight, photoUrl, geo } = req.body;
    const bin = await Bin.findOne({ code: binCode }).populate("citizen");
    if (!bin) return res.status(404).json({ message: "Bin not found" });

    const batch = await WasteBatch.create({
      batchId: `WB-${nanoid(6)}`,
      sourceBin: bin._id,
      citizen: bin.citizen?._id,
      collector: req.user._id,
      ward: bin.ward,
      pickupWeight: weight,
      status: "picked",
      predictedWasteType: "mixed",
      segregationQuality: "unknown"
    });

    const signed = signEvent({ payload: { weight, photoUrl, geo }, actor: req.user._id });
    const event = await WasteEvent.create({
      batch: batch._id,
      type: "pickup",
      actor: req.user._id,
      payload: { weight, photoUrl },
      geo,
      ...signed
    });

    batch.timeline.push(event._id);
    await batch.save();
    io.emit("pickup", { batch, event });
    res.json({ batch, event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logGps = async (req, res) => {
  try {
    const { batchId, truckId, geo, speed } = req.body;
    const prev = await WasteEvent.findOne({ batch: batchId }).sort({ createdAt: -1 });
    const signed = signEvent({ payload: { geo, speed }, prevHash: prev?.hash, actor: req.user._id });
    const event = await WasteEvent.create({ batch: batchId, type: "gps_ping", truck: truckId, geo, payload: { speed }, ...signed });
    io.emit("gps", { batchId, geo, event });
    res.json({ event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const publicLookup = async (req, res) => {
  const { id } = req.params;
  const batch = await WasteBatch.findOne({ batchId: id }).populate(["sourceBin", "citizen", "truck", "collector", "timeline"]);
  if (!batch) return res.status(404).json({ message: "Not found" });
  res.json(batch);
};
