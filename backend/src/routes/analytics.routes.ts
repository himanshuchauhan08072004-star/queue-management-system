import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, asyncHandler(getAnalytics));

export default router;
