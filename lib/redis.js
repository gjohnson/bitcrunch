
/**
 * Dependencies.
 */

var redis = require('redis');

/**
 * Cached connection.
 */

var client;

/**
 * Lazy getters for getting our redis client. We
 * want it to be a little lazy because the user
 * has the option to set thier own redis client
 * from our top level api.
 *
 * Example:
 *
 *  var redis = require('redis');
 *  var bitcrunch = require('bitcrunch');
 *
 *  bitcrunch.redis = redis.createClient();
 *
 * @private
 * @param {RedisClient} other
 * @return {RedisClient}
 */

Object.defineProperty(exports, 'client', {
  get: function(){
    return client || (client || redis.createClient());
  },
  set: function(other){
    client = other;
  }
});