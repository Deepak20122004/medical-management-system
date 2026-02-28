import mongoose from "mongoose";

const distributorSchema = new mongoose.Schema(
  {
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
  },
);

const Distributor = mongoose.model("Distributor", distributorSchema);

export default Distributor;