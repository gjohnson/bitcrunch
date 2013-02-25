
/**
 * Dependencies.
 */

var murmur = require('murmurhash')
  , RegisterSet = require('../register-set')
  , utils = require('../utils');

/**
 * Expose.
 */

module.exports = exports = HyperLogLog;

/**
 * Positive and negative pow(2,32);
 */

const MAX_2_32 = 4294967296;
const N_MAX_2_32 = -4294967296;

/**
 * Utils references.
 */

var isFloat = utils.isFloat;
var leadingZeros = utils.leadingZeros;

/**
 * Initialize a new "hyperloglog" (HLL) counter.
 *
 * @public
 * @constructor
 * @param {Number} value
 */

function HyperLogLog(value){
  var log2m = isFloat(value) ? log2m(value) : value;
  var m = Math.pow(2, log2m);

  switch (log2m) {
    case 4:
      this.alpha = 0.673 * m * m;
      break;
    case 5:
      this.alpha = 0.697 * m * m;
      break;
    case 6:
      this.alpha = 0.709 * m * m;
      break;
    default:
      this.alpha = (0.7213 / (1 + 1.079 / m)) * m * m;
  }

  this.log2m = log2m;
  this.register = new RegisterSet(m);
}

/**
 * Add an object to the log.
 *
 * @public
 * @param {Number|String} data
 * @return {Boolean}
 */

HyperLogLog.prototype.add = function(data){
  var log2m = this.log2m;
  var hash = murmur(data.toString());
  var bucket = hash >>> (32 - log2m);
  var rank = leadingZeros((hash << log2m) | (1 << (log2m - 1)) + 1) + 1;

  if (this.register.get(bucket) < rank) {
    this.register.set(bucket, rank);
    return true;
  }

  return false;
};

/**
 * Get the cardinality of the set. Optionally enable
 * or disable long range corrections.
 *
 * @public
 * @param {Boolean} correction
 * @return {Number}
 */

HyperLogLog.prototype.card = function(corrections){
  corrections = 'undefined' == typeof corrections ? true : false;

  var sum = 0;
  var count = this.register.count;

  for (var i = 0; i < this.register.count; i++) {
    sum += Math.pow(2, (-1 * this.register.get(i)));
  }

  var estimate = this.alpha * (1 / sum);
  var zeros = 0;

  // small
  if (estimate <= (5.0 / 2.0) * count) {
    for (var k = 0; k < count; k++) {
      if (this.register.get(k) === 0) zeros++;
    }
    return Math.round(count * Math.log(count / zeros));
  }

  // intermediate
  if (estimate <= (1.0 / 30.0) * MAX_2_32) {
    return Math.round(estimate);
  }

  // large
  if (estimate > (1.0 / 30.0) * MAX_2_32) {
    if (corrections) {
      return Math.round((N_MAX_2_32 * Math.log(1.0 - (estimate / MAX_2_32))));
    } else {
      return Math.round(estimate);
    }
  }

  return 0;
};

/**
 * Calculates "log2m" from a standard deviation.
 *
 * @private
 * @param {Number} sd
 * @return {Number}
 */

function log2m(sd){
  return (Math.log((1.106 / sd) * (1.106 / sd)) / Math.log(2)) | 0;
}