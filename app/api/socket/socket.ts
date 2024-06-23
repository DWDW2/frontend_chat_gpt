import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

type MessageHandler = (message: string) => void;

const useSocketIO = (url: string, onMessageReceived: MessageHandler) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);
  
  useEffect(() => {
    const socket = io(url);
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('message', (message: string) => {
      onMessageReceived(message);

    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (error: any) => {
      console.error("Socket.IO connection error:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, [url, onMessageReceived]);

  const sendMessage = useCallback((message: string) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('message', message);

    } else {
      console.error("Socket.IO is not connected.");
    }
  }, []);

  return { isConnected, sendMessage };
};

export default useSocketIO;
