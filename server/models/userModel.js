import mongoose from "mongoose";

// User model schema
// - Stores authentication and profile information for each registered user
// Fields:
// - name, email, password: basic account credentials
// - verifyotp, verifyotpExpiryAt: 6-digit OTP and expiry timestamp for email verification
// - isAccountVerified: boolean flag indicating whether the email is verified
// - resetOtp, resetOtpExpiryAt: OTP and expiry timestamp for password reset flow
// - profilePic: URL to uploaded profile image (Cloudinary or similar)
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

// Use existing compiled model if available (prevents OverwriteModelError in watch mode)
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
