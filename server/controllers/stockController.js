import Stock from "../models/Stock.js";

/* ================= ADD STOCK ================= */

// addStock: creates a new stock/purchase invoice with medicines
// - validates distributor and invoice number, prevents duplicate invoices, stores medicine list
export const addStock = async (req, res) => {
  try {
    const { distributor, invoiceNumber, invoiceDate, medicines } = req.body;

    if (!distributor || !invoiceNumber) {
      return res.status(400).json({
        success: false,
        message: "Distributor and Invoice Number required",
      });
    }

    if (!medicines || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Add at least one medicine",
      });
    }

    if (!invoiceDate) {
      return res.status(400).json({
        success: false,
        message: "Invoice Date required",
      });
    }

    const invalidMedicine = medicines.find(
      (medicine) =>
        !medicine.product ||
        !medicine.hsn ||
        !medicine.batchNo ||
        !medicine.batchExpiry ||
        !medicine.unitPerPack ||
        medicine.quantity === "" ||
        medicine.rate === "" ||
        medicine.mrp === "",
    );

    if (invalidMedicine) {
      return res.status(400).json({
        success: false,
        message: "Complete all medicine details before saving",
      });
    }

    const exist = await Stock.findOne({
      invoiceNumber,
      user: req.userId,
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Invoice already exists",
      });
    }

    const stock = await Stock.create({
      user: req.userId,
      distributor,
      invoiceNumber,
      invoiceDate,
      medicines,
    });

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      stock,
    });
  } catch (error) {
    console.error("ADD STOCK ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Invoice number already exists. Use a different number.",
      });
    }

    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((item) => item.message)
        .join(", ");

      return res.status(400).json({
        success: false,
        message: message || "Invalid stock details",
      });
    }

    res.status(500).json({
      success: false,
      message: "Unable to save stock right now",
    });
  }
};

/* ================= GET ALL STOCK ================= */

// getAllStock: retrieves all purchase invoices for current user with distributor details
// - populates distributor name, sorts by newest first
export const getAllStock = async (req, res) => {
  try {
    const data = await Stock.find({
      user: req.userId,
    })
      .populate("distributor", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      totalInvoices: data.length,
      data,
    });
  } catch (error) {
    // console.log("GET STOCK ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET BY INVOICE NUMBER ================= */

// getStockByInvoiceNumber: retrieves a specific stock invoice by invoice number
// - returns invoice with all medicine details
export const getStockByInvoiceNumber = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;

    const invoice = await Stock.findOne({
      invoiceNumber,
      user: req.userId,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.json({
      success: true,
      totalMedicines: invoice.medicines.length,
      invoice,
    });
  } catch {
    res.status(500).json({
      success: false,
    });
  }
};

/* ================= UPDATE INVOICE ================= */

// updateInvoice: updates invoice details like distributor, invoice number, and date
// - only updates provided fields, keeps existing values if not provided
export const updateInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { distributor, invoiceNumber, invoiceDate } = req.body;

    const invoice = await Stock.findOne({
      _id: invoiceId,
      user: req.userId,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    invoice.distributor = distributor || invoice.distributor;
    invoice.invoiceNumber = invoiceNumber || invoice.invoiceNumber;
    invoice.invoiceDate = invoiceDate || invoice.invoiceDate;

    await invoice.save();

    res.json({
      success: true,
      message: "Invoice updated successfully",
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= DELETE INVOICE ================= */

// deleteInvoice: removes a complete stock invoice and all associated medicines
export const deleteInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await Stock.findOne({
      _id: invoiceId,
      user: req.userId,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    await Stock.findByIdAndDelete(invoiceId);

    res.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= UPDATE MEDICINE ================= */

// updateMedicine: modifies a specific medicine record within an invoice
// - finds medicine by ID within invoice, updates provided fields
export const updateMedicine = async (req, res) => {
  try {
    const { invoiceId, medicineId } = req.params;

    const invoice = await Stock.findOne({
      _id: invoiceId,
      user: req.userId,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const medicine = invoice.medicines.id(medicineId);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    Object.assign(medicine, req.body);

    await invoice.save();

    res.json({
      success: true,
      message: "Medicine updated successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
    });
  }
};

/* ================= DELETE MEDICINE ================= */

// deleteMedicine: removes a single medicine record from an invoice
// - filters out medicine by ID and saves updated invoice
export const deleteMedicine = async (req, res) => {
  try {
    const { invoiceId, medicineId } = req.params;

    const invoice = await Stock.findOne({
      _id: invoiceId,
      user: req.userId,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    invoice.medicines = invoice.medicines.filter(
      (med) => med._id.toString() !== medicineId,
    );

    await invoice.save();

    res.json({
      success: true,
      message: "Medicine deleted successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
    });
  }
};

/* ================= GET BY DISTRIBUTOR ================= */

// getStockByDistributor: retrieves all invoices from a specific distributor
// - returns invoices sorted by creation date, newest first
export const getStockByDistributor = async (req, res) => {
  try {
    const { distributorId } = req.params;

    const invoices = await Stock.find({
      distributor: distributorId,
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      totalInvoices: invoices.length,
      invoices,
    });
  } catch (error) {
    // console.log("DISTRIBUTOR STOCK ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// searchMedicine: searches for medicines by name across all invoices
// - uses regex for case-insensitive search, returns matching stock records
export const searchMedicine = async (req, res) => {
  try {
    const { name } = req.query;

    const stocks = await Stock.find({
      user: req.userId,
      "medicines.product": { $regex: name, $options: "i" },
    });

    res.json({
      success: true,
      data: stocks,
    });
  } catch (err) {
    // console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
