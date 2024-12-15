const redis = require('redis');

const redisClient = redis.createClient({
    host: 'redis-service',
    port: 6379
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.log(`Error: ${err}`);
});

module.exports = redisClient;