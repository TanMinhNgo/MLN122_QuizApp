import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import { AppError } from '../middlewares/error.middleware';
import { ENV } from '../config/env';
import { JWTPayload } from '../types';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface AuthResult {
  user: { id: string; name: string; email: string; role: string };
  tokens: TokenPair;
}

// Tạo cặp access token và refresh token
const signTokens = (payload: JWTPayload): TokenPair => {
  const accessToken = jwt.sign(payload, ENV.JWT_ACCESS_SECRET, {
    expiresIn: ENV.JWT_ACCESS_EXPIRES as jwt.SignOptions['expiresIn'],
  });
  const refreshToken = jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.JWT_REFRESH_EXPIRES as jwt.SignOptions['expiresIn'],
  });
  return { accessToken, refreshToken };
};

export const authService = {
  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResult> {
    // Kiểm tra email đã tồn tại
    const exists = await User.findOne({ email });
    if (exists) {
      throw new AppError('Email đã được sử dụng.', 409);
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({ name, email, password: hashedPassword });

    const payload: JWTPayload = {
      id: String(user._id),
      email: user.email,
      role: user.role,
    };

    const tokens = signTokens(payload);

    return {
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens,
    };
  },

  async login(email: string, password: string): Promise<AuthResult> {
    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Email hoặc mật khẩu không đúng.', 401);
    }

    // Xác minh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Email hoặc mật khẩu không đúng.', 401);
    }

    const payload: JWTPayload = {
      id: String(user._id),
      email: user.email,
      role: user.role,
    };

    const tokens = signTokens(payload);

    return {
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tokens,
    };
  },

  async refreshToken(token: string): Promise<TokenPair> {
    try {
      const decoded = jwt.verify(token, ENV.JWT_REFRESH_SECRET) as JWTPayload;

      // Xác minh user vẫn còn tồn tại
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new AppError('Người dùng không tồn tại.', 401);
      }

      const payload: JWTPayload = {
        id: String(user._id),
        email: user.email,
        role: user.role,
      };

      return signTokens(payload);
    } catch {
      throw new AppError('Refresh token không hợp lệ hoặc đã hết hạn.', 401);
    }
  },

  async getProfile(
    userId: string,
  ): Promise<{ id: string; name: string; email: string; role: string }> {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new AppError('Không tìm thấy người dùng.', 404);
    }
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },
};
