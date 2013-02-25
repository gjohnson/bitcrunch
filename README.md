
## bitcrunch

Slowly but surely porting [stream-lib](https://github.com/clearspring/stream-lib/) over to JS, learning alot as I go...

## example

```js
var bitcrunch = require('bitcrunch');
var assert = require('assert');

var HyperLogLog = bitcrunch.counter('hyperloglog');
var hll = new HyperLogLog(16);

hll.add('one');
hll.add('two');
hll.add('three');
hll.add('four');
hll.add('four');

assert(hll.card() === 4);
```