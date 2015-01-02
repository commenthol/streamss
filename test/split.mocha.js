/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict';

/*global describe, it*/

var fs = require('fs'),
	assert = require('assert'),
	Split = require('..').Split,
	Through = require('..').Through;

describe('#Split', function(){

	it('with new operator', function(){
		var split = new Split();
		assert.ok(split instanceof Split);
	});

	it('without new operator', function(){
		var split = Split();
		assert.ok(split instanceof Split);
	});

	it('count lines', function(testDone){
		var cnt = 0,
			last,
			rs = fs.createReadStream(__dirname + '/fixtures/test.txt', { encoding: 'utf8', highWaterMark: 42 });

		rs
		.pipe(Split())
		.pipe(Through(
			function transform(chunk) {
				//~ console.log('>>', cnt, JSON.stringify(chunk.toString()));
				last = chunk;
				this.push(chunk);
				cnt++;
			},
			function flush() {
			}
		))
		.pipe(fs.createWriteStream(__dirname + '/fixtures/out.txt'))
		.on('close', function (){
			last = last.toString();
			assert.equal(last.indexOf('いてより深くに入ります。'), last.length-12);
			assert.equal(cnt, 35);
			testDone();
		});
	});

	it('count lines in chomp mode', function(done){
		var cnt = 0,
			last,
			rs = fs.createReadStream(__dirname + '/fixtures/test.txt', { encoding: 'utf8' });

		rs
		.pipe(Split({ matcher: /\r?\n/ }))
		.pipe(Through(
			function transform(chunk) {
				//~ console.log('>>', cnt, JSON.stringify(chunk.toString()));
				last = chunk;
				cnt++;
			},
			function flush() {
				last = last.toString();
				assert.equal(last.indexOf('いてより深くに入ります。'), last.length-12);
				assert.equal(cnt, 13);
				done();
			}
		));
	});

	it('split lines by "is"', function(done){
		var cnt = 0,
			last,
			rs = fs.createReadStream(__dirname + '/fixtures/test.txt', { encoding: 'utf8' });

		rs
		.pipe(Split(/(is)/))
		.pipe(Through(
			function transform(chunk) {
				//~ console.log('>>', cnt, JSON.stringify(chunk.toString()));
				last = chunk;
				cnt++;
			},
			function flush() {
				last = last.toString();
				assert.equal(last.indexOf('いてより深くに入ります。'), last.length-12);
				assert.equal(cnt, 17);
				done();
			}
		));
	});
});
