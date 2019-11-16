/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict'

const util = require('util')
const _omit = require('lodash.omit')
const Transform = require('stream').Transform

/**
 * Split a stream by a single char
 *
 * @constructor
 * @param {Object} [options] - Stream Options `{encoding, highWaterMark, decodeStrings, ...}`
 * @param {Boolean} options.chomp - Do not emit the matching char. Default=false
 * @param {String} options.matcher - String use for splitting up the stream. Default=0x0a
 * @return {Transform} A transform stream
 */
function SplitLine (options) {
  if (!(this instanceof SplitLine)) {
    return new SplitLine(options)
  }

  this.options = options || {}
  Transform.call(this, _omit(this.options, ['matcher', 'chomp']))

  this.offset = 0
  this.options.matcher = (typeof this.options.matcher === 'string'
    ? this.options.matcher.charCodeAt(0)
    : this.options.matcher || 0x0a)
  this.options.chomp = (this.options.chomp === true ? 0 : 1) // chomp newline
  this.buffer = Buffer.from('') // this.unshift cannot be used if options.highWaterMark is quite low!
  // That's why an own buffer is required here :/
  return this
}

util.inherits(SplitLine, Transform)

/**
 * @private
 * @param {Buffer} chunk
 * @param {String} enc
 * @param {Function} done
 */
SplitLine.prototype._transform = function (chunk, enc, done) {
  this.buffer = Buffer.concat([this.buffer, chunk])

  while (this.offset < this.buffer.length) {
    if (this.buffer[this.offset] === this.options.matcher) {
      this.push(this.buffer.slice(0, this.offset + this.options.chomp))
      this.buffer = this.buffer.slice(this.offset + 1)
      this.offset = 0
    } else {
      this.offset += 1
    }
  }
  done()
}

/**
 * @private
 * @param {Function} done
 */
SplitLine.prototype._flush = function (done) {
  this.push(this.buffer)
  done()
}

module.exports = SplitLine
