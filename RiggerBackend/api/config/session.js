const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');

// Initialize Redis client
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    legacyMode: false
});

redisClient.connect().catch(console.error);

// Redis error handling
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis successfully');
});

// Create Redis store
const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'riggerhire:sess:'
});

// Session configuration
const sessionConfig = {
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    name: 'sessionId', // Instead of default 'connect.sid'
    resave: false,
    saveUninitialized: false,
    rolling: true, // Reset expiration on every response
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'strict',
        domain: process.env.NODE_ENV === 'production' ? '.riggerhire.com' : undefined,
        path: '/'
    }
};

// Additional security in production
if (process.env.NODE_ENV === 'production') {
    sessionConfig.cookie.secure = true; // Require HTTPS
    sessionConfig.proxy = true; // Trust the reverse proxy
}

module.exports = {
    sessionConfig,
    redisClient
};
