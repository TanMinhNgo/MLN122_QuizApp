import { Session } from '../models/Session.model';

/**
 * Tạo mã PIN 6 chữ số duy nhất cho phòng chơi.
 * Kiểm tra trùng lặp với các phiên đang hoạt động trong DB.
 */
export const generateUniquePin = async (): Promise<string> => {
  const MAX_ATTEMPTS = 10;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    // Tạo số ngẫu nhiên 6 chữ số (100000 - 999999)
    const pin = String(Math.floor(100000 + Math.random() * 900000));

    // Kiểm tra PIN chưa được dùng trong các phiên đang hoạt động
    const existing = await Session.findOne({
      pin,
      status: { $nin: ['ended'] },
    });

    if (!existing) {
      return pin;
    }
  }

  throw new Error('Không thể tạo mã PIN duy nhất, vui lòng thử lại');
};
