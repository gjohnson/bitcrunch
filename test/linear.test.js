
var bitcrunch = require('..')
  , assert = require('better-assert');

describe('linear', function(){

  describe('add()', function(){
    var names = bitcrunch('names');

    after(function(done){
      names.clear(done);
    });

    it('should return true when the value as added', function(done){
      names.add('foo', function(err, ok){
        if (err) return done(err);
        ok.should.equal(true);
        done();
      });
    });

    it('should return false when the value already existed', function(done){
      names.add('foo', function(err, ok){
        if (err) return done(err);
         ok.should.equal(false);
        done();
      });
    });

    it('should not accept invalid values', function(done){
      names.add(null, function(err){
        err.should.be.instanceof(TypeError);
        done();
      });
    });
  });

  describe('count()', function(){
    var letters = bitcrunch('letters');

    after(function(done){
      letters.clear(done);
    });

    it('should count the unqiue items', function(done){
      var values = ['a', 'b', 'c', 'd'];
      var pending = values.length;

      values.forEach(function(value){
        letters.add(value, next);
      });

      function next(){
        if (--pending !== 0) return;
        letters.count(function(err, value){
          if (err) return done(err);
          value.should.equal(4);
          done();
        });
      }
    });
  });


  describe('and()', function(){
    var won = bitcrunch('won');
    var lost = bitcrunch('lost');

    after(function(done){
      won.clear(function(){
        lost.clear(done);
      });
    });

    it('should count the items that exist in both sets', function(done){
      won
      .add('a+foobar@email.com')
      .add('b+foobar@email.com')
      .add('c+foobar@email.com');

      lost
      .add('c+foobar@email.com')
      .add('d+foobar@email.com');

      // bug (need a queue/batch/promise)
      setTimeout(function(){
        won.and(lost).count(function(err, total){
          if (err) return done(err);
          total.should.equal(1);
          done();
        });
      }, 20);
    });
  });

  describe('or()', function(){
    var foo = bitcrunch('letters-foo');
    var bar = bitcrunch('letters-bar');

    after(function(done){
      foo.clear(function(){
        bar.clear(done);
      });
    });

    it('should count the items that exist in either both sets', function(done){
      foo
      .add('a')
      .add('b')
      .add('c');

      bar
      .add('c')
      .add('d');

      // bug (need a queue/batch/promise)
      setTimeout(function(){
        foo.or(bar).count(function(err, total){
          if (err) return done(err);
          total.should.equal(4);
          done();
        });
      }, 20);
    });
  });

  describe('includes()', function(){
    var books = bitcrunch('books');

    after(function(done){
      books.clear(done);
    });

    it('should check the existence of a memeber', function(done){
      books.add('javascript');
      books.add('lua');
      books.add('redis');

      setTimeout(function(){
        books.includes('lua', function(err, ok){
          if (err) return done(err);
          ok.should.equal(true);
          done();
        });
      }, 20);
    });
  });
});