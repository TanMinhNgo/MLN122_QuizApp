'use client';

import { useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';

import { connect, getSocket } from '@/lib/socket';

interface UseSocketResult {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
}

export function useSocket(token?: string): UseSocketResult {
  const [socket] = useState<Socket | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return getSocket() ?? connect(token);
  });
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const onConnect = () => {
      setIsConnected(true);
      setConnectionError(null);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onError = (error: Error) => {
      setConnectionError(error.message || 'Không thể kết nối tới máy chủ.');
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onError);
    };
  }, [socket]);

  return { socket, isConnected, connectionError };
}
