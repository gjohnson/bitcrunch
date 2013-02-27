
/**
 * Internals.
 */

var redis = require('./redis')
  , Linear = require('./counters/linear');

/**
 * Create a counter for `key`.
 *
 * Note: were defaulting to `Linear` counting for now.
 *
 * @public
 * @param {String} key
 * @return {Linear}
 */

module.exports = function(key){
  return new Linear(key);
};

/**
 * Accessor for setting userland redis client.
 *
 * @public
 * @param {RedisClient} client
 */

Object.defineProperty(exports, 'redis', {
  set: function(client){
    redis.client = client;
  }
});