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
exports.AdminService = void 0;
const admin_model_1 = require("../models/admin.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AdminService {
}
exports.AdminService = AdminService;
_a = AdminService;
AdminService.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, cedula, password } = req.body;
        const userLogged = yield admin_model_1.Admin.findOne({
            username,
            cedula,
        });
        if (!userLogged) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const verifyPasswd = yield bcryptjs_1.default.compare(password, userLogged.password);
        if (!verifyPasswd) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({
            cedula: userLogged.cedula,
            username: userLogged.username,
            email: userLogged.email,
        }, config_1.jwt_secret, { expiresIn: "1h" });
        res
            .cookie("token", token, {
            httpOnly: false, // No permite acceso del lado del cliente
            secure: true, // Usa 'true' solo si estás usando HTTPS
            sameSite: "none",
            path: "/",
            domain: "https://asada-app-frontend.vercel.app",
            maxAge: 3600000, // Tiempo de vida de la cookie en milisegundos
        })
            .status(200)
            .json({ user: userLogged });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
AdminService.register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cedula, username, email, password } = req.body;
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new admin_model_1.Admin({
            cedula,
            username,
            email,
            password: hashedPassword,
        });
        yield newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
AdminService.logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token").status(200).json({ message: "Logged out" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
AdminService.verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    console.log("Token from cookies:", token);
    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }
    try {
        jsonwebtoken_1.default.verify(token, config_1.jwt_secret, (err, decoded) => {
            if (err) {
                console.error("Token verification error:", err);
                return res.status(401).send({ message: "Unauthorized" });
            }
            console.log("Decoded token:", decoded);
            const { username } = decoded;
            return res.status(200).json({ username });
        });
    }
    catch (error) {
        console.error("Unexpected error:", error);
        return res.status(400).json({ message: "Invalid token" });
    }
});
