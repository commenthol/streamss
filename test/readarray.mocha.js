/**
 * @copyright (c) 2014- commenthol
 * @licence MIT
 */

'use strict';

/*global describe, it*/

var fs = require('fs'),
	assert = require('assert'),
	SplitLine = require('..').SplitLine,
	Through = require('..').Through,
	ReadArray = require('..').ReadArray;

describe('#ReadArray', function(){

	it('with new operator', function(){
		var readArray = new ReadArray();
		assert.ok(readArray instanceof ReadArray);
	});

	it('without new operator', function(){
		var readArray = ReadArray();
		assert.ok(readArray instanceof ReadArray);
	});

	it('count length of array of strings', function(done){
		var array = [ "0","1","2","3","4","5","6" ];
		var cnt = 0;

		ReadArray(array.slice())
			.pipe(Through(
				function transform(chunk) {
					cnt++;
				},
				function flush() {
					assert.equal(cnt, array.length);
					done();
				}
			));
	});

	it('count length of array of objects', function(done){
		var array = [ 0,1,{two: 2},3,4,5,{six: 6} ];
		var cnt = 0;

		ReadArray.obj(array.slice())
			.pipe(Through.obj(
				function transform(chunk) {
					cnt++;
				},
				function flush() {
					assert.equal(cnt, array.length);
					done();
				}
			));
	});

	it('sort text by lines', function(done){
		var rs = fs.createReadStream(__dirname + '/test.txt'),
			array = [],
			cnt = 0;

		rs
			.pipe(SplitLine())
			.pipe(Through(
				function transform(chunk) {
					array.push(chunk.toString());
				},
				function flush() {
					ReadArray(array.sort().slice())
						.pipe(Through(
							function transform(chunk) {
								cnt++;
								//~ console.log(chunk.toString())
								assert.equal(chunk instanceof Buffer, true);
							},
							function flush() {
								assert.equal(cnt, array.length);
								done();
							}
						));
				}
			));
	});
});
