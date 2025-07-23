import jwt from 'jsonwebtoken';
import { Redis } from 'redis';
import { JWTPayload, User } from '../types';

export class JWTService {
  private readonly redis: Redis;
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRY: string;
  private readonly REFRESH_TOKEN_EXPIRY: number;

  constructor(redis: Redis) {
    this.redis = redis;
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    this.JWT_EXPIRY = '1h';
    this.REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60; // 30 days
  }

  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JWTPayload = {
      userId: user.id,
      role: user.role,
      permissions: user.permissions,
      exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
    };

    const accessToken = jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRY });
    const refreshToken = jwt.sign({ userId: user.id }, this.JWT_SECRET, { expiresIn: '30d' });

    // Store refresh token in Redis
    await this.redis.setEx(
      `refresh_token:${refreshToken}`,
      this.REFRESH_TOKEN_EXPIRY,
      user.id
    );

    return { accessToken, refreshToken };
  }

  async verifyToken(token: string): Promise<JWTPayload> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await this.redis.del(`refresh_token:${refreshToken}`);
  }

  async refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
      const userId = await this.redis.get(`refresh_token:${refreshToken}`);
      if (!userId) {
        return null;
      }

      const decoded = jwt.verify(refreshToken, this.JWT_SECRET) as { userId: string };
      if (decoded.userId !== userId) {
        return null;
      }

      // Generate new access token
      const payload: Partial<JWTPayload> = {
        userId,
        exp: Math.floor(Date.now() / 1000) + 3600
      };

      return jwt.sign(payload as JWTPayload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRY });
    } catch (error) {
      return null;
    }
  }
}
