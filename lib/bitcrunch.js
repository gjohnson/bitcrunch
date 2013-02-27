
/**
 * Internals.
 */

var redis = require('./redis')
  , Linear = require('./counters/linear');

/**
 * Create a counter for `key`.
 */

module.exports = function(key){
  return new Linear(key);
};

/**
 * Accessor for custom redis client.
 */

Object.defineProperty(exports, 'redis', {
  set: function(client){
    redis.client = client;
  }
});