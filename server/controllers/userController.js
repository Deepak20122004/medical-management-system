import userModel from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

export const getUserData = async (req, res) => {
  try {
    // const {userId} = req.body;
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
        profilePic: user.profilePic || null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const uploadProfilePic = async (req, res) => {
  try {
    console.log("User ID:", req.userId);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingUser = await userModel.findById(req.userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      { folder: "profiles" }
    );

    existingUser.profilePic = result.secure_url;

    await existingUser.save();

    res.json({
      success: true,
      profile: existingUser.profilePic,
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    res.status(500).json({ message: "Profile upload failed" });
  }
};
