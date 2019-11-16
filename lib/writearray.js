/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict'

const util = require('util')
const { Writable } = require('stream')

/**
 * Write stream into an Array
 *
 * @constructor
 * @param {Object} [options] - Stream Options `{encoding, highWaterMark, decodeStrings, objectMode, ...}`
 * @param {Function} callback - callback function `function({Error}err, {Array}array)` called on `finish` or `error` event.
 * @return {Writable} A writable stream
 */
function WriteArray (options, callback) {
  const self = this

  if (!(this instanceof WriteArray)) {
    return new WriteArray(options, callback)
  }

  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  options = Object.assign({}, options)
  Writable.call(self, options)

  self.array = []
  self.callback = callback

  self.on('pipe', function (src) {
    src.on('error', function (err) {
      self.callback(err)
    })
  })

  self.on('finish', function () {
    self.callback(null, self.array)
  })

  return self
}

util.inherits(WriteArray, Writable)

/**
 * @private
 * @param {Buffer|String} chunk
 * @param {String encoding
 * @param {Function} done
 */
WriteArray.prototype._write = function (chunk, encoding, done) {
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
WriteArray.obj = function (options, callback) {
  // istanbul ignore else
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  options = Object.assign({}, options, { objectMode: true })
  return new WriteArray(options, callback)
}

module.exports = WriteArray
