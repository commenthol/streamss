/**
 * @copyright (c) 2014- commenthol
 * @licence MIT
 */

'use strict';

var util = require('util'),
	extend = util._extend,
	Transform = require('streamss-shim').Transform;

/**
 * Split a stream by newlines
 * @param {Object} options :
 * @param {Boolean} options.chomp : true = do not emit newline 0x0a char
 * @param {RegExp} options.matcher : regex to match 
 */
function Split(options) {
	var self = this;
	
	if (!(this instanceof Split)) {
		return new Split(options);
	}
	if (options instanceof RegExp || typeof options === 'string') {
		options = { matcher: options };
	}
	this.options = extend({
						matcher: /(\r?\n)/, // emits also newlines
						encoding: 'utf8'
					}, options);

	this.buffer = '';

	Transform.call(this, this.options);

	return this;
}

util.inherits(Split, Transform);

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

Split.prototype._flush = function(done) {
	var self = this;
	self.push(self.buffer);
	done();
};

module.exports = Split;
