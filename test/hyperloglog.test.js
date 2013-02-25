
var HyperLogLog = require('..').HyperLogLog
  , assert = require('better-assert');

describe('hyperloglog', function(){

  describe('count', function(){
    it('should compute the count of unique values', function(){
      var hll = new HyperLogLog(16);

      // unique
      assert(hll.add(0));
      assert(hll.add(1));
      assert(hll.add(2));
      assert(hll.add(3));
      assert(hll.add(16));
      assert(hll.add(17));
      assert(hll.add(18));
      assert(hll.add(19));

      // the dupe
      assert(!hll.add(19));
      
      assert(hll.card() === 8);
    });
  });

});