/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict'

const { Readable } = require('stream')

/**
 * Read from an Buffer/ String and push into stream.
 *
 * Takes care on pausing to push to the stream if pipe is saturated.
 * Pushes only size bytes if `highWaterMark` is set.
 *
 * @constructor
 * @param {Object} [options] - Stream Options `{encoding, highWaterMark, ...}`
 * @param {Buffer|String} buffer - buffer to push down as stream
 * @return {Readable} A readable stream
 */
class ReadBuffer extends Readable {
  constructor (options, buffer) {
    if (typeof options === 'string' || options instanceof Buffer) {
      buffer = options
      options = {}
    }

    options = Object.assign({}, options)
    super(options)

    this.buffer = (typeof buffer === 'string' ? Buffer.from(buffer) : buffer)
  }

  /**
   * @private
   * @param {Number} size
   */
  _read (size) {
    let buf
    while (this.buffer.length > 0) {
      size = (size > this.buffer.length ? this.buffer.length : size)
      buf = this.buffer.slice(0, size)
      this.buffer = this.buffer.slice(size, this.buffer.length)
      if (!this.push(buf)) {
        return
      }
    }
    this.push(null)
  }
}

module.exports = ReadBuffer
