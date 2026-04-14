import Distributor from "../models/Distributor.js";
import Stock from "../models/Stock.js";

/* ================= ADD DISTRIBUTOR ================= */

// addDistributor: creates new distributor record with validation
// - checks required fields, prevents duplicate license, creates database entry
export const addDistributor = async (req, res) => {
  try {
    // console.log("USER ID:", req.userId);
    const { name, mobile, gstin, district, licence } = req.body;

    // validation
    if (!name || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Name and Mobile are required",
      });
    }

    // check duplicate distributor for same user
    const exist = await Distributor.findOne({
      licence,
      user: req.userId,
    });

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Distributor already exists",
      });
    }

    const distributor = await Distributor.create({
      user: req.userId,
      name,
      mobile,
      gstin,
      district,
      licence,
    });

    res.status(201).json({
      success: true,
      message: "Distributor added successfully",
      distributor,
    });
  } catch (error) {
    // console.log("ADD DISTRIBUTOR ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET ALL DISTRIBUTORS ================= */

// getDistributors: retrieves all distributors for current user sorted by creation date (newest first)
export const getDistributors = async (req, res) => {
  try {
    const data = await Distributor.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error) {
    // console.log("GET DISTRIBUTOR ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET DISTRIBUTORS (NAME SORT) ================= */

// getAllDistributors: retrieves all distributors for current user sorted alphabetically by name
export const getAllDistributors = async (req, res) => {
  try {
    const distributors = await Distributor.find({
      user: req.userId,
    }).sort({ name: 1 });

    res.json({
      success: true,
      total: distributors.length,
      data: distributors,
    });
  } catch (error) {
    console.log("GET ALL DISTRIBUTORS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET INVOICES BY DISTRIBUTOR ================= */

// getInvoicesByDistributor: retrieves all stock/purchase invoices associated with a specific distributor
// - returns invoices sorted by creation date, includes distributor name populated
export const getInvoicesByDistributor = async (req, res) => {
  try {
    const { id } = req.params;

    const invoices = await Stock.find({
      distributor: id,
      user: req.userId, //  security filter
    })
      .sort({ createdAt: -1 })
      .populate("distributor", "name");

    res.json({
      success: true,
      totalInvoices: invoices.length,
      invoices,
    });
  } catch (error) {
    // console.log("GET INVOICE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= UPDATE DISTRIBUTOR ================= */

// updateDistributor: updates distributor details for specified distributor ID
// - security: ensures user can only update their own distributors
export const updateDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId, // user security
      },
      req.body,
      { new: true },
    );

    if (!distributor) {
      return res.status(404).json({
        success: false,
        message: "Distributor not found",
      });
    }

    res.json({
      success: true,
      message: "Updated successfully",
      distributor,
    });
  } catch (error) {
    // console.log("UPDATE DISTRIBUTOR ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= DELETE DISTRIBUTOR ================= */

// deleteDistributor: deletes a distributor record by ID
// - security: ensures user can only delete their own distributors
export const deleteDistributor = async (req, res) => {
  try {
    const distributor = await Distributor.findOneAndDelete({
      _id: req.params.id,
      user: req.userId, 
    });

    if (!distributor) {
      return res.status(404).json({
        success: false,
        message: "Distributor not found",
      });
    }

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    // console.log("DELETE DISTRIBUTOR ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
