import express from "express";
import {
  addStock,
  getAllStock,
  getStockByInvoiceNumber,
  getStockByDistributor,
  updateInvoice,
  deleteInvoice,
  updateMedicine,
  deleteMedicine,
} from "../controllers/stockController.js";
import userAuth from "../middleware/userAuth.js"

const router = express.Router();

/* Invoice Routes */
router.post("/add", userAuth, addStock);
router.get("/", userAuth, getAllStock);
router.get("/invoice/:invoiceNumber",userAuth,  getStockByInvoiceNumber);
// invoices for a distributor
router.get("/distributor/:distributorId",userAuth, getStockByDistributor);
router.put("/:invoiceId", userAuth, updateInvoice);
router.delete("/:invoiceId",userAuth, deleteInvoice);

/* Medicine Routes */
router.put("/:invoiceId/medicine/:medicineId",userAuth, updateMedicine);
router.delete("/:invoiceId/medicine/:medicineId",userAuth, deleteMedicine);

export default router;