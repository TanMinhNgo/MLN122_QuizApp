// Player controller — Chức năng chính của người chơi được xử lý qua Socket.io.
// File này dành cho các API REST bổ sung nếu cần sau này.

import { Request, Response, NextFunction } from 'express';
import { Session } from '../models/Session.model';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middlewares/error.middleware';

export const playerController = {
  // Lấy danh sách người chơi trong phòng theo PIN
  async getPlayers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const session = await Session.findOne({ pin: req.params.pin }).select(
        'players status',
      );
      if (!session) {
        throw new AppError('Phòng chơi không tồn tại.', 404);
      }
      sendSuccess(
        res,
        { players: session.players, status: session.status },
        'Lấy danh sách người chơi thành công.',
      );
    } catch (err) {
      next(err);
    }
  },
};
