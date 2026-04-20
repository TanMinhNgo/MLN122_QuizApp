import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { quizService } from '../services/quiz.service';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthRequest } from '../types';

export const createQuizSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống.').max(200),
  description: z.string().max(500).optional(),
  thumbnail: z.string().url('URL ảnh không hợp lệ.').optional(),
  isPublic: z.boolean().optional(),
});

export const questionSchema = z.object({
  content: z.string().min(1, 'Nội dung câu hỏi không được để trống.'),
  type: z.enum(['single', 'multiple', 'true_false']),
  options: z
    .array(
      z.object({
        id: z.string().min(1),
        text: z.string().min(1),
        isCorrect: z.boolean(),
        color: z
          .string()
          .regex(/^#[0-9a-fA-F]{6}$/, 'Màu sắc phải là mã hex hợp lệ.'),
      }),
    )
    .min(2, 'Câu hỏi phải có ít nhất 2 lựa chọn.'),
  timeLimit: z
    .number()
    .refine((v) => [5, 10, 20, 30, 60, 90, 120].includes(v), {
      message: 'Thời gian giới hạn không hợp lệ.',
    })
    .optional(),
  points: z
    .number()
    .refine((v) => [1000, 2000].includes(v), {
      message: 'Điểm số phải là 1000 hoặc 2000.',
    })
    .optional(),
  imageUrl: z.string().url('URL ảnh không hợp lệ.').optional(),
  order: z.number().optional(),
});

export const reorderSchema = z.object({
  orderedIds: z.array(z.string()).min(1, 'Danh sách ID không được trống.'),
});

export const quizController = {
  async getQuizzes(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const hostId = (req as AuthRequest).user!.id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await quizService.getQuizzes(hostId, page, limit);
      sendSuccess(res, result, 'Lấy danh sách bộ câu hỏi thành công.');
    } catch (err) {
      next(err);
    }
  },

  async createQuiz(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const hostId = (req as AuthRequest).user!.id;
      const quiz = await quizService.createQuiz(hostId, req.body);
      sendCreated(res, quiz, 'Tạo bộ câu hỏi thành công.');
    } catch (err) {
      next(err);
    }
  },

  async getQuiz(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const hostId = (req as AuthRequest).user!.id;
      const id = req.params['id'] as string;
      const quiz = await quizService.getQuiz(id, hostId);
      sendSuccess(res, quiz, 'Lấy bộ câu hỏi thành công.');
    } catch (err) {
      next(err);
    }
  },

  async updateQuiz(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const hostId = (req as AuthRequest).user!.id;
      const id = req.params['id'] as string;
      const quiz = await quizService.updateQuiz(id, hostId, req.body);
      sendSuccess(res, quiz, 'Cập nhật bộ câu hỏi thành công.');
    } catch (err) {
      next(err);
    }
  },

  async deleteQuiz(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const hostId = (req as AuthRequest).user!.id;
      const id = req.params['id'] as string;
      await quizService.deleteQuiz(id, hostId);
      sendSuccess(res, null, 'Xóa bộ câu hỏi thành công.');
    } catch (err) {
      next(err);
    }
  },

  async addQuestion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const hostId = (req as AuthRequest).user!.id;
      const id = req.params['id'] as string;
      const question = await quizService.addQuestion(id, hostId, req.body);
      sendCreated(res, question, 'Thêm câu hỏi thành công.');
    } catch (err) {
      next(err);
    }
  },

  async updateQuestion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const hostId = (req as AuthRequest).user!.id;
      const id = req.params['id'] as string;
      const qId = req.params['qId'] as string;
      const question = await quizService.updateQuestion(
        id,
        hostId,
        qId,
        req.body,
      );
      sendSuccess(res, question, 'Cập nhật câu hỏi thành công.');
    } catch (err) {
      next(err);
    }
  },

  async deleteQuestion(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const hostId = (req as AuthRequest).user!.id;
      const id = req.params['id'] as string;
      const qId = req.params['qId'] as string;
      await quizService.deleteQuestion(id, hostId, qId);
      sendSuccess(res, null, 'Xóa câu hỏi thành công.');
    } catch (err) {
      next(err);
    }
  },

  async reorderQuestions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const hostId = (req as AuthRequest).user!.id;
      const id = req.params['id'] as string;
      await quizService.reorderQuestions(id, hostId, req.body.orderedIds);
      sendSuccess(res, null, 'Sắp xếp lại câu hỏi thành công.');
    } catch (err) {
      next(err);
    }
  },
};
