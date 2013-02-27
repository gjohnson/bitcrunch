
var bitcrunch = require('..');

var won = bitcrunch('won');
var lost = bitcrunch('lost');

// winners

won
.add('a+foobar@email.com')
.add('b+foobar@email.com')
.add('c+foobar@email.com');

// losers

lost
.add('c+foobar@email.com')
.add('d+foobar@email.com');

// hold up a hot sec...

setTimeout(function(){

  // won AND lost

  won
  .and(lost)
  .count(function(err, total){
    console.log('%s won AND lost', total);
  });

  // won OR lost

  won
  .or(lost)
  .count(function(err, total){
    console.log('%s won OR lost', total);
  });

}, 100);

