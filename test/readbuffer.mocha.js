/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict'

/* global describe, it */

const assert = require('assert')
const { ReadBuffer, Through } = require('..')

describe('#ReadBuffer', function () {
  it('without new operator', function () {
    const readBuffer = ReadBuffer()
    assert.ok(readBuffer instanceof ReadBuffer)
  })

  it('push string', function (done) {
    const buffer = 'abcd efgh ijkl mnop '
    const res = buffer.split(' ')
    let cnt = 0
    res.pop()

    ReadBuffer(
      { highWaterMark: 5 },
      buffer
    ).pipe(Through(
      function transform (chunk) {
        assert.ok(chunk instanceof Buffer)
        assert.strictEqual(chunk.toString(), res[cnt] + ' ')
        cnt++
      },
      function flush () {
        assert.strictEqual(cnt, res.length)
        done()
      })
    )
  })

  it('push buffer', function (done) {
    const buffer = 'abcd efgh ijkl mnop '
    const res = buffer.split(' ')
    let cnt = 0
    res.pop()

    ReadBuffer(
      { highWaterMark: 5 },
      Buffer.from(buffer)
    ).pipe(Through(
      function transform (chunk) {
        assert.ok(chunk instanceof Buffer)
        assert.strictEqual(chunk.toString(), res[cnt] + ' ')
        cnt++
      },
      function flush () {
        assert.strictEqual(cnt, res.length)
        done()
      })
    )
  })

  it('push string without options', function (done) {
    const buffer = 'abcd efgh ijkl mnop '

    ReadBuffer(
      buffer
    ).pipe(Through(
      function transform (chunk) {
        assert.ok(chunk instanceof Buffer)
        assert.strictEqual(chunk.toString(), buffer)
      },
      function flush () {
        done()
      })
    )
  })

  it('push buffer without options', function (done) {
    const buffer = 'abcd efgh ijkl mnop '

    ReadBuffer(
      Buffer.from(buffer)
    ).pipe(Through(
      function transform (chunk) {
        assert.ok(chunk instanceof Buffer)
        assert.strictEqual(chunk.toString(), buffer)
      },
      function flush () {
        done()
      })
    )
  })
})
