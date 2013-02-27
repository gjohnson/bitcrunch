
var bitcrunch = require('..');

var likes = bitcrunch('likes')
.add('js')
.add('lua')
.add('redis');

likes.includes('js', function(err, result){
  console.log('result = %s', result);
});

likes.includes('php', function(err, result){
  console.log('result = %s', result);
});