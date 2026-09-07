import express from "express";
import userAuth from "../middleware/userAuth.js";
import upload from "../middleware/upload.js";
import { uploadProfilePic } from "../controllers/userController.js";
import { getUserData } from "../controllers/userController.js";

const userRouter = express.Router();

// Retrieve authenticated user's data (profile and settings).
// Requires authentication.
userRouter.get("/data", userAuth, getUserData);

// Upload or update user's profile picture. Uses multipart form-data with
// 'profile' file field. Requires authentication.
userRouter.post(
  "/upload-profile",
  userAuth,
  upload.single("profile"),
  uploadProfilePic,
);

export default userRouter;
