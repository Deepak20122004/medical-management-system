import Sale from "../models/Sale.js";
import Patient from "../models/Patient.js";


export const addSale = async (req, res) => {
  try {
    const { patient, doctor, mobile, date, medicines, discount } = req.body;

    if (!patient || !doctor) {
      return res.status(400).json({
        success: false,
        message: "Patient and Doctor required",
      });
    }

    if (!medicines || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Add at least one medicine",
      });
    }

    const totalAmount = medicines.reduce(
      (sum, m) => sum + Number(m.amount || 0),
      0,
    );

    const discountAmount = Math.round(totalAmount * (discount / 100));

    const grandTotal = totalAmount - discountAmount;

    const sale = await Sale.create({
      user: req.userId,

      patient,
      doctor,
      mobile,
      date,

      medicines,

      totalAmount,
      discount,
      grandTotal,
    });

    await Patient.updateOne(
      { name: patient, user: req.userId },

      {
        name: patient,
        mobile,
      },

      { upsert: true },
    );

    res.status(201).json({
      success: true,
      message: "Sale saved",
      sale,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET SALES ================= */

export const getSales = async (req, res) => {
  try {
    const data = await Sale.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data,
    });
  } catch {
    res.status(500).json({ success: false });
  }
};

/* ================= DELETE SALE ================= */

export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch {
    res.status(500).json({ success: false });
  }
};

/* ========= SEARCH PATIENT ========= */

export const searchPatient = async (req, res) => {
  try {
    const { name } = req.query;

    const patients = await Patient.find({
      user: req.userId,

      name: {
        $regex: name,
        $options: "i",
      },
    }).limit(5);

    res.json({
      success: true,
      data: patients,
    });
  } catch {
    res.status(500).json({ success: false });
  }
};
