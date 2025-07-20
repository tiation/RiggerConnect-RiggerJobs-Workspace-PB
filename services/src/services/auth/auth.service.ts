import { User, UserSchema } from '@riggerhireapp/shared';
import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';
import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../../config/service.config';

export class AuthenticationService {
  private static readonly TOKEN_EXPIRY = '24h';
  private static readonly REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

  private static hashPassword(password: string): string {
    return createHash('sha256')
      .update(password + process.env.PASSWORD_SALT)
      .digest('hex');
  }

  public async authenticateUser(email: string, password: string): Promise<{ user: User; token: string; refreshToken: string } | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || user.password !== AuthenticationService.hashPassword(password)) {
      return null;
    }

    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Store refresh token in Redis
    await redis.set(
      `refresh_token:${user.id}`,
      refreshToken,
      'EX',
      AuthenticationService.REFRESH_TOKEN_EXPIRY
    );

    return {
      user: UserSchema.parse(user),
      token,
      refreshToken,
    };
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      config.JWT_SECRET,
      { expiresIn: AuthenticationService.TOKEN_EXPIRY }
    );
  }

  private generateRefreshToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        tokenType: 'refresh',
      },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  public async refreshAccessToken(refreshToken: string): Promise<{ token: string } | null> {
    try {
      const decoded = jwt.verify(refreshToken, config.JWT_SECRET) as {
        userId: string;
        tokenType: string;
      };

      if (decoded.tokenType !== 'refresh') {
        return null;
      }

      const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
      if (!storedToken || storedToken !== refreshToken) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return null;
      }

      return {
        token: this.generateToken(UserSchema.parse(user)),
      };
    } catch (error) {
      return null;
    }
  }

  public async logout(userId: string): Promise<void> {
    await redis.del(`refresh_token:${userId}`);
  }
}
