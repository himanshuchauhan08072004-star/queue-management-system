import { Router } from "express";
import {
  listTokens,
  createToken,
  reorderToken,
  serveToken,
  cancelToken,
} from "../controllers/token.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listTokens));
router.post("/", asyncHandler(createToken));
router.patch("/reorder", asyncHandler(reorderToken));
router.patch("/serve", asyncHandler(serveToken));
router.patch("/cancel", asyncHandler(cancelToken));

export default router;
