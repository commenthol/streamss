var Split = require('..').Split;
var Through = require('..').Through;

require('fs').createReadStream(__dirname + '/../test/test.txt')
	.pipe(Split({ matcher: ' are ', encoding: 'utf8' }))
	.pipe(Through(
		{ decodeStrings: false },
		function(string) {
			this.push('>>>' + string + '<<<\n');
		}
	))
	.pipe(process.stdout);