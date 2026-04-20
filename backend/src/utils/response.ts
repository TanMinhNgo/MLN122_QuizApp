import { Response } from 'express';

// Định dạng phản hồi API thống nhất
export const sendSuccess = (
  res: Response,
  data: unknown,
  message = 'Thành công',
  statusCode = 200,
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: unknown,
): Response => {
  const body: Record<string, unknown> = { success: false, message };
  if (errors !== undefined) body.errors = errors;
  return res.status(statusCode).json(body);
};

export const sendCreated = (
  res: Response,
  data: unknown,
  message = 'Tạo thành công',
): Response => {
  return sendSuccess(res, data, message, 201);
};
