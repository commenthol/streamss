/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict'

const { Readable } = require('stream')

/**
 * Read from an Array and push into stream.
 *
 * Takes care on pausing to push to the stream if pipe is saturated.
 *
 * @constructor
 * @param {Object} [options] - Stream Options `{encoding, highWaterMark, objectMode, ...}`
 * @param {Array} array - array to push down as stream (If array is an array of objects set `objectMode:true` or use `ReadArray.obj`)
 * @return {Readable} A readable stream
 */
class ReadArray extends Readable {
  constructor (options, array) {
    if (Array.isArray(options)) {
      array = options
      options = {}
    }

    options = Object.assign({}, options)
    super(options)

    this._array = array || []
    this._cnt = this._array.length
  }

  /**
   * @private
   * @param {Number} size
   */
  _read (size) {
    while ((this._cnt--) > 0) {
    // istanbul ignore if
      if (!this.push(this._array.shift())) {
        return
      }
    }
    this.push(null) // end of stream
  }

  /**
   * Shortcut for ObjectMode
   *
   * @param {Object} [options] - Stream Options `{encoding, highWaterMark, decodeStrings, ...}`
   * @param {Array} array - array to push down as stream
   * @return {Readable} A readable stream
   */
  static readArrayObj (options, array) {
    // istanbul ignore else
    if (Array.isArray(options)) {
      array = options
      options = {}
    }
    options = Object.assign({}, options, { objectMode: true })
    return new ReadArray(options, array)
  }
}

module.exports = ReadArray
