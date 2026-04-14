import express from "express";
import userAuth from "../middleware/userAuth.js";

import {
  addSale,
  getSales,
  deleteSale,
  searchPatient,
} from "../controllers/saleController.js";

const router = express.Router();

// Create a new sale record (invoice) with patient and medicine details.
// Requires authentication.
router.post("/add", userAuth, addSale);

// Retrieve sales records for the authenticated user.
// Requires authentication.
router.get("/", userAuth, getSales);

// Delete a sale record by ID.
// Requires authentication.
router.delete("/:id", userAuth, deleteSale);

// Search patients by name or phone (used in sales form autocomplete).
// Requires authentication.
router.get("/search-patient", userAuth, searchPatient);

export default router;
