import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("MongoDB connected successfully...");
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};
