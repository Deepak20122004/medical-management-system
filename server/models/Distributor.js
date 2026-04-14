import mongoose from "mongoose";

// Distributor model: stores supplier/distributor details for a user
// Fields: gstin, district, name, mobile, licence and a reference to owning user
const distributorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  gstin: {
    type: String,
    required: true,
    unique: true,
  },
  district: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  licence: {
    type: String,
    required: true,
  },
});

const Distributor = mongoose.model("Distributor", distributorSchema);

export default Distributor;
