import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/", userAuth, getDashboard);

export default router;
