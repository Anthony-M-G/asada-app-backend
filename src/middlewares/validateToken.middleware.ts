import jwt from "jsonwebtoken";
import { jwt_secret } from "../../config";
import { Request, Response, NextFunction } from "express";

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: any = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }
  try {
    const decoded = jwt.verify(token, jwt_secret, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      next();
    });
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};
