
/**
 * Checks if a number is a floating point value.
 *
 * @public
 * @param {Number} value
 * @return {Boolean}
 */

exports.isFloat = function(input) {
  return input % 1 !== 0;
};

/**
 * Number of leading zeros.
 *
 * Credits: Devon Govett
 * http://jsperf.com/read-leading-zeros/7
 *
 * @private
 * @param {Number} input
 * @return {Number}
 */

exports.leadingZeros = function(input){
  var output = 0;
  var curbyte = 0;
            
  while(true) {
    curbyte = input >>> 24;
    if (curbyte) break;
    output += 8;
    
    curbyte = input >>> 16;
    if (curbyte & 0xff) break;
    output += 8;
    
    curbyte = input >> 8;
    if (curbyte & 0xff) break;
    output += 8;
    
    curbyte = input;
    if (curbyte & 0xff) break;
    output += 8;
    
    return output;
  }
  
  if (!(curbyte & 0xf0)) {
    output += 4;
  } else {
    curbyte >>>= 4;
  }
      
  if (curbyte & 0x8) return output;
  if (curbyte & 0x4) return output + 1;
  if (curbyte & 0x2) return output + 2;
  if (curbyte & 0x1) return output + 3;

  return output + 4;
};