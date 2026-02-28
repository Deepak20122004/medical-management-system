import express from "express";
import {
  addStock,
  getAllStock,
  getStockByInvoiceNumber,
  updateMedicine,
  deleteMedicine
} from "../controllers/stockController.js";

const router = express.Router();

// Add invoice + medicines
router.post("/add", addStock);

// Get all invoices
router.get("/", getAllStock);

// Get single invoice by invoice number
router.get("/invoice/:invoiceNumber", getStockByInvoiceNumber);

// Edit medicine
router.put("/:invoiceId/medicine/:medicineId", updateMedicine);

// Delete medicine
router.delete("/:invoiceId/medicine/:medicineId", deleteMedicine);

export default router;