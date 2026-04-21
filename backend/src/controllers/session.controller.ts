import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { sessionService } from '../services/session.service';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthRequest } from '../types';

export const createSessionSchema = z.object({
  quizId: z.string().min(1, 'ID bộ câu hỏi không được để trống.'),
});

export const sessionController = {
  async createSession(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const hostId = (req as AuthRequest).user!.id;
      const { quizId } = req.body as z.infer<typeof createSessionSchema>;
      const result = await sessionService.createSession(hostId, quizId);
      sendCreated(res, result, 'Tạo phòng chơi thành công.');
    } catch (err) {
      next(err);
    }
  },

  async getSessionByPin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const pin = req.params['pin'] as string;
      const session = await sessionService.getSessionByPin(pin);
      sendSuccess(res, session, 'Lấy thông tin phòng chơi thành công.');
    } catch (err) {
      next(err);
    }
  },

  async getSessionResults(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const hostId = (req as AuthRequest).user!.id;
      const id = req.params['id'] as string;
      const results = await sessionService.getSessionResults(id, hostId);
      sendSuccess(res, results, 'Lấy kết quả phiên chơi thành công.');
    } catch (err) {
      next(err);
    }
  },
};
