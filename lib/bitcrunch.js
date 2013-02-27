
/**
 * Internals.
 */

var redis = require('./redis')
  , BitMap = require('./bitmap');

/**
 * Create a Bitmap for `key`.
 *
 * @public
 * @param {String} key
 * @return {BitMap}
 */

module.exports = function(key){
  return new BitMap(key);
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