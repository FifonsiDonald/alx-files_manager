import { createClient } from 'redis';
import { promisify } from 'util';

/**
 * Redis client class to interact with the Redis server.
 */

class RedisClient {
  constructor() {
    // create redis client
    this.client = createClient();

    // error handling
    this.client.on('error', (err) => {
      console.log(`Redis client not connected to the server: ${err}`);
    });

    // connection console log true if yes
    this.client.on('connect', () => {
      console.log('redi client connected!');
    });
  }

  /**
       * isAlive function that returns True.
       * @returns {boolean} True if connection is successful, False otherwise.
       */
  isAlive() {
    if (this.client.connected) {
      return true;
    }
    return false;
  }

  /**
       * Gets the value associated with a key from the Redis server.
       * @param {string} key - The key to look up in the Redis server.
       * @returns {Promise<string|null} - The value associated with the key, null if key not found.
       */
  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    const getValue = await getAsync(key);
    return getValue;
  }

  /**
       * Sets a key-value pair in the Redis server with an optional time-to-live.
       * @param {string} key - Key to store in the Redis server.
       * @param {string} value - Value to store in the Redis server.
       * @param {number} duration - Expiration time in seconds.
       * @returns {Promise<void>} - Promise that resolves when the operation is complete.
       */
  async set(key, value, duration) {
    const setAsync = promisify(this.client.set).bind(this.client);
    await setAsync(key, value);
    await this.client.expire(key, duration);
  }

  /**
     * Deletes the value associated with a key from the Redis server.
     * @param {string} key - The key to delete from the Redis server.
     * @returns {Promise<number>} - The number of keys that were deleted.
     */
  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    await delAsync(key);
  }
}

// exportRedisclient
const redisClient = new RedisClient();

module.exports = redisClient;
