import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] ?? "";
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & { email: string };
  if (typeof decoded === "object" && decoded !== null && "email" in decoded) {
    req.body.email = decoded.email;
    next();
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
}
