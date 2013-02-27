
var bitcrunch = require('..');

var names = bitcrunch('names')
.add('foo')
.add('bar')
.add('buzz')
.add('buzz', function(){
  names.count(function(err, total){
    console.log('there are %s unique names', total);
  });
});
