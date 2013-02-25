
module.exports = process.env.BITCRUNCH_COV
  ? require('./lib-cov/bitcrunch')
  : require('./lib/bitcrunch');