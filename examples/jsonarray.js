var path = require('path')
var JsonArray = require('..').JsonArray
var SplitLine = require('..').SplitLine

require('fs').createReadStream(path(__dirname, '../test/test.json'))
  .pipe(SplitLine())
  .pipe(JsonArray.parse())
  .pipe(JsonArray.stringify())
  .pipe(process.stdout)
