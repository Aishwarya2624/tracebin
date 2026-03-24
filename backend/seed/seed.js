import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import User from "../src/models/User.js";
import Bin from "../src/models/Bin.js";
import ContractorPerformance from "../src/models/ContractorPerformance.js";
import ProcessingPlant from "../src/models/ProcessingPlant.js";
import Truck from "../src/models/Truck.js";
import WasteBatch from "../src/models/WasteBatch.js";
import WasteEvent from "../src/models/WasteEvent.js";
import Alert from "../src/models/Alert.js";
import { wards, contractors, plants } from "../data/mockData.js";
import { nanoid } from "nanoid";
import { signEvent } from "../src/utils/hashChain.js";

dotenv.config();

const seed = async () => {
  await connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/tracebin");
  await Promise.all([
    User.deleteMany({}),
    Bin.deleteMany({}),
    ContractorPerformance.deleteMany({}),
    ProcessingPlant.deleteMany({}),
    Truck.deleteMany({}),
    WasteBatch.deleteMany({}),
    WasteEvent.deleteMany({}),
    Alert.deleteMany({})
  ]);

  const admin = await User.create({ name: "City Admin", email: "admin@tracebin.io", password: "admin123", role: "admin" });
  const collector = await User.create({ name: "Collector Joy", email: "collector@tracebin.io", password: "collector123", role: "collector", ward: wards[0] });
  const plantUser = await User.create({ name: "Plant Ops", email: "plant@tracebin.io", password: "plant123", role: "plant" });
  const citizen = await User.create({ name: "Aditi Citizen", email: "citizen@tracebin.io", password: "citizen123", role: "citizen", ward: wards[0] });

  const contractorDocs = await ContractorPerformance.insertMany(contractors);
  const bins = await Bin.insertMany([
    { code: "BIN-001", citizen: citizen._id, address: "12 Green St", ward: wards[0], geo: { lat: 12.97, lng: 77.59 } },
    { code: "BIN-002", citizen: citizen._id, address: "14 Lake View", ward: wards[0], geo: { lat: 12.98, lng: 77.6 } }
  ]);

  const plantDocs = await ProcessingPlant.insertMany(plants);
  const truck = await Truck.create({ plate: "KA-01-TR-1234", contractor: contractorDocs[1]._id, driver: collector._id, route: [] });

  const batch = await WasteBatch.create({
    batchId: `WB-${nanoid(6)}`,
    sourceBin: bins[0]._id,
    citizen: citizen._id,
    collector: collector._id,
    truck: truck._id,
    ward: wards[0],
    pickupWeight: 52,
    status: "in_transit",
    predictedWasteType: "mixed",
    segregationQuality: "medium"
  });

  const pickupEvent = await WasteEvent.create({
    batch: batch._id,
    type: "pickup",
    actor: collector._id,
    payload: { weight: 52, photoUrl: "https://placehold.co/200x120" },
    geo: { lat: 12.97, lng: 77.59 },
    ...signEvent({ payload: { weight: 52 }, actor: collector._id })
  });

  const gpsEvent = await WasteEvent.create({
    batch: batch._id,
    type: "gps_ping",
    truck: truck._id,
    payload: { speed: 32 },
    geo: { lat: 12.975, lng: 77.595 },
    ...signEvent({ payload: { speed: 32 }, prevHash: pickupEvent.hash, actor: collector._id })
  });

  batch.timeline.push(pickupEvent._id, gpsEvent._id);
  await batch.save();

  console.log("Seeded: users, bins, contractors, plants, truck, batch, events");
  await mongoose.disconnect();
};

seed();
