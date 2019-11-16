/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict'

/* global describe, it */

const fs = require('fs')
const path = require('path')
const assert = require('assert')
const { SplitLine, Through } = require('..')

const testTxt = path.resolve(__dirname, 'fixtures/test.txt')

describe('#SplitLine', function () {
  it('with new operator', function () {
    const split = new SplitLine()
    assert.ok(split instanceof SplitLine)
  })

  it('without new operator', function () {
    const split = SplitLine()
    assert.ok(split instanceof SplitLine)
  })

  it('count lines', function (done) {
    let cnt = 0
    const rs = fs.createReadStream(testTxt, { encoding: 'utf8', highWaterMark: 42 })

    rs
      .pipe(SplitLine())
      .pipe(Through(
        function transform (chunk) {
        // ~ console.log('>>', cnt, JSON.stringify(chunk.toString()));
          cnt++
        },
        function flush () {
          assert.strictEqual(cnt, 23)
          done()
        }
      ))
  })

  it('count lines in chomp mode', function (done) {
    let cnt = 0
    const rs = fs.createReadStream(testTxt, { encoding: 'utf8' })

    rs
      .pipe(SplitLine({ chomp: true }))
      .pipe(Through(
        function transform (chunk) {
        // ~ console.log('>>', cnt, JSON.stringify(chunk.toString()));
          cnt++
        },
        function flush () {
          assert.strictEqual(cnt, 13)
          done()
        }
      ))
  })

  it('split by "i"', function (done) {
    let cnt = 0
    const rs = fs.createReadStream(testTxt, { encoding: 'utf8' })

    rs
      .pipe(SplitLine({ matcher: 'i--' }))
      .pipe(Through(
        function transform (chunk) {
        // ~ console.log('>>', cnt, JSON.stringify(chunk.toString()));
          cnt++
        },
        function flush () {
          assert.strictEqual(cnt, 48)
          done()
        }
      ))
  })

  it('split by charCode 65', function (done) {
    let cnt = 0
    const rs = fs.createReadStream(testTxt, { encoding: 'utf8' })

    rs
      .pipe(SplitLine({ matcher: 97 }))
      .pipe(Through(
        function transform (chunk) {
        // ~ console.log('>>', cnt, JSON.stringify(chunk.toString()));
          cnt++
        },
        function flush () {
          assert.strictEqual(cnt, 69)
          done()
        }
      ))
  })
})
