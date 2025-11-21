const redis = require('redis');
const logger = require('../utils/logger');

class RedisService {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            logger.error('Redis server connection refused');
            return new Error('Redis server connection refused');
          }
          if (options.total_retry_time > 1000 * 60 * 60) {
            logger.error('Redis retry time exhausted');
            return new Error('Retry time exhausted');
          }
          if (options.attempt > 10) {
            logger.error('Redis max retry attempts reached');
            return undefined;
          }
          return Math.min(options.attempt * 100, 3000);
        }
      });

      this.client.on('error', (err) => {
        logger.error('Redis client error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('Redis client connected');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        logger.info('Redis client ready');
        this.isConnected = true;
      });

      this.client.on('end', () => {
        logger.info('Redis client connection ended');
        this.isConnected = false;
      });

      await this.client.connect();
    } catch (error) {
      logger.error('Redis connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
      logger.info('Redis client disconnected');
    }
  }

  // Cache operations
  async set(key, value, ttl = 3600) {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping cache set');
        return false;
      }

      const serializedValue = JSON.stringify(value);
      await this.client.setEx(key, ttl, serializedValue);
      logger.debug('Cache set', { key, ttl });
      return true;
    } catch (error) {
      logger.error('Redis set error:', error);
      return false;
    }
  }

  async get(key) {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping cache get');
        return null;
      }

      const value = await this.client.get(key);
      if (value) {
        logger.debug('Cache hit', { key });
        return JSON.parse(value);
      }
      logger.debug('Cache miss', { key });
      return null;
    } catch (error) {
      logger.error('Redis get error:', error);
      return null;
    }
  }

  async del(key) {
    try {
      if (!this.isConnected) {
        logger.warn('Redis not connected, skipping cache delete');
        return false;
      }

      await this.client.del(key);
      logger.debug('Cache deleted', { key });
      return true;
    } catch (error) {
      logger.error('Redis delete error:', error);
      return false;
    }
  }

  async exists(key) {
    try {
      if (!this.isConnected) {
        return false;
      }

      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis exists error:', error);
      return false;
    }
  }

  async expire(key, ttl) {
    try {
      if (!this.isConnected) {
        return false;
      }

      await this.client.expire(key, ttl);
      return true;
    } catch (error) {
      logger.error('Redis expire error:', error);
      return false;
    }
  }

  // Session management
  async setSession(sessionId, sessionData, ttl = 86400) { // 24 hours
    const key = `session:${sessionId}`;
    return await this.set(key, sessionData, ttl);
  }

  async getSession(sessionId) {
    const key = `session:${sessionId}`;
    return await this.get(key);
  }

  async deleteSession(sessionId) {
    const key = `session:${sessionId}`;
    return await this.del(key);
  }

  // Rate limiting
  async checkRateLimit(key, limit, window) {
    try {
      if (!this.isConnected) {
        return { allowed: true, remaining: limit };
      }

      const current = await this.client.incr(key);
      if (current === 1) {
        await this.client.expire(key, window);
      }

      const remaining = Math.max(0, limit - current);
      const allowed = current <= limit;

      return { allowed, remaining, resetTime: Date.now() + (window * 1000) };
    } catch (error) {
      logger.error('Redis rate limit error:', error);
      return { allowed: true, remaining: limit };
    }
  }

  // User activity tracking
  async trackUserActivity(userId, activity) {
    try {
      const key = `user_activity:${userId}`;
      const timestamp = Date.now();
      
      await this.client.zAdd(key, {
        score: timestamp,
        value: JSON.stringify(activity)
      });
      
      // Keep only last 100 activities
      await this.client.zRemRangeByRank(key, 0, -101);
      
      // Set expiration to 30 days
      await this.client.expire(key, 2592000);
      
      return true;
    } catch (error) {
      logger.error('Redis user activity tracking error:', error);
      return false;
    }
  }

  async getUserActivity(userId, limit = 50) {
    try {
      const key = `user_activity:${userId}`;
      const activities = await this.client.zRevRange(key, 0, limit - 1);
      
      return activities.map(activity => JSON.parse(activity));
    } catch (error) {
      logger.error('Redis get user activity error:', error);
      return [];
    }
  }

  // Real-time data caching
  async cacheHealthData(location, data, ttl = 1800) { // 30 minutes
    const key = `health_data:${location}`;
    return await this.set(key, data, ttl);
  }

  async getCachedHealthData(location) {
    const key = `health_data:${location}`;
    return await this.get(key);
  }

  async cacheCollectionStats(stats, ttl = 300) { // 5 minutes
    const key = 'collection_stats';
    return await this.set(key, stats, ttl);
  }

  async getCachedCollectionStats() {
    const key = 'collection_stats';
    return await this.get(key);
  }

  // AI interaction caching
  async cacheAIResponse(query, response, ttl = 3600) { // 1 hour
    const key = `ai_response:${Buffer.from(query).toString('base64')}`;
    return await this.set(key, response, ttl);
  }

  async getCachedAIResponse(query) {
    const key = `ai_response:${Buffer.from(query).toString('base64')}`;
    return await this.get(key);
  }

  // Notification queue
  async addToNotificationQueue(notification) {
    try {
      if (!this.isConnected) {
        return false;
      }

      await this.client.lPush('notification_queue', JSON.stringify(notification));
      return true;
    } catch (error) {
      logger.error('Redis notification queue error:', error);
      return false;
    }
  }

  async getFromNotificationQueue() {
    try {
      if (!this.isConnected) {
        return null;
      }

      const notification = await this.client.rPop('notification_queue');
      return notification ? JSON.parse(notification) : null;
    } catch (error) {
      logger.error('Redis get notification error:', error);
      return null;
    }
  }

  // Analytics data caching
  async cacheAnalyticsData(type, data, ttl = 600) { // 10 minutes
    const key = `analytics:${type}`;
    return await this.set(key, data, ttl);
  }

  async getCachedAnalyticsData(type) {
    const key = `analytics:${type}`;
    return await this.get(key);
  }

  // Pub/Sub for real-time updates
  async publish(channel, message) {
    try {
      if (!this.isConnected) {
        return false;
      }

      await this.client.publish(channel, JSON.stringify(message));
      logger.debug('Message published', { channel });
      return true;
    } catch (error) {
      logger.error('Redis publish error:', error);
      return false;
    }
  }

  async subscribe(channel, callback) {
    try {
      if (!this.isConnected) {
        return false;
      }

      const subscriber = this.client.duplicate();
      await subscriber.connect();
      
      await subscriber.subscribe(channel, (message) => {
        try {
          const parsedMessage = JSON.parse(message);
          callback(parsedMessage);
        } catch (error) {
          logger.error('Redis subscription message parse error:', error);
        }
      });

      return subscriber;
    } catch (error) {
      logger.error('Redis subscribe error:', error);
      return null;
    }
  }

  // Health check
  async healthCheck() {
    try {
      if (!this.isConnected) {
        return { status: 'disconnected', connected: false };
      }

      const pong = await this.client.ping();
      return { 
        status: pong === 'PONG' ? 'healthy' : 'unhealthy', 
        connected: this.isConnected 
      };
    } catch (error) {
      logger.error('Redis health check error:', error);
      return { status: 'error', connected: false, error: error.message };
    }
  }

  // Get Redis info
  async getInfo() {
    try {
      if (!this.isConnected) {
        return null;
      }

      const info = await this.client.info();
      return info;
    } catch (error) {
      logger.error('Redis info error:', error);
      return null;
    }
  }
}

// Create singleton instance
const redisService = new RedisService();

module.exports = redisService;
