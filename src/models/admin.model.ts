import mongoose from "mongoose";
export interface IAdmin {
  cedula: string;
  username: string;
  email: string;
  password: string;
}

const adminSchema = new mongoose.Schema({
  cedula: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
