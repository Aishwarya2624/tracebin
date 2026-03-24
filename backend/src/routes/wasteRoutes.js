import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { createPickup, logGps, publicLookup } from "../controllers/wasteController.js";

const router = Router();
router.post("/pickup", auth(["collector", "admin"]), createPickup);
router.post("/gps", auth(["collector", "admin"]), logGps);
router.get("/public/:id", publicLookup);
export default router;
