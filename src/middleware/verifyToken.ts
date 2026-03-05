import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_TOKEN as string);
      next();
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}
