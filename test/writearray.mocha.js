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
	ReadArray = require('..').ReadArray,
	WriteArray = require('..').WriteArray;

describe('#WriteArray', function(){

	it('with new operator', function(){
		var writeArray = new WriteArray();
		assert.ok(writeArray instanceof WriteArray);
	});

	it('without new operator', function(){
		var writeArray = WriteArray();
		assert.ok(writeArray instanceof WriteArray);
	});

	it('read and write array of strings', function(testDone){
		var array = [ "0","1","2","3","4","5","6" ];

		ReadArray(
			{ encoding: 'utf8' },
			array.slice()
		)
		.pipe(WriteArray(
			{ decodeStrings: false },
			function(err, data){
				//~ console.log(data);
				assert.equal(data.length, array.length);
				testDone();
			})
		);
	});

	it('read and write array of objects', function(testDone){
		var array = [ 0,1,{two: 2},3,4,5,{six: 6} ];

		ReadArray.obj(
			array.slice()
		)
		.pipe(WriteArray.obj(
			function(err, data){
				//~ console.log(data);
				assert.deepEqual(data, array);
				testDone();
			})
		);
	});

	it('read and write array of objects throws error', function(testDone){
		var array = [ 0,1,{two: 2},3,4,5,{six: 6} ];

		ReadArray.obj(
			array.slice()
		)
		.pipe(Through.obj(
			function(data) {
				this.push(data);
				//~ console.log(data)
				if (data === 5) {
					this.emit('error', new Error('bamm'));
				}
			}
		))
		.pipe(Through.obj(
			{ passError: true },
			function(data) {
				this.push(data);
			}
		))
		.pipe(WriteArray.obj(
			function(err, data){
				//~ console.log(err, data);
				assert.equal(err.message, 'bamm');
				testDone();
			})
		);
	});

});
