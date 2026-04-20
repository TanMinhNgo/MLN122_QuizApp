import dotenv from 'dotenv';

dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Biến môi trường bắt buộc "${key}" chưa được cấu hình`);
  }
  return value;
};

export const ENV = {
  PORT: Number(process.env.PORT) || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/kahoot',
  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET ||
    'default_access_secret_change_in_production',
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET ||
    'default_refresh_secret_change_in_production',
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || '15m',
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '7d',
};
