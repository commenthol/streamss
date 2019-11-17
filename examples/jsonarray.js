const { resolve } = require('path')
const { JsonArray, SplitLine } = require('..')

require('fs').createReadStream(resolve(__dirname, '../test/test.json'))
  .pipe(SplitLine())
  .pipe(JsonArray.parse())
  .pipe(JsonArray.stringify())
  .pipe(process.stdout)
