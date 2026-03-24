import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { dashboard, auditTrail } from "../controllers/adminController.js";

const router = Router();
router.get("/dashboard", auth(["admin"]), dashboard);
router.get("/audit/:id", auth(["admin"]), auditTrail);
export default router;
