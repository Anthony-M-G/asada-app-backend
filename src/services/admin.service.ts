import { Admin } from "../models/admin.model";
import { IAdmin } from "../models/admin.model";
import jwt from "jsonwebtoken";
import { jwt_secret } from "../../config";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

export class AdminService {
  static login = async (req: Request, res: any) => {
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
          password: userLogged.password,
        },
        jwt_secret,
        { expiresIn: "1h" }
      );

      res
        .cookie("token", token, {
          httpOnly: true, // Asegura que la cookie no sea accesible desde JavaScript del lado del cliente
          secure: true, // Solo se transmitirá en conexiones HTTPS
          sameSite: "none", //
          maxAge: 24 * 60 * 60 * 1000, // Tiempo de vida de la cookie (aquí, 24 horas)
        })
        .status(200)
        .send(userLogged);
    } catch (error) {
      console.log(error);
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
    if (!token) {
      return res.status(401).json({ message: "Access denied" });
    }
    try {
      const decoded = jwt.verify(
        token,
        jwt_secret,
        (err: any, decoded: any) => {
          if (err) {
            return res.status(401).send({ message: "Unauthorized" });
          }
          const { cedula, username, email, password } = decoded;
          return res.status(200).json({ username });
        }
      );
    } catch (error) {
      return res.status(400).json({ message: "Invalid token" });
    }
  };
}
