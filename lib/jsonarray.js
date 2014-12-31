/**
 * A combined line splitting and JSON parse Stream Transformer
 *
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict';

var util = require('util'),
	_ = require('underscore'),
	Transform = require('streamss-shim').Transform;

/**
 * JSON.parse a line and push as object down the pipe.
 *
 * If `stringify: true` is set, a received object is stringified with JSON.stringify
 * The output of the stream will be a valid JSON array.
 *
 * NOTE: Requires that the stream is split beforehand using `Split` or `SplitLine`.
 *
 * @constructor
 * @param {Object} [options] - Stream Options `{encoding, highWaterMark, decodeStrings, ...}`
 * @param {Boolean} options.error - Emit parsing errors as `Error` objects. Default=false.
 * @param {Boolean} options.validJson - Write out a valid json file, which can be parsed as a whole. Default=true.
 * @param {Boolean} options.stringify - Transforms an object into a string using JSON.stringify. Default=false.
 * @return {Transform} A transform stream
 */
function JsonArray(options) {
	if (!(this instanceof JsonArray)) {
		return new JsonArray(options);
	}

	this.options = _.extend({}, options, { objectMode: true });

	this.count = 0;
	this.map = [ '[\n', ',\n', '\n]\n'];
	if (this.options.validJson === false) {
		this.map = [ '', '\n', '\n'];
	}

	if (this.options.stringify) {
		this._transform = this._stringify;
		this._flush = function(done) {
			this.push(this.map[2]);
			setTimeout(function(){
				done();
			},2);
		};
	} else {
		this._transform = this._parse;
	}

	Transform.call(this, _.omit(this.options, 'error validJson stringify'.split(' ')));

	return this;
}

util.inherits(JsonArray, Transform);

/**
 * Parse JSON
 * @private
 * @param {Buffer|String} line
 * @param {String} encoding
 * @param {Function} done
 */
JsonArray.prototype._parse = function (line, end, done) {
	var res;

	this.count += 1;

	line = (line.toString() || '').replace(/,\s*$/, '').trim();
	if (/^(\[|\]|)$/.test(line)) {
		return done();
	}

	try {
		res = JSON.parse(line);
	}
	catch(e) {
		if (this.options.error) {
			e.line = this.count;
			res = e;
		}
		else {
			return done();
		}
	}

	this.push(res);
	done();
};

/**
 * Stringify JSON
 * @private
 * @param {Object} obj
 * @param {String} encoding
 * @param {Function} done
 */
JsonArray.prototype._stringify = function (obj, enc, done) {
	if (! this._first) {
		this._first = true;
		this.push(this.map[0]);
		this.push(JSON.stringify(obj));
	} else {
		this.push(this.map[1] + JSON.stringify(obj));
	}
	done();
};

/**
 * Shortcut for parse
 *
 * @param {Object} [options] - Options
 * @param {Boolean} options.error - Emit parsing errors as `Error` objects. Default=false.
 * @return {Transform} A transform stream
 */
JsonArray.parse = function (options) {
	options = _.extend({}, options, {stringify: false });
	return new JsonArray(options);
};

/**
 * Shortcut for stringify
 *
 * @param {Object} [options] - Options
 * @param {Boolean} options.validJson : Write out a valid json file, which can be parsed as a whole. Default=true.
 * @return {Transform} A transform stream
 */
JsonArray.stringify = function (options) {
	options = _.extend({}, options, { stringify: true });
	return new JsonArray(options);
};

module.exports = JsonArray;
