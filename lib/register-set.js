
/**
 * Expose.
 */

module.exports = RegisterSet;

/**
 * RegisterSet.
 *
 * @public
 * @param {Number} size
 */

function RegisterSet(count){
  var bits = this.bucket(count);

  if (bits === 0) {
    this.data = new Int32Array(1);
  } else if (bits % 32 === 0) {
    this.data = new Int32Array(bits);
  } else {
    this.data = new Int32Array(bits + 1);
  }

  this.count = count;
}

/**
 * Grabs a copy of the `data` array.
 *
 * @public
 * @return {Int32Array}
 */

RegisterSet.prototype.bits = function(){
  return this.data.slice(0);
};

/**
 * Calculates the "bucket" from the `offset`.
 *
 * @private
 * @param {Number} offset
 * @return {Number}
 */

RegisterSet.prototype.bucket = function(offset){
  return (offset / 6)|0;
};

/**
 * Calculates the "shift" from the `offset` and `bucket`.
 *
 * @private
 * @param {Number} offset
 * @param {Number} bucket
 * @return {Number}
 */

RegisterSet.prototype.shift = function(offset, bucket){
  return 5 * (offset - (bucket * 6));
};

/**
 * Sets the `value` at `offset`.
 *
 * @public
 * @param {Number} offset
 * @param {Number} value
 */

RegisterSet.prototype.set = function(offset, value){
  var bucket = this.bucket(offset);
  var shift = this.shift(offset, bucket);
  var current = this.data[bucket];
  this.data[bucket] = (current & ~(0x1f << shift)) | (value << shift);
};

/**
 * Gets the value at `offset`.
 *
 * @public
 * @return {Number}
 */

RegisterSet.prototype.get = function(offset){
  var bucket = this.bucket(offset);
  var shift = this.shift(offset, bucket);
  var value = this.data[bucket];
  return (value & (0x1f << shift)) >>> shift;
};