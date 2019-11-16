/* eslint key-spacing:0 */

'use strict'

const Through = require('streamss-through')
const { through, throughObj } = Through
const JsonArray = require('./src/JsonArray')
const ReadArray = require('./src/ReadArray')
const { readArrayObj } = ReadArray
const ReadBuffer = require('./src/ReadBuffer')
const Split = require('./src/Split')
const SplitLine = require('./src/SplitLine')
const WriteArray = require('./src/WriteArray')
const { writeArrayObj } = WriteArray

module.exports = {
  Through,
  through,
  throughObj,
  JsonArray,
  ReadArray,
  readArrayObj,
  ReadBuffer,
  Split,
  SplitLine,
  WriteArray,
  writeArrayObj
}
