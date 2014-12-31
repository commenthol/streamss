/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict';

/*global describe, it*/

var fs = require('fs'),
	assert = require('assert'),
	SplitLine = require('..').SplitLine,
	Through = require('..').Through,
	ReadBuffer = require('..').ReadBuffer,
	WriteArray = require('..').WriteArray;

describe('#ReadBuffer', function(){

	it('without new operator', function(){
		var readBuffer = ReadBuffer();
		assert.ok(readBuffer instanceof ReadBuffer);
	});

	it('push string', function(done){
		var buffer = 'abcd efgh ijkl mnop ';
		var res = buffer.split(' ');
		var cnt = 0;
		res.pop();

		ReadBuffer(
			{ highWaterMark: 5 },
			buffer
		).pipe(Through(
			function transform(chunk) {
				assert.ok(chunk instanceof Buffer);
				assert.equal(chunk.toString(), res[cnt] + ' ');
				cnt++;
			},
			function flush() {
				assert.equal(cnt, res.length);
				done();
			})
		);
	});

	it('push buffer', function(done){
		var buffer = 'abcd efgh ijkl mnop ';
		var res = buffer.split(' ');
		var cnt = 0;
		res.pop();

		ReadBuffer(
			{ highWaterMark: 5 },
			new Buffer(buffer)
		).pipe(Through(
			function transform(chunk) {
				assert.ok(chunk instanceof Buffer);
				assert.equal(chunk.toString(), res[cnt] + ' ');
				cnt++;
			},
			function flush() {
				assert.equal(cnt, res.length);
				done();
			})
		);
	});

	it('push string without options', function(done){
		var buffer = 'abcd efgh ijkl mnop ';

		ReadBuffer(
			buffer
		).pipe(Through(
			function transform(chunk) {
				assert.ok(chunk instanceof Buffer);
				assert.equal(chunk.toString(), buffer);
			},
			function flush() {
				done();
			})
		);
	});

	it('push buffer without options', function(done){
		var buffer = 'abcd efgh ijkl mnop ';

		ReadBuffer(
			new Buffer(buffer)
		).pipe(Through(
			function transform(chunk) {
				assert.ok(chunk instanceof Buffer);
				assert.equal(chunk.toString(), buffer);
			},
			function flush() {
				done();
			})
		);
	});
});
