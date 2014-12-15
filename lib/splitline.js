/**
 * @copyright (c) 2014- commenthol
 * @licence MIT
 */

'use strict';

var util = require('util'),
	Transform = require('streamss-shim').Transform;

/**
 * Split a stream by a single char
 *
 * @param {Object} [options] : Stream Options `{ encoding, highWaterMark, decodeStrings, ...}`
 * @param {Boolean} options.chomp : Do not emit the matching char. Default=true
 * @param {String} options.matcher : String use for splitting up the stream. Default=0x0a
 * @return {Transform} A transform stream
 */
function SplitLine(options) {
	var self = this;

	if (!(this instanceof SplitLine)) {
		return new SplitLine(options);
	}

	this.options = options || {};
	Transform.call(this, this.options);

	this.offset = 0;
	this.options.matcher = (typeof this.options.matcher === 'string' ? 
							this.options.matcher.charCodeAt(0) : 
							this.options.matcher || 0x0a);
	this.options.chomp = this.options.chomp ? 0 : 1; // chomp newline
	this.buffer = new Buffer(0);	// this.unshift cannot be used if options.highWaterMark is quite low!
									// That's why an own buffer is required here :/
	return this;
}

util.inherits(SplitLine, Transform);

var cnt = 0;

SplitLine.prototype._transform = function (chunk, enc, done) {
	var tmp,
		self = this;

	self.buffer = Buffer.concat([self.buffer, chunk]);

	while(self.offset < self.buffer.length) {
		if (self.buffer[self.offset] === self.options.matcher) {
			self.push(self.buffer.slice(0, self.offset + self.options.chomp));
			self.buffer = self.buffer.slice(self.offset + 1);
			self.offset = 0;
		} else {
			self.offset += 1;
		}
	}
	done();
};

SplitLine.prototype._flush = function(done) {
	this.push(this.buffer);
	done();
};

module.exports = SplitLine;
