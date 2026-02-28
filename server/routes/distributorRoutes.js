import express from "express";
import {
  addDistributor,
  getDistributors,
  updateDistributor,
  deleteDistributor
} from "../controllers/distributorController.js";

const router = express.Router();

router.get("/", getDistributors);
router.post("/add", addDistributor);
router.put("/:id", updateDistributor);
router.delete("/:id", deleteDistributor);

export default router;