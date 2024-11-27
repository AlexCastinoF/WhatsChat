import { io } from 'socket.io-client';
import type { Message } from '../types/api';

const SOCKET_URL = 'http://localhost:3000';

export const socket = io(SOCKET_URL);

export const initializeSocket = (onMessage: (message: Message) => void) => {
  socket.on('whatsapp-message', (message: Message) => {
    onMessage(message);
  });

  return () => {
    socket.off('whatsapp-message');
  };
};