import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  medicine: {
    type: String,
    required: true
  },

  batch: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  exp: {
    type: Date,
    required: true
  }
});

const saleSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  patient: {
    type: String,
    required: true
  },

  doctor: {
    type: String,
    required: true
  },

  mobile: Number,

  date: {
    type: Date,
    required: true
  },

  medicines: [medicineSchema],

  totalAmount: Number,
  discount: Number,
  grandTotal: Number
},
{ timestamps: true }
);

export default mongoose.model("Sale", saleSchema);