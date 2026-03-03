import Distributor from "../models/Distributor.js";

/* ADD */
export const addDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.create(req.body);
    res
      .status(201)
      .json({ success: true, message: "Distributor Added", distributor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/* GET ALL */
export const getDistributors = async (req, res) => {
  const data = await Distributor.find().sort({ createdAt: -1 });
  res.json({ success: true, data });
};

/* ======getAllDistributors ======*/
export const getAllDistributors = async (req, res) => {
  try {
    const distributors = await Distributor.find().sort({ name: 1 });

    res.json({
      success: true,
      data: distributors,
    });
  } catch {
    res.status(500).json({ success: false });
  }
};

/* =====  getInvoicesByDistributor ====*/
export const getInvoicesByDistributor = async (req, res) => {
  try {
    const { id } = req.params;

    const invoices = await Stock.find({ distributor: id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      totalInvoices: invoices.length,
      invoices
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* UPDATE */
export const updateDistributor = async (req, res) => {
  const updated = await Distributor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json({ success: true, message: "Updated Successfully", updated });
};

/* DELETE */
export const deleteDistributor = async (req, res) => {
  await Distributor.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Deleted Successfully" });
};
