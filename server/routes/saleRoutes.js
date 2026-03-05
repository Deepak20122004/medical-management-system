import express from "express";
import userAuth from "../middleware/userAuth.js";

import {
  addSale,
  getSales,
  deleteSale,
  searchPatient,
} from "../controllers/saleController.js";

const router = express.Router();

router.post("/add", userAuth, addSale);

router.get("/", userAuth, getSales);

router.delete("/:id", userAuth, deleteSale);
router.get("/search-patient", userAuth, searchPatient);

export default router;
