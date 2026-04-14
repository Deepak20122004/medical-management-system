import Stock from "../models/Stock.js";
import Sale from "../models/Sale.js";
import Patient from "../models/Patient.js";
import Distributor from "../models/Distributor.js";



// getDashboard: aggregates statistics for admin dashboard
// - counts purchases, sales, suppliers, customers, total medicines in stock
// - identifies low stock items (quantity < 5) and expired medicines
// - returns all dashboard metrics for display
export const getDashboard = async (req, res) => {
  try {
    const purchase = await Stock.countDocuments({ user: req.userId });

    const sale = await Sale.countDocuments({ user: req.userId });

    const suppliers = await Distributor.countDocuments({ user: req.userId });

    const customers = await Patient.countDocuments({ user: req.userId });

    const stocks = await Stock.find({ user: req.userId });

    let stock = 0;
    let lowStock = 0;
    let expired = 0;

    const today = new Date();

    stocks.forEach((s) => {
      s.medicines.forEach((m) => {
        stock += Number(m.quantity);

        if (m.quantity < 5) lowStock++;

        if (new Date(m.batchExpiry) < today) expired++;
      });
    });

    res.json({
      success: true,
      data: {
        purchase,
        sale,
        stock,
        suppliers,
        customers,
        lowStock,
        expired,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
