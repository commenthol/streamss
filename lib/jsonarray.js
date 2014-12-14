/**
 * A combined line splitting and JSON parse Stream Transformer
 * 
 * @copyright (c) 2014 commenthol
 * @licence MIT
 */

'use strict';

require('./shim');

var util = require('util'),
	extend = util._extend,
	Transform = require('stream').Transform;

function JsonArray(options) {
	if (!(this instanceof JsonArray)) {
		return new JsonArray(options);
	}

	options = extend({objectMode: true }, options);
	Transform.call(this, options); 
	this.options = options;

	if (this.options.stringify) {
		this._transform = this.stringify;
		this._flush = function(done) {
			this.push('\n]');
			setTimeout(function(){
				done();
			},2);
		};
	} else {
		this._transform = this.parse;
	}

	return this;
}

util.inherits(JsonArray, Transform);

JsonArray.prototype.parse = function (line, end, done) {
	var res;

	line = (line.toString() || '').replace(/,\s*$/, '').trim();
	if (/^(\[|\]|)$/.test(line)) {
		return done();
	}
	
	try {
		res = JSON.parse(line);
	}
	catch(e) {
		if (this.options.error) {
			res = new Error('error parsing: "' + line + '" : ' + e.toString());
		}
		else {
			return done();
		}
	}

	this.push(res);
	done();
};

JsonArray.prototype.stringify = function (obj, enc, done) {
	if (! this._first) {
		this._first = true;
		this.push('[\n');
		this.push(JSON.stringify(obj));
	} else {
		this.push(',\n' + JSON.stringify(obj));
	}
	done();
};

module.exports = JsonArray;
