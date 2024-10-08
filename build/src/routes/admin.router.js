"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_service_1 = require("../services/admin.service");
const adminRouter = (0, express_1.Router)();
adminRouter.post("/login", admin_service_1.AdminService.login);
adminRouter.post("/register", admin_service_1.AdminService.register);
adminRouter.get("/logout", admin_service_1.AdminService.logout);
adminRouter.post("/verify-token", admin_service_1.AdminService.verifyToken);
exports.default = adminRouter;
