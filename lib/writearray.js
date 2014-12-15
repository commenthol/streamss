/**
 * @copyright (c) 2014- commenthol
 * @licence MIT
 */

'use strict';

var util = require('util'),
	extend = util._extend,
	Writable = require('streamss-shim').Writable;

/**
 * Write stream into an Array
 *
 * @param {Object} [options] : Stream Options `{ encoding, highWaterMark, decodeStrings, objectMode, ...}`
 * @param {Function} callback : callback function called on `finish` or `error` event. Form is `function(err, array)`.
 * @return {Writable} A writable stream
 */
function WriteArray(options, callback) {
	var self = this;

	if (!(this instanceof WriteArray)) {
		return new WriteArray(options, callback);
	}

	if (typeof options === 'function') {
		callback = options;
		options = {};
	}

	options = extend({}, options);
	Writable.call(self, options);

	self.array = [];
	self.callback = callback;

	self.on('pipe', function(src){
		src.on('error', function(err){
			self.callback(err);
		});
	});

	self.on('finish', function(){
		self.callback(null, self.array);
	});

	return self;
}

util.inherits(WriteArray, Writable);

WriteArray.prototype._write = function(chunk, encoding, done) {
	this.array.push(chunk);
	done();
};

/**
 * Shortcut for ObjectMode
 *
 * @param {Object} [options] : Stream Options `{ encoding, highWaterMark, decodeStrings, ...}`
 * @param {Function} callback : callback function called on `finish` or `error` event. Form is `function(err, array)`.
 * @return {Writable} A writable stream
 */
WriteArray.obj = function (options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}
	options = extend(options || {}, { objectMode: true });
	return new WriteArray(options, callback);
};

module.exports = WriteArray;