import express from "express";
import {
  addDistributor,
  getDistributors,
  updateDistributor,
  deleteDistributor,
  getAllDistributors,
  getInvoicesByDistributor,
} from "../controllers/distributorController.js";
import userAuth from "../middleware/userAuth.js";
const router = express.Router();

router.get("/", userAuth, getDistributors);
router.get("/", userAuth, getAllDistributors);
router.get("/distributor/:id", userAuth, getInvoicesByDistributor);
router.post("/add", userAuth, addDistributor);
router.put("/:id", userAuth, updateDistributor);
router.delete("/:id", userAuth, deleteDistributor);

export default router;
