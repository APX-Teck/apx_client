import { io, Socket } from 'socket.io-client';

const apiBaseUrl = process.env.NEXT_PUBLIC_NODEJS_API_URL || 'http://localhost:8090/api/v1';
// Strip /api/v1 (or any /api/v* suffix) to get the backend base URL for Socket.IO
const BASE_URL = apiBaseUrl.replace(/\/api\/v\d+$/, '');

let socket: Socket | null = null;
let currentToken: string | null = null;
const listeners: { event: string; handler: (...args: any[]) => void }[] = [];

export const socketManager = {
  connect(token: string): void {
    if (typeof window === 'undefined') return;

    if (socket && currentToken === token) {
      if (!socket.connected) {
        socket.connect();
      }
      return;
    }

    if (socket) {
      socket.disconnect();
    }

    currentToken = token;
    socket = io(BASE_URL, {
      path: '/socket.io',
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: false,
    });

    // Re-register all existing listeners on the new socket
    for (const { event, handler } of listeners) {
      socket.on(event, handler);
    }

    socket.connect();
  },

  disconnect(): void {
    if (socket) {
      socket.disconnect();
      socket = null;
      currentToken = null;
    }
  },

  on(event: string, handler: (...args: any[]) => void): void {
    listeners.push({ event, handler });
    if (socket) {
      socket.on(event, handler);
    }
  },

  off(event: string, handler: (...args: any[]) => void): void {
    const index = listeners.findIndex((l) => l.event === event && l.handler === handler);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
    if (socket) {
      socket.off(event, handler);
    }
  },

  isConnected(): boolean {
    return socket ? socket.connected : false;
  },

  reconnectWithToken(token: string): void {
    if (socket) {
      this.connect(token);
    }
  },
};
