const Redis = require('ioredis');
const { redis, env } = require('./vars');

// const cache =  new Redis(redis.uri);

const cache = new Redis();

cache.set('redis-status', 'redis ok');
cache.get('redis-status', (err, result) => {
  console.log(result);
});

exports.CacheToken = (userId, token) => {
  const key = `/user/token/${userId}`;
  cache.set(key, token);
};

