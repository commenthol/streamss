/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict'

const { Transform } = require('stream')

/**
 * Split a stream using a regexp or string based matcher
 *
 * @constructor
 * @param {Object} [options] - Stream Options `{encoding, highWaterMark, decodeStrings, ...}`
 * @param {RegExp|String} options.matcher - RegExp or String use for splitting up the stream. Default=/(\r?\n)/
 * @return {Transform} A transform stream
 */
class Split extends Transform {
  constructor (options) {
    if (options instanceof RegExp || typeof options === 'string') {
      options = { matcher: options }
    }
    options = Object.assign({
      matcher: /(\r?\n)/, // emits also newlines
      encoding: 'utf8'
    }, options)
    const { matcher, ..._options } = options
    super(_options)
    this.options = options

    this.buffer = ''
  }

  /**
   * @private
   * @param {Buffer} buf
   * @param {String} enc
   * @param {Function} done
   */
  _transform (buf, enc, done) {
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
  _flush (done) {
    this.push(this.buffer)
    done()
  }
}

module.exports = Split
