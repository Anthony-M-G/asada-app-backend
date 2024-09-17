import { Request, Response } from "express";
import { ReceiptsService } from "../services/receipts.service";
import { IReceipt } from "../models/receipt.model";
import moment from "moment";
export class ReceiptController {
  constructor(private receiptService: ReceiptsService) {
    this.receiptService = receiptService;
  }
  createReceipt = async (req: Request, res: Response) => {
    try {
      console.log(req);
      const { name, cedula, celular, isPaid, month, year, amount }: IReceipt =
        req.body;
      const receipt = await this.receiptService.createReceipt({
        receipt: {
          name,
          cedula,
          celular,
          isPaid,
          month,
          year,
          amount,
          date: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      });
      res.status(201).json(receipt);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getReceipts = async (req: Request, res: Response) => {
    try {
      const receipts = await this.receiptService.getReceipts();
      res.status(200).json(receipts);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getReceipt = async (req: Request, res: Response) => {
    try {
      const { cedula } = req.params;
      const receipt = await this.receiptService.getReceipt(cedula);
      res.status(200).json(receipt);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  updateReceiptStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.log("id del que quiero actualizar el estado "+id);
      
      const receipt = await this.receiptService.updateReceiptStatus(id);
      res.status(200).json(receipt);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  generatePDF = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const receipt = await this.receiptService.generatePDF(req, res);
      res.status(200).json(receipt);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
