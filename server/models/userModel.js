import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyotp: { type: String, default: "" },
  verifyotpExpiryAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpiryAt: { type: Number, default: 0 },
  profilePic: {
    type: String,
    default: "",
  },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
