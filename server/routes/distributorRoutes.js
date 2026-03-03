import express from "express";
import {
  addDistributor,
  getDistributors,
  updateDistributor,
  deleteDistributor,
  getAllDistributors,
  getInvoicesByDistributor,
} from "../controllers/distributorController.js";

const router = express.Router();

router.get("/", getDistributors);
router.get("/", getAllDistributors);
router.get("/distributor/:id", getInvoicesByDistributor);
router.post("/add", addDistributor);
router.put("/:id", updateDistributor);
router.delete("/:id", deleteDistributor);

export default router;
