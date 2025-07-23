import { Server as SocketServer } from 'socket.io';

export const setupSocketHandlers = (io: SocketServer): void => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Add your socket event handlers here
  });
};
