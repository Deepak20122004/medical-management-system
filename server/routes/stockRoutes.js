import express from "express";
import {
  addStock,
  getAllStock,
  getStockByInvoiceNumber,
  updateInvoice,
  deleteInvoice,
  updateMedicine,
  deleteMedicine,
} from "../controllers/stockController.js";

const router = express.Router();

/* Invoice Routes */
router.post("/add", addStock);
router.get("/", getAllStock);
router.get("/invoice/:invoiceNumber", getStockByInvoiceNumber);
router.put("/:invoiceId", updateInvoice);
router.delete("/:invoiceId", deleteInvoice);

/* Medicine Routes */
router.put("/:invoiceId/medicine/:medicineId", updateMedicine);
router.delete("/:invoiceId/medicine/:medicineId", deleteMedicine);

export default router;