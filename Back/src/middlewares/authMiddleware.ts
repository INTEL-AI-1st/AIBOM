import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

const verifyToken = (req: Request, res: Response, next: NextFunction, extractUser: (decoded: any) => any): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(403).json({ message: "인증 토큰이 필요합니다." });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    (req as any).user = extractUser(decoded);
    next();
  });
};

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => 
  verifyToken(req, res, next, (decoded) => decoded);

export const getUuid = (req: Request, res: Response, next: NextFunction): void => 
  verifyToken(req, res, next, (decoded) => {
    if (!decoded.uuid) return res.status(400).json({ message: "토큰에 UUID 정보가 없습니다." });
    return { uuid: decoded.uuid };
  });
