/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict'

/* global describe, it */

var assert = require('assert')
var Through = require('..').Through
var ReadBuffer = require('..').ReadBuffer

describe('#ReadBuffer', function () {
  it('without new operator', function () {
    var readBuffer = ReadBuffer()
    assert.ok(readBuffer instanceof ReadBuffer)
  })

  it('push string', function (done) {
    var buffer = 'abcd efgh ijkl mnop '
    var res = buffer.split(' ')
    var cnt = 0
    res.pop()

    ReadBuffer(
      { highWaterMark: 5 },
      buffer
    ).pipe(Through(
      function transform (chunk) {
        assert.ok(chunk instanceof Buffer)
        assert.equal(chunk.toString(), res[cnt] + ' ')
        cnt++
      },
      function flush () {
        assert.equal(cnt, res.length)
        done()
      })
    )
  })

  it('push buffer', function (done) {
    var buffer = 'abcd efgh ijkl mnop '
    var res = buffer.split(' ')
    var cnt = 0
    res.pop()

    ReadBuffer(
      { highWaterMark: 5 },
      Buffer.from(buffer)
    ).pipe(Through(
      function transform (chunk) {
        assert.ok(chunk instanceof Buffer)
        assert.equal(chunk.toString(), res[cnt] + ' ')
        cnt++
      },
      function flush () {
        assert.equal(cnt, res.length)
        done()
      })
    )
  })

  it('push string without options', function (done) {
    var buffer = 'abcd efgh ijkl mnop '

    ReadBuffer(
      buffer
    ).pipe(Through(
      function transform (chunk) {
        assert.ok(chunk instanceof Buffer)
        assert.equal(chunk.toString(), buffer)
      },
      function flush () {
        done()
      })
    )
  })

  it('push buffer without options', function (done) {
    var buffer = 'abcd efgh ijkl mnop '

    ReadBuffer(
      Buffer.from(buffer)
    ).pipe(Through(
      function transform (chunk) {
        assert.ok(chunk instanceof Buffer)
        assert.equal(chunk.toString(), buffer)
      },
      function flush () {
        done()
      })
    )
  })
})
