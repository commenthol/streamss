/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict'

/* global describe, it */

const fs = require('fs')
const path = require('path')
const assert = require('assert')
const { Split, Through } = require('..')

describe('#Split', function () {
  it('with new operator', function () {
    const split = new Split()
    assert.ok(split instanceof Split)
  })

  it('count lines', function (testDone) {
    let cnt = 0
    let last
    const rs = fs.createReadStream(path.resolve(__dirname, 'fixtures/test.txt'), {
      encoding: 'utf8',
      highWaterMark: 42
    })

    rs
      .pipe(new Split())
      .pipe(Through.through(
        function transform (chunk) {
        // ~ console.log('>>', cnt, JSON.stringify(chunk.toString()));
          last = chunk
          this.push(chunk)
          cnt++
        },
        function flush () {
        }
      ))
      .pipe(fs.createWriteStream(path.resolve(__dirname, 'fixtures/out.txt')))
      .on('close', function () {
        last = last.toString()
        assert.strictEqual(last.indexOf('いてより深くに入ります。'), last.length - 12)
        assert.strictEqual(cnt, 35)
        testDone()
      })
  })

  it('count lines in chomp mode', function (done) {
    let cnt = 0
    let last
    const rs = fs.createReadStream(path.resolve(__dirname, 'fixtures/test.txt'), {
      encoding: 'utf8'
    })

    rs
      .pipe(new Split({ matcher: /\r?\n/ }))
      .pipe(Through.through(
        function transform (chunk) {
        // ~ console.log('>>', cnt, JSON.stringify(chunk.toString()));
          last = chunk
          cnt++
        },
        function flush () {
          last = last.toString()
          assert.strictEqual(last.indexOf('いてより深くに入ります。'), last.length - 12)
          assert.strictEqual(cnt, 13)
          done()
        }
      ))
  })

  it('split lines by "is"', function (done) {
    let cnt = 0
    let last
    const rs = fs.createReadStream(path.resolve(__dirname, 'fixtures/test.txt'), {
      encoding: 'utf8'
    })

    rs
      .pipe(new Split(/(is)/))
      .pipe(Through.through(
        function transform (chunk) {
        // ~ console.log('>>', cnt, JSON.stringify(chunk.toString()));
          last = chunk
          cnt++
        },
        function flush () {
          last = last.toString()
          assert.strictEqual(last.indexOf('いてより深くに入ります。'), last.length - 12)
          assert.strictEqual(cnt, 17)
          done()
        }
      ))
  })
})
