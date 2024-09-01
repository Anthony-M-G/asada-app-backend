import express from "express";
import { port } from "../config";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import router from "./routes/receipts.router";
import adminRouter from "./routes/admin.router";
import { validateToken } from "./middlewares/validateToken.middleware";
import cors from "cors";
import cron from "node-cron";
import { ReceiptsService } from "./services/receipts.service";

const app = express();
//cors
app.use(
  cors({
    origin: "https://asada-app-frontend.vercel.app", // O '*' para permitir todos los orígenes
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
  })
);

// Middlewares
app.use(express.json()); // Manejar JSON automáticamente

app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/receipts", validateToken, router);
app.use("/admin", adminRouter);

// cron
cron.schedule("0 0 5 * *", async () => {
  console.log("Running cron job");
  const res = await ReceiptsService.updateMonthlyReceipts();
  console.log(res);
});

export default app;
