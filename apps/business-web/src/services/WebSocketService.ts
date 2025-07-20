import { io, Socket } from 'socket.io-client';

export interface WebSocketMessage {
  type: string;
  payload: any;
}

export class WebSocketService {
  private static instance: WebSocketService;
  private socket: Socket;
  private listeners: Map<string, Set<(data: any) => void>>;

  private constructor() {
    this.socket = io(process.env.REACT_APP_WS_URL || 'ws://localhost:8080', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
    });

    this.listeners = new Map();
    this.initialize();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private initialize(): void {
    // Connection handling
    this.socket.on('connect', () => {
      console.info('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.warn('WebSocket disconnected');
    });

    this.socket.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });

    // Handle reconnection
    this.socket.on('reconnect', (attemptNumber: number) => {
      console.info(`WebSocket reconnected after ${attemptNumber} attempts`);
    });

    this.socket.on('reconnect_error', (error: Error) => {
      console.error('WebSocket reconnection error:', error);
    });
  }

  // Subscribe to events
  public subscribe(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    const eventListeners = this.listeners.get(event)!;
    eventListeners.add(callback);
    
    this.socket.on(event, callback);

    // Return unsubscribe function
    return () => {
      this.socket.off(event, callback);
      eventListeners.delete(callback);
    };
  }

  // Send message
  public send(event: string, message: WebSocketMessage): void {
    this.socket.emit(event, message);
  }

  // Join room
  public joinRoom(room: string): void {
    this.socket.emit('room:join', { room });
  }

  // Leave room
  public leaveRoom(room: string): void {
    this.socket.emit('room:leave', { room });
  }

  // Disconnect websocket
  public disconnect(): void {
    this.socket.disconnect();
  }

  // Reconnect websocket
  public reconnect(): void {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }
}
