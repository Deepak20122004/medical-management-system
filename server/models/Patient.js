import mongoose from "mongoose";

// Patient model: stores basic patient info for a user
// - `name` and optional `mobile`; linked to the owning user account
const patientSchema = new mongoose.Schema(
{
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  name:{
    type:String,
    required:true
  },

  mobile:String
},
{timestamps:true}
)

export default mongoose.model("Patient",patientSchema)