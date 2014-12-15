/**
 * @copyright (c) 2014- commenthol
 * @licence MIT
 */

'use strict';

var util = require('util'),
	Transform = require('streamss-shim').Transform;

/**
 * Split a stream by newlines
 * @param {Object} options :
 * @param {Boolean} options.chomp : true = do not emit newline 0x0a char
 */
function SplitLine(options) {
	var self = this;
	
	if (!(this instanceof SplitLine)) {
		return new SplitLine(options);
	}

	this.options = options || {};
	this.options.chomp = this.options.chomp ? 0 : 1; // chomp newline
	Transform.call(this, this.options);
	
	this.offset = 0;
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
		if (self.buffer[self.offset] === 0x0a) {
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
