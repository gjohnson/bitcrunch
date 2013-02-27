
/**
 * Dependencies.
 */

var redis = require('./redis').client
  , murmur = require('murmurhash')
  , identity = require('redis-identity')(redis);

/**
 * Expose `BitMap`.
 */

module.exports = BitMap;

/**
 * Initialize a new "BitMap counter" to be stored
 * under a bitset string in redis as `key`.
 *
 * Heavily inspired by bitmapist.
 * https://github.com/Doist/bitmapist
 *
 * @public
 * @param {String} key
 */

function BitMap(key){
  if ('string' != typeof key) throw new Error('invalid key');
  this.key = key;
}

/**
 * Add the `value`. The `value` will be hash and mapped
 * via `redis-identity` to a BitMap value, which will
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

BitMap.prototype.add = function(value, fn){
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
 * Helper for `BITOP` commands. Basically it will
 * generate the key name for the "destination" and
 * apply the bit operation to "rest" number for keys.
 *
 * Example, this would generate a key like "won-and-lost":
 *
 *  var won = bitcrunch('won');
 *  var lost = bitcrunch('lost');
 *
 *  won.and(lost);
 *
 * @private
 * @param {String} op
 * @return {BitMap}
 */

BitMap.prototype.bitop = function(op){
  var rest = [].slice.call(arguments, 1);
  var sources = rest.map(function(obj){
    return obj.key;
  });

  var dest = sources.join('-' + op +'-');
  var args = [op, dest].concat(sources);
  redis.bitop.apply(redis, args);
  return new BitMap(dest);
};

/**
 * Count the unique items via `BITCOUNT`.
 *
 * @public
 * @param {Function} fn
 */

BitMap.prototype.count = function(fn){
  redis.bitcount(this.key, fn);
};

/**
 * Ands two keys via `BITOP AND`.
 *
 * @public
 * @param {BitMap} other
 * @return {BitMap} dest
 */

BitMap.prototype.and = function(other) {
  return this.bitop('and', this, other);
};

/**
 * Ands two keys via `BITOP AND`.
 *
 * @public
 * @param {BitMap} other
 * @return {BitMap} dest
 */

BitMap.prototype.or = function(other) {
  return this.bitop('or', this, other);
};

/**
 * Checks the inclusion of a value by the mapping.
 *
 * @public
 * @param {String|Number} value
 * @param {Function} fn
 */

BitMap.prototype.includes = function(value, fn){
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

BitMap.prototype.clear = function(fn){
  redis.del(this.key, fn);
};

/**
 * Noop.
 */

function noop(){}