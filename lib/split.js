/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict';

var util = require('util'),
	_ = require('underscore'),
	Transform = require('streamss-shim').Transform;

/**
 * Split a stream using a regexp or string based matcher
 *
 * @constructor
 * @param {Object} [options] - Stream Options `{encoding, highWaterMark, decodeStrings, ...}`
 * @param {RegExp|String} options.matcher - RegExp or String use for splitting up the stream. Default=/(\r?\n)/
 * @return {Transform} A transform stream
 */
function Split(options) {
	var self = this;

	if (!(this instanceof Split)) {
		return new Split(options);
	}
	if (options instanceof RegExp || typeof options === 'string') {
		options = { matcher: options };
	}
	this.options = _.extend({
						matcher: /(\r?\n)/, // emits also newlines
						encoding: 'utf8'
					}, options);

	this.buffer = '';

	Transform.call(this, _.omit(this.options, 'matcher'.split(' ')));

	return this;
}

util.inherits(Split, Transform);

/**
 * @private
 * @param {Buffer} buf
 * @param {String} enc
 * @param {Function} done
 */
Split.prototype._transform = function (buf, enc, done) {
	var tmp,
		last,
		self = this;

	self.buffer += buf.toString(self.options.encoding);

	tmp = self.buffer.split(self.options.matcher);
	self.buffer = tmp.pop();

	while(tmp.length>0) {
		self.push(tmp.shift());
	}
	done();
};

/**
 * @private
 * @param {Function} done
 */
Split.prototype._flush = function(done) {
	var self = this;
	self.push(self.buffer);
	done();
};

module.exports = Split;
