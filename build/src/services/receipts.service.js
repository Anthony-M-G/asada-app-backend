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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptsService = void 0;
const receipt_model_1 = require("../models/receipt.model");
const pdfkit_1 = __importDefault(require("pdfkit"));
class ReceiptsService {
    constructor() {
        this.createReceipt = (_b) => __awaiter(this, [_b], void 0, function* ({ receipt }) {
            try {
                console.log(receipt);
                const newReceipt = new receipt_model_1.Receipt(receipt);
                return yield newReceipt.save();
            }
            catch (error) {
                console.log("Error al crear el recibo:", error);
                throw new Error("Error al crear el recibo");
            }
        });
        this.getReceipts = () => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield receipt_model_1.Receipt.find();
            }
            catch (error) {
                console.log("Error al obtener los recibos:", error);
                throw new Error("Error al obtener los recibos");
            }
        });
        this.getReceipt = (cedula) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield receipt_model_1.Receipt.find({ cedula }).exec();
            }
            catch (error) {
                console.log("Error al obtener el recibo:", error);
                throw new Error("Error al obtener el recibo");
            }
        });
        this.updateReceiptStatus = (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const receiptUpdated = yield receipt_model_1.Receipt.findOneAndUpdate({ _id: id }, { isPaid: true }, { new: true }).exec();
                return receiptUpdated;
            }
            catch (error) {
                console.log("Error al actualizar el estado del recibo:", error);
                throw new Error("Error al actualizar el estado del recibo");
            }
        });
        this.generatePDF = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const receipt = yield receipt_model_1.Receipt.findById(id).exec();
                console.log(receipt);
                if (!receipt) {
                    return res.status(404).json({ message: "Receipt not found" });
                }
                const { name, cedula, celular, date, month, year, amount, isPaid } = receipt;
                const doc = new pdfkit_1.default();
                // Configurar el encabezado de respuesta para el archivo PDF
                res.setHeader("Content-Disposition", 'attachment; filename="receipt.pdf"');
                res.setHeader("Content-Type", "application/pdf");
                // Pipe el PDF a la respuesta
                doc.pipe(res);
                doc
                    .fillColor("#444444")
                    .fontSize(20)
                    .text("ASADA Pochote", 110, 57)
                    .fontSize(10)
                    .text("ASADA Pochote", 200, 50, { align: "right" })
                    .text("Pochote de Nicoya", 200, 65, { align: "right" })
                    .text("Pochote, Nicoya, Costa Rica", 200, 80, { align: "right" })
                    .moveDown();
                // Información del cliente
                doc
                    .fontSize(14)
                    .text(`Factura para: ${name}`, 50, 160)
                    .fontSize(10)
                    .text(`Cédula: ${cedula}`)
                    .text(`Celular: ${celular}`)
                    .text(`Fecha: ${new Date(date).toLocaleDateString()}`)
                    .moveDown();
                // Detalles de la factura
                doc
                    .fontSize(12)
                    .text(`Factura #${id}`, 50, 250)
                    .text(`Mes: ${month}`)
                    .text(`Año: ${year}`)
                    .moveDown();
                // Tabla de facturación
                const invoiceTableTop = 330;
                doc.font("Helvetica-Bold");
                doc
                    .text("Descripción", 50, invoiceTableTop)
                    .text("Monto", 400, invoiceTableTop, { width: 90, align: "right" });
                doc
                    .strokeColor("#aaaaaa")
                    .lineWidth(1)
                    .moveTo(50, invoiceTableTop + 15)
                    .lineTo(550, invoiceTableTop + 15)
                    .stroke();
                doc.font("Helvetica");
                doc
                    .text(`Servicio ${month} ${year}`, 50, invoiceTableTop + 30)
                    .text(`${amount.toFixed(2)} colones`, 400, invoiceTableTop + 30, {
                    width: 90,
                    align: "right",
                });
                // Total
                doc.font("Helvetica-Bold");
                doc
                    .text("Total", 50, invoiceTableTop + 70)
                    .text(`${amount.toFixed(2)} colones`, 400, invoiceTableTop + 70, {
                    width: 90,
                    align: "right",
                });
                // Estado de pago
                doc
                    .font("Helvetica")
                    .fillColor(isPaid ? "green" : "red")
                    .text(isPaid ? "PAGADO" : "PENDIENTE", 460, invoiceTableTop + 100, {
                    align: "right",
                });
                // Pie de página
                doc
                    .fillColor("#444444")
                    .fontSize(10)
                    .text("El pago se debe realizar dentro de los 15 días. Gracias por su negocio.", 50, 700, { align: "center", width: 500 });
                // Finalizar el PDF y cerrar el flujo de escritura
                doc.end();
                // No es necesario hacer nada adicional aquí
            }
            catch (error) {
                console.log("Error al generar el PDF:", error);
                // Enviar respuesta al cliente en caso de error
                if (!res.headersSent) {
                    res.status(500).json({ message: "Error al generar el PDF" });
                }
            }
        });
    }
}
exports.ReceiptsService = ReceiptsService;
_a = ReceiptsService;
ReceiptsService.updateMonthlyReceipts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receipts = yield receipt_model_1.Receipt.find();
        const currentDate = new Date();
        // Usar Promise.all para manejar múltiples actualizaciones
        yield Promise.all(receipts.map((receipt) => __awaiter(void 0, void 0, void 0, function* () {
            const date = new Date(receipt.date);
            if (currentDate.getTime() > date.getTime() && receipt.isPaid) {
                yield receipt_model_1.Receipt.findOneAndUpdate({ _id: receipt._id }, {
                    isPaid: false,
                    date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, date.getDate()),
                    month: currentDate.getMonth() + 1,
                }).exec();
            }
        })));
        console.log("Recibos actualizados correctamente.");
    }
    catch (error) {
        console.log("Error al actualizar los recibos:", error);
    }
});
