import jwt from "jsonwebtoken";
import { jwt_secret } from "../../config";
import { Request, Response, NextFunction } from "express";
import { set } from "mongoose";

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  setTimeout(() => {
    console.log(req.cookies);
  }, 2000);

  const token: string | undefined | null = req.cookies?.token;
  console.log(token);

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    jwt.verify(token, jwt_secret, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized" });
      }
      console.log(decoded);
      next();
    });
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
