/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict'

/* global describe, it */

const fs = require('fs')
const path = require('path')
const assert = require('assert')
const { SplitLine, ReadArray, Through } = require('..')

describe('#ReadArray', function () {
  it('with new operator', function () {
    const readArray = new ReadArray()
    assert.ok(readArray instanceof ReadArray)
  })

  it('without new operator', function () {
    const readArray = ReadArray()
    assert.ok(readArray instanceof ReadArray)
  })

  it('count length of array of strings', function (done) {
    const array = ['0', '1', '2', '3', '4', '5', '6']
    let cnt = 0

    ReadArray(array.slice())
      .pipe(Through(
        function transform (chunk) {
          cnt++
        },
        function flush () {
          assert.strictEqual(cnt, array.length)
          done()
        })
      )
  })

  it('count length of array of objects', function (done) {
    const array = [0, 1, { two: 2 }, 3, 4, 5, { six: 6 }]
    let cnt = 0

    ReadArray.obj(array.slice())
      .pipe(Through.obj(
        function transform (chunk) {
          cnt++
        },
        function flush () {
          assert.strictEqual(cnt, array.length)
          done()
        })
      )
  })

  it('sort text by lines', function (done) {
    const rs = fs.createReadStream(path.resolve(__dirname, 'fixtures/test.txt'))
    const array = []
    let cnt = 0

    rs
      .pipe(SplitLine())
      .pipe(Through(
        function transform (chunk) {
          array.push(chunk.toString())
        },
        function flush () {
          ReadArray(array.sort().slice())
            .pipe(Through(
              function transform (chunk) {
                cnt++
                assert.strictEqual(chunk instanceof Buffer, true)
              },
              function flush () {
                assert.strictEqual(cnt, array.length)
                done()
              })
            )
        })
      )
  })
})
