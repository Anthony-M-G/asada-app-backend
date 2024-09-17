import { Admin } from "../models/admin.model";
import { IAdmin } from "../models/admin.model";
import jwt from "jsonwebtoken";
import { jwt_secret } from "../../config";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

export class AdminService {
  static login = async (req: Request, res: Response) => {
    try {
      const { username, cedula, password } = req.body;
      const userLogged = await Admin.findOne({
        username,
        cedula,
      });
      if (!userLogged) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const verifyPasswd = await bcrypt.compare(password, userLogged.password);
      if (!verifyPasswd) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        {
          cedula: userLogged.cedula,
          username: userLogged.username,
          email: userLogged.email,
        },
        jwt_secret,
        { expiresIn: "1h" }
      );

      res
        .cookie("token", token, {
           maxAge: 900000,          // 15 minutos
           httpOnly: true,          // Solo accesible por el servidor
           secure: true
           sameSite: 'lax'                // Disponible en todo el dominio
        })    
        .status(200)
        .json({ user: userLogged });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  static register = async (req: Request, res: Response) => {
    try {
      const { cedula, username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new Admin({
        cedula,
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  static logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie("token").status(200).json({ message: "Logged out" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  static verifyToken = async (req: Request, res: Response) => {
    const token: any = req.cookies.token;
    console.log("Token from cookies:", token);
    if (!token) {
      return res.status(401).json({ message: "Access denied" });
    }
    try {
      jwt.verify(token, jwt_secret, (err: any, decoded: any) => {
        if (err) {
          console.error("Token verification error:", err);
          return res.status(401).send({ message: "Unauthorized" });
        }
        console.log("Decoded token:", decoded);
        const { username } = decoded;
        return res.status(200).json({ username });
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res.status(400).json({ message: "Invalid token" });
    }
  };
}
