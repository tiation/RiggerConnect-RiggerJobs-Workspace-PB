import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export class SessionService {
  private readonly redis: Redis;
  private readonly SESSION_EXPIRY = 24 * 60 * 60; // 24 hours

  constructor() {
    this.redis = redis;
  }

  async createSession(userId: string, data: any): Promise<string> {
    const sessionId = uuidv4();
    const sessionKey = `session:${sessionId}`;
    
    await this.redis.hmset(sessionKey, {
      userId,
      ...data,
      createdAt: Date.now()
    });
    
    await this.redis.expire(sessionKey, this.SESSION_EXPIRY);
    
    return sessionId;
  }

  async getSession(sessionId: string): Promise<any | null> {
    const sessionKey = `session:${sessionId}`;
    const session = await this.redis.hgetall(sessionKey);
    
    if (Object.keys(session).length === 0) {
      return null;
    }
    
    return session;
  }

  async updateSession(sessionId: string, data: any): Promise<void> {
    const sessionKey = `session:${sessionId}`;
    await this.redis.hmset(sessionKey, data);
    await this.redis.expire(sessionKey, this.SESSION_EXPIRY);
  }

  async deleteSession(sessionId: string): Promise<void> {
    const sessionKey = `session:${sessionId}`;
    await this.redis.del(sessionKey);
  }
}

export const sessionService = new SessionService();
