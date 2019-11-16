/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict'

const { Writable } = require('stream')

/**
 * Write stream into an Array
 *
 * @constructor
 * @param {Object} [options] - Stream Options `{encoding, highWaterMark, decodeStrings, objectMode, ...}`
 * @param {Function} callback - callback function `function({Error}err, {Array}array)` called on `finish` or `error` event.
 * @return {Writable} A writable stream
 */
class WriteArray extends Writable {
  constructor (options, callback) {
    if (typeof options === 'function') {
      callback = options
      options = {}
    }

    options = Object.assign({}, options)
    super(options)

    this.array = []
    this.callback = callback

    this.on('pipe', (src) => {
      src.on('error', (err) => {
        this.callback(err)
      })
    })

    this.on('finish', () => {
      this.callback(null, this.array)
    })
  }

  /**
   * @private
   * @param {Buffer|String} chunk
   * @param {String encoding
   * @param {Function} done
   */
  _write (chunk, encoding, done) {
    this.array.push(chunk)
    done()
  }

  /**
   * Shortcut for ObjectMode
   *
   * @param {Object} [options] - Stream Options `{ encoding, highWaterMark, decodeStrings, ...}`
   * @param {Function} callback - callback function called on `finish` or `error` event. Form is `function(err, array)`.
   * @return {Writable} A writable stream
   */
  static writeArrayObj (options, callback) {
    // istanbul ignore else
    if (typeof options === 'function') {
      callback = options
      options = {}
    }
    options = Object.assign({}, options, { objectMode: true })
    return new WriteArray(options, callback)
  }
}

module.exports = WriteArray
