
var assert = require('better-assert')
  , RegisterSet = require('..').RegisterSet;

describe('register-set', function(){

  describe('getset', function(){
    it('should get and set values by index', function(){
      var rs = new RegisterSet(16);
      rs.set(0, 11);
      assert(rs.get(0) === 11);
    });
  });

  describe('all positions', function(){
    it('should fill up all the positions', function(){
      var rs = new RegisterSet(16);
      for (var i = 0; i < 16; i++) {
        rs.set(i, i % 31);
        assert(rs.get(i) === i % 31);
      }
    });
  });

  describe('small bits', function(){
    it('should set the smalls ones too', function(){
      var rs = new RegisterSet(6);
      rs.set(0, 11);
      assert(rs.get(0) === 11);
    });
  });
  
});