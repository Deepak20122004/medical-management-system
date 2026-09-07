import express from "express";
import {

  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
    isAuthenticated,
    sendResetPasswordOtp,
    resetPassword,

} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";
const authRouter = express.Router();

// Register a new user. Expects user details (name, email, password) in the body.
// No authentication required.
authRouter.post("/register", register);

// Authenticate user and establish a session (e.g., set JWT cookie).
// No authentication required.
authRouter.post("/login", login);

// Logout the authenticated user and clear session/cookie.
// Requires authentication.
authRouter.post("/logout", userAuth, logout);

// Generate and send an email verification OTP for the authenticated user.
// Requires authentication.
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);

// Verify user's account using the OTP previously sent.
// Requires authentication.
authRouter.post("/verify-account", userAuth, verifyEmail);

// Check authentication status for current session.
// Returns success=false when no valid auth cookie exists.
authRouter.get("/is-auth", isAuthenticated);

// Send password-reset OTP to the provided email address.
// No authentication required.
authRouter.post("/send-reset-otp", sendResetPasswordOtp);

// Reset password using OTP and new password in the request body.
// No authentication required.
authRouter.post("/reset-password", resetPassword);

export default authRouter;
