import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export function connect(token?: string) {
  if (socketInstance?.connected) {
    return socketInstance;
  }

  socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
    autoConnect: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 800,
    reconnectionDelayMax: 6000,
    auth: token ? { token } : undefined,
  });

  return socketInstance;
}

export function disconnect() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}

export function getSocket() {
  return socketInstance;
}
