"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptController = void 0;
const moment_1 = __importDefault(require("moment"));
class ReceiptController {
    constructor(receiptService) {
        this.receiptService = receiptService;
        this.createReceipt = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req);
                const { name, cedula, celular, isPaid, month, year, amount } = req.body;
                const receipt = yield this.receiptService.createReceipt({
                    receipt: {
                        name,
                        cedula,
                        celular,
                        isPaid,
                        month,
                        year,
                        amount,
                        date: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
                    },
                });
                res.status(201).json(receipt);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
        this.getReceipts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const receipts = yield this.receiptService.getReceipts();
                res.status(200).json(receipts);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
        this.getReceipt = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { cedula } = req.params;
                const receipt = yield this.receiptService.getReceipt(cedula);
                res.status(200).json(receipt);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
        this.updateReceiptStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const receipt = yield this.receiptService.updateReceiptStatus(id);
                res.status(200).json(receipt);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
        this.generatePDF = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const receipt = yield this.receiptService.generatePDF(req, res);
                res.status(200).json(receipt);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
        this.receiptService = receiptService;
    }
}
exports.ReceiptController = ReceiptController;
