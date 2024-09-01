import mongoose from "mongoose";

export interface IReceipt {
  name: string;
  cedula: string;
  celular: string;
  isPaid: boolean;
  month: string;
  year: string;
  amount: number;
  date: Date | string;
}

const receiptSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cedula: { type: String, required: true },
  celular: { type: String, required: true },
  isPaid: { type: Boolean, required: true, default: false },
  month: { type: String, required: true },
  year: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

export const Receipt = mongoose.model<IReceipt>(
  "Receipt",
  receiptSchema,
  "receipts"
);
