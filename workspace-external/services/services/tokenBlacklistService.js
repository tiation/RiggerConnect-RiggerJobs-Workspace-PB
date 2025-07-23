const Redis = require('ioredis');

class TokenBlacklistService {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      keyPrefix: 'blacklist:',
    });
  }

  /**
   * Add a token to the blacklist
   * @param {string} token - The JWT token to blacklist
   * @param {number} expiresIn - Seconds until token expiration
   */
  async blacklistToken(token, expiresIn) {
    await this.redis.set(token, '1', 'EX', expiresIn);
  }

  /**
   * Check if a token is blacklisted
   * @param {string} token - The JWT token to check
   * @returns {Promise<boolean>} - True if token is blacklisted
   */
  async isBlacklisted(token) {
    const exists = await this.redis.exists(token);
    return exists === 1;
  }

  /**
   * Remove expired tokens from blacklist (maintenance)
   * This is handled automatically by Redis TTL
   */
  async cleanup() {
    // Redis automatically removes expired keys
    return true;
  }
}

module.exports = new TokenBlacklistService();
