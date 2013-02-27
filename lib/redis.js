
/**
 * Dependencies.
 */

var redis = require('redis');

/**
 * Connection.
 */

var client;

/**
 * Lazy getters.
 */

Object.defineProperty(exports, 'client', {
  get: function(){
    return client || (client || redis.createClient());
  },
  set: function(other){
    client = other;
  }
});