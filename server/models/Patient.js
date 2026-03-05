import mongoose from "mongoose";

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