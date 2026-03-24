import dotenv from "dotenv";
import server from "./src/app.js";
import { connectDB } from "./src/config/db.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/tracebin");
  server.listen(PORT, () => console.log(`TraceBin backend running on port ${PORT}`));
};

start();
