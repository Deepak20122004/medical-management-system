import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: true,
      trim: true,
    },
    hsn: {
      type: String,
      required: true,
    },
    batchNo: {
      type: String,
      required: true,
    },
    batchExpiry: {
      type: String, // YYYY-MM format
      required: true,
    },
    gst: {
      type: String,
      enum: ["0%", "3%", "5%", "12%", "18%", "28%"],
      default: "12%",
    },
    unitPerPack: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    free: {
      type: Number,
      default: 0,
      min: 0,
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
    },
    mrp: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

const stockSchema = new mongoose.Schema(
  {
    distributor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Distributor",
      required: true,
      trim: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    invoiceDate: {
      type: Date,
      required: true,
    },
    medicines: [medicineSchema],
  },
  { timestamps: true },
);

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;
