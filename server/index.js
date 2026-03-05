import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/usreRoutes.js";
import distributorRoutes from "./routes/distributorRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import saleRoutes from "./routes/saleRoutes.js";

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://medical-management-system-v1zh.onrender.com",
];

app.use(express.json());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    // methods: ["GET", "POST", "PUT", "DELETE"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  }),
);
app.use(cookieParser());
// API endpoints

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/distributor", distributorRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/sale", saleRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
