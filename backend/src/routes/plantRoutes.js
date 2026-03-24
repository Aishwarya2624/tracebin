import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { recordPlantWeight, closeProcessing } from "../controllers/plantController.js";

const router = Router();
router.post("/weight", auth(["plant", "admin"]), recordPlantWeight);
router.post("/close", auth(["plant", "admin"]), closeProcessing);
export default router;
