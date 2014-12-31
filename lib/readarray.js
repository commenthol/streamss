/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict';

var util = require('util'),
	_ = require('underscore'),
	Readable = require('streamss-shim').Readable;

/**
 * Read from an Array and push into stream.
 *
 * Takes care on pausing to push to the stream if pipe is saturated.
 *
 * @constructor
 * @param {Object} [options] : Stream Options `{encoding, highWaterMark, decodeStrings, objectMode, ...}`
 * @param {Array} array : array to push down as stream
 * @return {Readable} A readable stream
 */
function ReadArray(options, array) {
	if (!(this instanceof ReadArray)) {
		return new ReadArray(options, array);
	}

	if (Array.isArray(options)) {
		array = options;
		options = {};
	}

	options = _.extend({}, options);
	Readable.call(this, options);

	this._array = array || [];
	this._cnt = this._array.length;

	return this;
}

util.inherits(ReadArray, Readable);

/**
 * @private
 * @param {Number} size
 */
ReadArray.prototype._read = function(size) {
	while ((this._cnt--) > 0) {
		if (!this.push(this._array.shift())) {
			return;
		}
	}
	this.push(null); // end of stream
};

/**
 * Shortcut for ObjectMode
 *
 * @param {Object} [options] : Stream Options `{ encoding, highWaterMark, decodeStrings, ...}`
 * @param {Array} array : array to push down as stream
 * @return {Readable} A readable stream
 */
ReadArray.obj = function (options, array) {
	if (Array.isArray(options)) {
		array = options;
		options = {};
	}
	options = _.extend(options || {}, { objectMode: true });
	return new ReadArray(options, array);
};

module.exports = ReadArray;
