import mongoose from 'mongoose';

let isConnected = false;

export const connectDatabase = async (mongoUri: string): Promise<void> => {
  if (isConnected) {
    console.log('Database is already connected');
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      // Remove deprecated options
    });
    
    isConnected = true;
    console.log('MongoDB connected successfully');
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });
    
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('Database disconnected');
  }
};
