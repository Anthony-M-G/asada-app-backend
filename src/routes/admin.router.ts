import { Router } from "express";

import { AdminService } from "../services/admin.service";

const adminRouter = Router();

adminRouter.post("/login", AdminService.login);
adminRouter.post("/register", AdminService.register);
adminRouter.get("/logout", AdminService.logout);
adminRouter.post("/verify-token", AdminService.verifyToken);

export default adminRouter;
