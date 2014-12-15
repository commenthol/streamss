var JsonArray = require('..').JsonArray;
var SplitLine = require('..').SplitLine;

require('fs').createReadStream(__dirname + '/../test/test.json')
	.pipe(SplitLine())
	.pipe(JsonArray.parse())
	.pipe(JsonArray.stringify())
	.pipe(process.stdout);
