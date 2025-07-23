const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Default cache duration (5 minutes)
const DEFAULT_CACHE_DURATION = 300;

// Cache key generator
const generateCacheKey = (req) => {
  return `api-cache:${req.method}:${req.originalUrl}:${JSON.stringify(req.body)}`;
};

// Cache middleware
const cacheMiddleware = (duration = DEFAULT_CACHE_DURATION) => {
  return async (req, res, next) => {
    // Skip caching for non-GET requests or if cache is disabled
    if (req.method !== 'GET' || req.headers['x-skip-cache']) {
      return next();
    }

    const key = generateCacheKey(req);

    try {
      // Try to get cached response
      const cachedResponse = await redis.get(key);
      
      if (cachedResponse) {
        const parsed = JSON.parse(cachedResponse);
        return res.status(200).json(parsed);
      }

      // If no cache, wrap res.json to cache the response
      const originalJson = res.json;
      res.json = function(body) {
        redis.setex(key, duration, JSON.stringify(body))
          .catch(err => console.error('Cache storage error:', err));
        
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Cache invalidation helper
const invalidateCache = async (pattern) => {
  try {
    const keys = await redis.keys(`api-cache:${pattern}`);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};

module.exports = {
  cacheMiddleware,
  invalidateCache
};
