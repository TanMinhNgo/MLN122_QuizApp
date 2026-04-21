import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware xử lý lỗi toàn cục
export const errorMiddleware = (
  err: AppError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Lỗi có thể dự đoán từ ứng dụng
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Lỗi trùng lặp từ MongoDB (unique constraint)
  if ((err as NodeJS.ErrnoException).name === 'MongoServerError') {
    const mongoErr = err as NodeJS.ErrnoException & { code?: number };
    if (mongoErr.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'Dữ liệu đã tồn tại trong hệ thống.',
      });
      return;
    }
  }

  // Lỗi validation từ Mongoose
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ.',
    });
    return;
  }

  // Lỗi không xác định — ghi log, trả về 500
  console.error('[ERROR]', err);
  res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.',
  });
};

// Handler cho route không tìm thấy (404)
export const notFoundMiddleware = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'Đường dẫn không tồn tại.',
  });
};
