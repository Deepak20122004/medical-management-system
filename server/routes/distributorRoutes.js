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

// NOTE: There are two GET '/' handlers here in the original file. Keeping both
// comments but this may be a duplicate route — consider removing one.

// Get paginated or filtered distributors for the authenticated user.
// Requires authentication.
router.get("/", userAuth, getDistributors);

// Get all distributors for the authenticated user (no pagination).
// Requires authentication.
router.get("/", userAuth, getAllDistributors);

// Get all invoices associated with a single distributor by ID.
// Requires authentication.
router.get("/distributor/:id", userAuth, getInvoicesByDistributor);

// Add a new distributor record.
// Requires authentication.
router.post("/add", userAuth, addDistributor);

// Update distributor details by ID.
// Requires authentication.
router.put("/:id", userAuth, updateDistributor);

// Delete a distributor by ID.
// Requires authentication.
router.delete("/:id", userAuth, deleteDistributor);

export default router;
