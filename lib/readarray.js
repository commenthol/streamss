/**
 * @copyright (c) 2014- commenthol
 * @licence MIT
 */

'use strict';

var util = require('util'),
	extend = util._extend,
	Readable = require('streamss-shim').Readable;

/**
 * 
 */
function ReadArray(options, array) {
	if (!(this instanceof ReadArray)) {
		return new ReadArray(options);
	}

	if (Array.isArray(options)) {
		array = options;
		options = {};
	}

	options = extend({}, options);
	Readable.call(this, options);

	this._array = array || [];
	this._cnt = this._array.length;

	return this;
}

util.inherits(ReadArray, Readable);

ReadArray.prototype._read = function(size) {
	while ((this._cnt--) > 0) {
		if (!this.push(this._array.shift())) {
			return;
		}
	}
	this.push(null); // end of stream
};

/**
 * shortcut for objectmode
 */
ReadArray.obj = function (options, array) {
	if (Array.isArray(options)) {
		array = options;
		options = {};
	}
	options = extend({ objectMode: true }, options);
	return new ReadArray(options, array);
};

module.exports = ReadArray;
