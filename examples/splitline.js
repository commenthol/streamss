var SplitLine = require('..').SplitLine;
var Through = require('..').Through;

require('fs').createReadStream(__dirname + '/../test/test.txt')
	.pipe(SplitLine({ matcher: 'i', chomp: true, encoding: 'utf8' }))
	.pipe(Through(
		{ decodeStrings: false },
		function(string) {
			this.push('>>>' + string + '<<<\n');
		}
	))
	.pipe(process.stdout);