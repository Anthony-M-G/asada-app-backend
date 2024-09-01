"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Receipt = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const receiptSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    cedula: { type: String, required: true },
    celular: { type: String, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    month: { type: String, required: true },
    year: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
});
exports.Receipt = mongoose_1.default.model("Receipt", receiptSchema, "receipts");
