import express from "express";
import userAuth from "../middleware/userAuth.js";
import upload from "../middleware/upload.js";
import { uploadProfilePic } from "../controllers/userController.js";
import { getUserData } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);
userRouter.post(
  "/upload-profile",

  userAuth,
  upload.single("profile"),
  uploadProfilePic,
);

export default userRouter;
