import { Router } from "express";

import { ReceiptController } from "../controllers/receipts.controller";
import { ReceiptsService } from "../services/receipts.service";
const receiptsRouter = Router();
const receiptService = new ReceiptsService();
const receiptController = new ReceiptController(receiptService);

receiptsRouter.post("/", receiptController.createReceipt);
receiptsRouter.get("/", receiptController.getReceipts);
receiptsRouter.get("/:cedula", receiptController.getReceipt);
receiptsRouter.get("/pdf/:id", receiptService.generatePDF);
receiptsRouter.patch("/:id", receiptController.updateReceiptStatus);

export default receiptsRouter;
