
/**
 * Internals.
 */

exports.utils = require('./utils');
exports.RegisterSet = require('./register-set');
exports.HyperLogLog = require('./counters/hyperloglog');

/**
 * Supported types.
 */

exports.counters = {
  'hyperloglog': exports.HyperLogLog
};


/**
 * Get a counter by `type`.
 *
 * @public
 * @param {String} type
 * @return {Mixed}
 */

exports.counter = function(type){
  var counter = exports.counters[type];
  if (!counter) throw new Error('invalid counter');
  return counter;
};