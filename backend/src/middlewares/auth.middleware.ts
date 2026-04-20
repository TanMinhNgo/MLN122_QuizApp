import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { AuthRequest, JWTPayload } from '../types';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res
      .status(401)
      .json({ success: false, message: 'Chưa xác thực. Vui lòng đăng nhập.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET) as JWTPayload;
    (req as AuthRequest).user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch {
    res
      .status(401)
      .json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
};

// Middleware kiểm tra quyền host
export const requireHostRole = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const user = (req as AuthRequest).user;
  if (!user || (user.role !== 'host' && user.role !== 'admin')) {
    res
      .status(403)
      .json({
        success: false,
        message: 'Bạn không có quyền thực hiện hành động này.',
      });
    return;
  }
  next();
};
