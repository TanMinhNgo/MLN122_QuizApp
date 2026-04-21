import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthRequest } from '../types';
import { ENV } from '../config/env';

export const registerSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự.').max(50),
  email: z.string().email('Địa chỉ email không hợp lệ.'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
});

export const loginSchema = z.object({
  email: z.string().email('Địa chỉ email không hợp lệ.'),
  password: z.string().min(1, 'Mật khẩu không được để trống.'),
});

export const authController = {
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, email, password } = req.body as z.infer<
        typeof registerSchema
      >;
      const result = await authService.register(name, email, password);

      // Lưu refresh token trong httpOnly cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      });

      sendCreated(
        res,
        { user: result.user, accessToken: result.tokens.accessToken },
        'Đăng ký thành công.',
      );
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body as z.infer<typeof loginSchema>;
      const result = await authService.login(email, password);

      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(
        res,
        { user: result.user, accessToken: result.tokens.accessToken },
        'Đăng nhập thành công.',
      );
    } catch (err) {
      next(err);
    }
  },

  async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('refreshToken');
    sendSuccess(res, null, 'Đăng xuất thành công.');
  },

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as AuthRequest).user!.id;
      const user = await authService.getProfile(userId);
      sendSuccess(res, user, 'Lấy thông tin thành công.');
    } catch (err) {
      next(err);
    }
  },

  async refresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const token = req.cookies?.refreshToken as string | undefined;
      if (!token) {
        res
          .status(401)
          .json({ success: false, message: 'Không tìm thấy refresh token.' });
        return;
      }

      const tokens = await authService.refreshToken(token);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(
        res,
        { accessToken: tokens.accessToken },
        'Làm mới token thành công.',
      );
    } catch (err) {
      next(err);
    }
  },
};
