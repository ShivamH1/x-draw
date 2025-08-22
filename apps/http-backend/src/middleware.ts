import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] ?? "";
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload & { email: string; userId: string };
    if (typeof decoded === "object" && decoded !== null && "email" in decoded && "userId" in decoded) {
      // @ts-ignore - extending Request interface
      req.userId = decoded.userId;
      // @ts-ignore - extending Request interface  
      req.userEmail = decoded.email;
      next();
    } else {
      res.status(403).json({ message: "Invalid token format" });
    }
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
}
