import http from 'http';
import app from './src/app';
import { connectDB } from './src/config/database';
import { initSocket } from './src/socket';
import { ENV } from './src/config/env';

const bootstrap = async (): Promise<void> => {
  // Kết nối MongoDB
  await connectDB();

  // Tạo HTTP server từ Express app
  const httpServer = http.createServer(app);

  // Khởi tạo Socket.io
  initSocket(httpServer);

  httpServer.listen(ENV.PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${ENV.PORT}`);
    console.log(`Môi trường: ${ENV.NODE_ENV}`);
  });
};

bootstrap().catch((err) => {
  console.error('Lỗi khởi động server:', err);
  process.exit(1);
});
