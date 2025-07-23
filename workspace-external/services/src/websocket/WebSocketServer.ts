import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../utils/logger';

export interface WebSocketMessage {
  type: string;
  payload: any;
}

export class WebSocketServer {
  private io: Server;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.initialize();
  }

  private initialize(): void {
    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);

      // Handle job updates
      socket.on('job:update', (data: WebSocketMessage) => {
        logger.info(`Job update received: ${JSON.stringify(data)}`);
        // Broadcast to all connected clients except sender
        socket.broadcast.emit('job:updated', data);
      });

      // Handle real-time chat messages
      socket.on('chat:message', (data: WebSocketMessage) => {
        logger.info(`Chat message received: ${JSON.stringify(data)}`);
        this.io.emit('chat:newMessage', data);
      });

      // Handle user status updates
      socket.on('user:status', (data: WebSocketMessage) => {
        logger.info(`User status update: ${JSON.stringify(data)}`);
        this.io.emit('user:statusUpdate', data);
      });

      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
      });

      // Error handling
      socket.on('error', (error: Error) => {
        logger.error(`WebSocket error: ${error.message}`);
      });
    });
  }

  // Method to broadcast to all connected clients
  public broadcast(event: string, message: WebSocketMessage): void {
    this.io.emit(event, message);
  }

  // Method to send to specific room/group
  public sendToRoom(room: string, event: string, message: WebSocketMessage): void {
    this.io.to(room).emit(event, message);
  }
}
