import { Request, Response } from "express";
import { IReceipt } from "../models/receipt.model";
import { Receipt } from "../models/receipt.model";
import PDFDocument from "pdfkit";

export class ReceiptsService {
  createReceipt = async ({ receipt }: { receipt: IReceipt }) => {
    try {
      const newReceipt = new Receipt(receipt);
      return await newReceipt.save();
    } catch (error) {
      console.log("Error al crear el recibo:", error);
      throw new Error("Error al crear el recibo");
    }
  };

  getReceipts = async () => {
    try {
      return await Receipt.find();
    } catch (error) {
      console.log("Error al obtener los recibos:", error);
      throw new Error("Error al obtener los recibos");
    }
  };

  getReceipt = async (cedula: string) => {
    try {
      return await Receipt.find({ cedula }).exec();
    } catch (error) {
      console.log("Error al obtener el recibo:", error);
      throw new Error("Error al obtener el recibo");
    }
  };

  updateReceiptStatus = async (id: string) => {
    try {
      const receiptUpdated = await Receipt.findOneAndUpdate(
        { _id: id },
        { isPaid: true },
        { new: true }
      ).exec();
      return receiptUpdated;
    } catch (error) {
      console.log("Error al actualizar el estado del recibo:", error);
      throw new Error("Error al actualizar el estado del recibo");
    }
  };

  generatePDF = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const receipt = await Receipt.findById(id).exec();
      if (!receipt) {
        return res.status(404).json({ message: "Receipt not found" });
      }

      const { name, cedula, celular, date, month, year, amount, isPaid } =
        receipt;
      const doc = new PDFDocument();

      // Configurar el encabezado de respuesta para el archivo PDF
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="receipt.pdf"'
      );
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
        .text(
          "El pago se debe realizar dentro de los 15 días. Gracias por su negocio.",
          50,
          700,
          { align: "center", width: 500 }
        );

      // Finalizar el PDF y cerrar el flujo de escritura
      doc.end();

      // No es necesario hacer nada adicional aquí
    } catch (error) {
      console.log("Error al generar el PDF:", error);
      // Enviar respuesta al cliente en caso de error
      if (!res.headersSent) {
        res.status(500).json({ message: "Error al generar el PDF" });
      }
    }
  };

  static updateMonthlyReceipts = async () => {
    try {
      const receipts = await Receipt.find();
      const currentDate = new Date();

      // Usar Promise.all para manejar múltiples actualizaciones
      await Promise.all(
        receipts.map(async (receipt) => {
          const date = new Date(receipt.date);
          if (currentDate.getTime() > date.getTime() && receipt.isPaid) {
            await Receipt.findOneAndUpdate(
              { _id: receipt._id },
              {
                isPaid: false,
                date: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1,
                  date.getDate()
                ),
                month: currentDate.getMonth() + 1,
              }
            ).exec();
          }
        })
      );

      console.log("Recibos actualizados correctamente.");
    } catch (error) {
      console.log("Error al actualizar los recibos:", error);
    }
  };
}
