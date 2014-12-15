/**
 * A combined line splitting and JSON parse Stream Transformer
 * 
 * @copyright (c) 2014 commenthol
 * @licence MIT
 */

'use strict';

var util = require('util'),
	extend = util._extend,
	Transform = require('streamss-shim').Transform;

function JsonArray(options) {
	if (!(this instanceof JsonArray)) {
		return new JsonArray(options);
	}

	this.options = extend(options || {}, { objectMode: true });

	if (this.options.stringify) {
		this._transform = this._stringify;
		this._flush = function(done) {
			this.push('\n]');
			setTimeout(function(){
				done();
			},2);
		};
	} else {
		this._transform = this._parse;
	}

	Transform.call(this, this.options); 

	return this;
}

util.inherits(JsonArray, Transform);

JsonArray.prototype._parse = function (line, end, done) {
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

JsonArray.prototype._stringify = function (obj, enc, done) {
	if (! this._first) {
		this._first = true;
		this.push('[\n');
		this.push(JSON.stringify(obj));
	} else {
		this.push(',\n' + JSON.stringify(obj));
	}
	done();
};

/**
 * shortcut for parse
 */
JsonArray.parse = function (options) {
	return new JsonArray(options);
};

/**
 * shortcut for stringify
 */
JsonArray.stringify = function (options) {
	options = extend(options || {}, { stringify: true });
	return new JsonArray(options);
};


module.exports = JsonArray;
