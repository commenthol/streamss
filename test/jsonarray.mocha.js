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
	JsonArray = require('..').JsonArray;

describe('#JsonArray', function(){

	it('with new operator', function(){
		var jsonArray = new JsonArray();
		assert.ok(jsonArray instanceof JsonArray);
	});

	it('without new operator', function(){
		var jsonArray = JsonArray();
		assert.ok(jsonArray instanceof JsonArray);
	});

	it('parse JsonArray', function(done){
		var cnt = 0,
			last,
			rs = fs.createReadStream(__dirname + '/test.json');

		rs
			.pipe(SplitLine({chomp: true}))
			.pipe(JsonArray())
			.pipe(Through.obj(
				function transform(obj) {
					//~ console.log(obj)
					last = obj;
					cnt++;
					assert.equal(typeof obj[cnt], 'object');
				},
				function flush() {
					assert.equal(cnt, 5);
					assert.deepEqual(last, {"5":{"five":{"cinco":5}}});
					done();
				}
			));
	});

	it('parse JsonArray and show errors', function(done){
		var cnt = 0,
			last,
			rs = fs.createReadStream(__dirname + '/test.json');

		rs
			.pipe(SplitLine({chomp: true}))
			.pipe(JsonArray({error: true}))
			.pipe(Through.obj(
				function transform(obj) {
					if (obj instanceof Error) {
						//~ console.error(obj.message);
					}
					else {
						this.push(obj);
					}
				}
			))
			.pipe(Through.obj(
				function transform(obj) {
					last = obj;
					cnt++;
					assert.equal(typeof obj[cnt], 'object');
				},
				function flush() {
					assert.equal(cnt, 5);
					assert.deepEqual(last, {"5":{"five":{"cinco":5}}});
					done();
				}
			));
	});

	it('parse and stringify JsonArray', function(done){
		var all = '',
			rs = fs.createReadStream(__dirname + '/test.json'),
			ws = fs.createWriteStream(__dirname + '/test-stringify.json');

		rs
			.pipe(SplitLine({chomp: true}))
			.pipe(JsonArray())
			.pipe(JsonArray({stringify: true}))
			.pipe(Through(
				function transform(line) {
					all += line.toString();
					this.push(line);
				},
				function flush() {
					assert.equal(all,
						'[\n'+
						'{"1":{"one":{"uno":1}}},\n'+
						'{"2":{"two":{"dos":2}}},\n'+
						'{"3":{"three":{"tres":3}}},\n'+
						'{"4":{"four":{"cuatro":4}}},\n'+
						'{"5":{"five":{"cinco":5}}}\n'+
						']'
					);
					done();
				}
			))
			.pipe(ws);
	});


});
