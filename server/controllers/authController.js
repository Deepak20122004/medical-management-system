import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // sending wellcome email.

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to our Medical Management System",
      text: `Hello ${name},\n\nWelcome to our Medical Management System! You have successfully registered with the email: ${email}.\n\nThank you for joining us!\n\nBest regards,\nMedical Management System Team`,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error in register controller:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Error in logout controller:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// send verification otp to user email for account verification
export const sendVerifyOtp = async (req, res) => {
  try {
    console.log("sendVerifyOtp controller called with userId:",  req.body);
    const { userId } = req.body;
    console.log("userId in sendVerifyOtp controller:", userId);
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.isAccountVerified) {
      return res
        .status(404)
        .json({ success: false, message: "Account is already verified" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyotp = otp;
    user.verifyotpExpiryAt = Date.now() + 10 * 60 * 1000;
    await user.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify your account",
      text: `Hello ${user.name},\n\nYour verification OTP is: ${otp}\n\nPlease use this OTP to verify your account.\n\nThank you!\nMedical Management System Team`,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ success: true, message: "Verification OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error when otp send " });
  }
};

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "missing userId or otp" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.verifyotp !== otp  || user.verifyotp === "") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    if (Date.now() > user.verifyotpExpiryAt) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    user.isAccountVerified = true;
    user.verifyotp = "";
    user.verifyotpExpiryAt = 0;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Error in verifyEmail controller:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

