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
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const receipts_router_1 = __importDefault(require("./routes/receipts.router"));
const admin_router_1 = __importDefault(require("./routes/admin.router"));
const validateToken_middleware_1 = require("./middlewares/validateToken.middleware");
const cors_1 = __importDefault(require("cors"));
const node_cron_1 = __importDefault(require("node-cron"));
const receipts_service_1 = require("./services/receipts.service");
const app = (0, express_1.default)();
// Configuración de CORS
app.use((0, cors_1.default)({
    origin: "https://asada-app-frontend.vercel.app", // O '*' para permitir todos los orígenes
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
}));
// Middlewares
app.use(express_1.default.json()); // Manejar JSON automáticamente
app.use((0, cookie_parser_1.default)()); // Middleware para parsear cookies
app.use((0, morgan_1.default)("dev")); // Middleware para logging
// Rutas
app.use("/receipts", validateToken_middleware_1.validateToken, receipts_router_1.default);
app.use("/admin", admin_router_1.default);
// Cron job
node_cron_1.default.schedule("0 0 5 * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Running cron job");
    const res = yield receipts_service_1.ReceiptsService.updateMonthlyReceipts();
    console.log(res);
}));
exports.default = app;
