
/**
 * Dependencies.
 */

var murmur = require('murmurhash')
  , redis = require('../redis').client
  , identity = require('redis-identity')(redis);

/**
 * Expose `Linear`.
 */

module.exports = Linear;

/**
 * Initialize a new "linear counter" to be stored
 * under a bitset string in redis as `key`.
 *
 * Heavily inspired by bitmapist.
 * https://github.com/Doist/bitmapist
 *
 * @public
 * @param {String} key
 */

function Linear(key){
  if ('string' != typeof key) throw new Error('invalid key');
  this.key = key;
}

/**
 * Add the `value`. The `value` will be hash and mapped
 * via `redis-identity` to a linear value, which will
 * serve as it's internal identifier for `BITSET`.
 *
 * TODO: Should we always hash the value? Might not always
 * be a smaller value, but on the other hand I believe
 * there is optimizations we can turn on via redis.conf
 * for ziplist encoding when structures of the same type?
 *
 * @public
 * @param {String|Number} value
 * @param {Function} fn
 */

Linear.prototype.add = function(value, fn){
  fn = fn || noop;

  if (!~['string', 'number'].indexOf(typeof value)) {
    return fn(new TypeError('must be a string or number'));
  }

  var key = this.key;
  var hash = murmur(String(value));

  identity(hash, function(err, id){
    if (err) return fn(err);
    redis.setbit(key, id, 1, function(err, value){
      if (err) return fn(err);
      fn(null, !value);
    });
  });

  return this;
};

/**
 * Helper for `BITOP` commands
 *
 * @private
 * @param {String} op
 * @return {Linear}
 */

Linear.prototype.bitop = function(op){
  var rest = [].slice.call(arguments, 1);
  var sources = rest.map(function(obj){
    return obj.key;
  });

  var dest = sources.join('-' + op +'-');
  var args = [op, dest].concat(sources);
  redis.bitop.apply(redis, args);
  return new Linear(dest);
};

/**
 * Count the unique items via `BITCOUNT`.
 *
 * @public
 * @param {Function} fn
 */

Linear.prototype.count = function(fn){
  redis.bitcount(this.key, fn);
};

/**
 * Ands two keys via `BITOP AND`.
 *
 * @public
 * @param {Linear} other
 * @return {Linear} dest
 */

Linear.prototype.and = function(other) {
  return this.bitop('and', this, other);
};

/**
 * Ands two keys via `BITOP AND`.
 *
 * @public
 * @param {Linear} other
 * @return {Linear} dest
 */

Linear.prototype.or = function(other) {
  return this.bitop('or', this, other);
};

/**
 * Checks the inclusion of a value by the mapping.
 *
 * @public
 * @param {String|Number} value
 * @param {Function} fn
 */

Linear.prototype.includes = function(value, fn){
  fn = fn || noop;

  if (!~['string', 'number'].indexOf(typeof value)) {
    return fn(new TypeError('must be a string or number'));
  }

  var key = this.key;
  var hash = murmur(String(value));

  identity(hash, function(err, id){
    if (err) return fn(err);
    redis.getbit(key, id, function(err, value){
      if (err) return fn(err);
      fn(null, !!value);
    });
  });

  return this;
};


/**
 * Deletes the values via `DEL`.
 *
 * @public
 * @param {Function} fn
 */

Linear.prototype.clear = function(fn){
  redis.del(this.key, fn);
};

/**
 * Noop.
 */

function noop(){}