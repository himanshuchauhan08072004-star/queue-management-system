import { Router } from "express";
import { listQueues, createQueue, updateQueue, deleteQueue } from "../controllers/queue.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.get("/", asyncHandler(listQueues));
router.post("/", asyncHandler(createQueue));
router.put("/:id", asyncHandler(updateQueue));
router.delete("/:id", asyncHandler(deleteQueue));

export default router;
