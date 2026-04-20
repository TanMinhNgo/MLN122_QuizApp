import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { ENV } from '../config/env';
import { registerHostHandlers } from './handlers/host.handler';
import { registerPlayerHandlers } from './handlers/player.handler';

export const initSocket = (httpServer: HttpServer): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: ENV.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Ping timeout/interval để phát hiện client mất kết nối
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket) => {
    console.log(`Socket kết nối: ${socket.id}`);

    // Đăng ký các event handler cho host và người chơi
    registerHostHandlers(io, socket);
    registerPlayerHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log(`Socket ngắt kết nối: ${socket.id}`);
    });
  });

  return io;
};
