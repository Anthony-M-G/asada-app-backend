import mongoose from "mongoose";
import { db_config } from "../config";
export const connectDB = async () => {
  try {
    return await mongoose.connect(db_config);
  } catch (error) {
    console.log(error);
  }
};
