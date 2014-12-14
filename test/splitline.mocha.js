/**
 * @copyright (c) 2014- commenthol
 * @licence MIT
 */

'use strict';

/*global describe, it*/

var fs = require('fs'),
	assert = require('assert'),
	SplitLine = require('..').SplitLine,
	Through = require('..').Through;

describe('#SplitLine', function(){

	it('with new operator', function(){
		var split = new SplitLine();
		assert.ok(split instanceof SplitLine);
	});

	it('without new operator', function(){
		var split = SplitLine();
		assert.ok(split instanceof SplitLine);
	});

	it('count lines', function(done){
		var cnt = 0,
			rs = fs.createReadStream(__dirname + '/test.txt', { encoding: 'utf8', highWaterMark: 42 });

		rs
			.pipe(SplitLine())
			.pipe(Through(
				function transform(chunk) {
					//~ console.log('>>', cnt, JSON.stringify(chunk.toString()));
					cnt++;
				},
				function flush() {
					assert.equal(cnt, 23);
					done();
				}
			));
	});

	it('count lines in chomp mode', function(done){
		var cnt = 0,
			rs = fs.createReadStream(__dirname + '/test.txt', { encoding: 'utf8' });

		rs
			.pipe(SplitLine({chomp: true}))
			.pipe(Through(
				function transform(chunk) {
					//~ console.log('>>', cnt, JSON.stringify(chunk.toString()));
					cnt++;
				},
				function flush() {
					assert.equal(cnt, 13);
					done();
				}
			));
	});

});
