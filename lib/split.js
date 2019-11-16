/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict'

const util = require('util')
const _omit = require('lodash.omit')
const Transform = require('stream').Transform

/**
 * Split a stream using a regexp or string based matcher
 *
 * @constructor
 * @param {Object} [options] - Stream Options `{encoding, highWaterMark, decodeStrings, ...}`
 * @param {RegExp|String} options.matcher - RegExp or String use for splitting up the stream. Default=/(\r?\n)/
 * @return {Transform} A transform stream
 */
function Split (options) {
  if (!(this instanceof Split)) {
    return new Split(options)
  }
  if (options instanceof RegExp || typeof options === 'string') {
    options = { matcher: options }
  }
  this.options = Object.assign({
    matcher: /(\r?\n)/, // emits also newlines
    encoding: 'utf8'
  }, options)

  this.buffer = ''

  Transform.call(this, _omit(this.options, ['matcher']))

  return this
}

util.inherits(Split, Transform)

/**
 * @private
 * @param {Buffer} buf
 * @param {String} enc
 * @param {Function} done
 */
Split.prototype._transform = function (buf, enc, done) {
  this.buffer += buf.toString(this.options.encoding)

  const tmp = this.buffer.split(this.options.matcher)
  this.buffer = tmp.pop()

  while (tmp.length > 0) {
    this.push(tmp.shift())
  }
  done()
}

/**
 * @private
 * @param {Function} done
 */
Split.prototype._flush = function (done) {
  this.push(this.buffer)
  done()
}

module.exports = Split
