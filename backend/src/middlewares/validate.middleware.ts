import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware xác thực dữ liệu request bằng Zod schema.
 * Tự động định dạng lỗi validation sang tiếng Việt.
 */
export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = formatZodErrors(result.error);
      res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ.',
        errors,
      });
      return;
    }

    // Gán lại body đã được parse/validate
    req.body = result.data;
    next();
  };

// Chuyển lỗi Zod sang định dạng thân thiện
const formatZodErrors = (error: ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path.join('.');
    errors[field] = translateZodMessage(issue.message, issue.code);
  }
  return errors;
};

// Dịch thông báo lỗi Zod sang tiếng Việt
const translateZodMessage = (message: string, code: string): string => {
  const translations: Record<string, string> = {
    Required: 'Trường này là bắt buộc.',
    'Invalid type': 'Kiểu dữ liệu không hợp lệ.',
    'String must contain at least': 'Độ dài tối thiểu không đạt yêu cầu.',
    'String must contain at most': 'Độ dài vượt quá giới hạn cho phép.',
    'Invalid email': 'Địa chỉ email không hợp lệ.',
    too_small: 'Giá trị quá nhỏ.',
    too_big: 'Giá trị quá lớn.',
    invalid_string: 'Chuỗi ký tự không hợp lệ.',
    invalid_type: 'Kiểu dữ liệu không hợp lệ.',
  };

  for (const [key, value] of Object.entries(translations)) {
    if (message.includes(key) || code === key) {
      return value;
    }
  }

  return message;
};
