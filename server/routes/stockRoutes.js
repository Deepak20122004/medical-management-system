import express from "express";
import {
  addStock,
  getAllStock,
  getStockByInvoiceNumber,
  getStockByDistributor,
  updateInvoice,
  deleteInvoice,
  searchMedicine,
  updateMedicine,
  deleteMedicine,
} from "../controllers/stockController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

/* Invoice Routes */
// Create a new stock/purchase invoice. Expects invoice and medicines in the request body.
// Requires authentication.
router.post("/add", userAuth, addStock);

// Retrieve all stock invoices for the authenticated user.
// Controller may support pagination/filters.
// Requires authentication.
router.get("/", userAuth, getAllStock);

// Retrieve a single invoice by its invoice number.
// Requires authentication.
router.get("/invoice/:invoiceNumber", userAuth, getStockByInvoiceNumber);

// Retrieve all invoices for a specific distributor (by ID).
// Requires authentication.
router.get("/distributor/:distributorId", userAuth, getStockByDistributor);

// Update invoice-level fields (distributor, invoice number, date) by invoice ID.
// Requires authentication.
router.put("/:invoiceId", userAuth, updateInvoice);

// Delete a full invoice (and its medicine entries) by invoice ID.
// Requires authentication.
router.delete("/:invoiceId", userAuth, deleteInvoice);

/* Medicine Routes */
// Search medicines across all invoices/stock entries using query params (e.g., ?name=xyz).
// Requires authentication.
router.get("/search", userAuth, searchMedicine);

// Update a specific medicine record inside an invoice. Expects updated fields in body.
// Requires authentication.
router.put("/:invoiceId/medicine/:medicineId", userAuth, updateMedicine);

// Delete a specific medicine entry from an invoice.
// Requires authentication.
router.delete("/:invoiceId/medicine/:medicineId", userAuth, deleteMedicine);

export default router;
