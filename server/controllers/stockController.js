import Stock from "../models/Stock.js";

/* ================= ADD STOCK ================= */

export const addStock = async (req, res) => {
  try {

    const { distributor, invoiceNumber, invoiceDate, medicines } = req.body;

    if (!distributor || !invoiceNumber) {
      return res.status(400).json({
        success:false,
        message:"Distributor and Invoice Number required"
      });
    }

    if (!medicines || medicines.length === 0) {
      return res.status(400).json({
        success:false,
        message:"Add at least one medicine"
      });
    }

    const exist = await Stock.findOne({
      invoiceNumber,
      user:req.userId
    });

    if (exist) {
      return res.status(400).json({
        success:false,
        message:"Invoice already exists"
      });
    }

    const stock = await Stock.create({
      user:req.userId,
      distributor,
      invoiceNumber,
      invoiceDate,
      medicines
    });

    res.status(201).json({
      success:true,
      message:"Invoice created successfully",
      stock
    });

  } catch (error) {

    console.log("ADD STOCK ERROR:",error);

    res.status(500).json({
      success:false,
      message:"Server error"
    });

  }
};



/* ================= GET ALL STOCK ================= */

export const getAllStock = async (req,res)=>{

  try{

    const data = await Stock.find({
      user:req.userId
    })
    .populate("distributor","name")
    .sort({createdAt:-1})

    res.json({
      success:true,
      totalInvoices:data.length,
      data
    })

  }catch(error){

    console.log("GET STOCK ERROR:",error)

    res.status(500).json({
      success:false,
      message:"Server error"
    })

  }

};



/* ================= GET BY INVOICE NUMBER ================= */

export const getStockByInvoiceNumber = async (req,res)=>{

  try{

    const {invoiceNumber} = req.params

    const invoice = await Stock.findOne({
      invoiceNumber,
      user:req.userId
    })

    if(!invoice){

      return res.status(404).json({
        success:false,
        message:"Invoice not found"
      })

    }

    res.json({
      success:true,
      totalMedicines:invoice.medicines.length,
      invoice
    })

  }catch{

    res.status(500).json({
      success:false
    })

  }

};



/* ================= UPDATE INVOICE ================= */

export const updateInvoice = async (req,res)=>{

  try{

    const {invoiceId} = req.params
    const { distributor, invoiceNumber, invoiceDate } = req.body

    const invoice = await Stock.findOne({
      _id:invoiceId,
      user:req.userId
    })

    if(!invoice){

      return res.status(404).json({
        success:false,
        message:"Invoice not found"
      })

    }

    invoice.distributor = distributor || invoice.distributor
    invoice.invoiceNumber = invoiceNumber || invoice.invoiceNumber
    invoice.invoiceDate = invoiceDate || invoice.invoiceDate

    await invoice.save()

    res.json({
      success:true,
      message:"Invoice updated successfully",
      invoice
    })

  }catch(error){

    res.status(500).json({
      success:false,
      message:"Server error"
    })

  }

};



/* ================= DELETE INVOICE ================= */

export const deleteInvoice = async (req,res)=>{

  try{

    const {invoiceId} = req.params

    const invoice = await Stock.findOne({
      _id:invoiceId,
      user:req.userId
    })

    if(!invoice){

      return res.status(404).json({
        success:false,
        message:"Invoice not found"
      })

    }

    await Stock.findByIdAndDelete(invoiceId)

    res.json({
      success:true,
      message:"Invoice deleted successfully"
    })

  }catch{

    res.status(500).json({
      success:false,
      message:"Server error"
    })

  }

};



/* ================= UPDATE MEDICINE ================= */

export const updateMedicine = async (req,res)=>{

  try{

    const {invoiceId,medicineId} = req.params

    const invoice = await Stock.findOne({
      _id:invoiceId,
      user:req.userId
    })

    if(!invoice){

      return res.status(404).json({
        success:false,
        message:"Invoice not found"
      })

    }

    const medicine = invoice.medicines.id(medicineId)

    if(!medicine){

      return res.status(404).json({
        success:false,
        message:"Medicine not found"
      })

    }

    Object.assign(medicine,req.body)

    await invoice.save()

    res.json({
      success:true,
      message:"Medicine updated successfully"
    })

  }catch{

    res.status(500).json({
      success:false
    })

  }

};



/* ================= DELETE MEDICINE ================= */

export const deleteMedicine = async (req,res)=>{

  try{

    const {invoiceId,medicineId} = req.params

    const invoice = await Stock.findOne({
      _id:invoiceId,
      user:req.userId
    })

    if(!invoice){

      return res.status(404).json({
        success:false,
        message:"Invoice not found"
      })

    }

    invoice.medicines = invoice.medicines.filter(
      med => med._id.toString() !== medicineId
    )

    await invoice.save()

    res.json({
      success:true,
      message:"Medicine deleted successfully"
    })

  }catch{

    res.status(500).json({
      success:false
    })

  }

};



/* ================= GET BY DISTRIBUTOR ================= */

export const getStockByDistributor = async (req,res)=>{

  try{

    const { distributorId } = req.params

    const invoices = await Stock.find({
      distributor:distributorId,
      user:req.userId
    })
    .sort({createdAt:-1})

    res.json({
      success:true,
      totalInvoices:invoices.length,
      invoices
    })

  }catch(error){

    console.log("DISTRIBUTOR STOCK ERROR:",error)

    res.status(500).json({
      success:false,
      message:"Server error"
    })

  }

};