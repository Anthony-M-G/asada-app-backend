import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT || 3000;
export const db_config: string = process.env.DB_STRING || "";
export const jwt_secret: string = process.env.SECRET_KEY || "";
