import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "mern-auth",
    });

    console.log("MongoDB connected successfully to mern-auth");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
export default connectDB;
