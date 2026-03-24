import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri, { dbName: "tracebin" });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Mongo connection error", err.message);
    process.exit(1);
  }
};
