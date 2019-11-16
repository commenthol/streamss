/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict'

/* global describe, it */

const assert = require('assert')
const { ReadArray, WriteArray, Through } = require('..')

describe('#WriteArray', function () {
  it('with new operator', function () {
    const writeArray = new WriteArray()
    assert.ok(writeArray instanceof WriteArray)
  })

  it('without new operator', function () {
    const writeArray = WriteArray()
    assert.ok(writeArray instanceof WriteArray)
  })

  it('read and write array of buffers', function (testDone) {
    const array = ['0', '1', '2', '3', '4', '5', '6']

    ReadArray(
      array.slice()
    )
      .pipe(WriteArray(
        function (err, data) {
          assert.ok(!err, '' + err)
          assert.strictEqual(data.length, array.length)
          testDone()
        })
      )
  })

  it('read and write array of strings', function (testDone) {
    const array = ['0', '1', '2', '3', '4', '5', '6']

    ReadArray(
      { encoding: 'utf8' },
      array.slice()
    )
      .pipe(WriteArray(
        { decodeStrings: false },
        function (err, data) {
        // ~ console.log(data);
          assert.ok(!err, '' + err)
          assert.strictEqual(data.length, array.length)
          testDone()
        })
      )
  })

  it('read and write array of objects', function (testDone) {
    const array = [0, 1, { two: 2 }, 3, 4, 5, { six: 6 }]

    ReadArray.obj(
      array.slice()
    )
      .pipe(WriteArray.obj(
        function (err, data) {
        // ~ console.log(data);
          assert.ok(!err, '' + err)
          assert.deepStrictEqual(data, array)
          testDone()
        })
      )
  })

  it('read and write array of objects throws error', function (testDone) {
    const array = [0, 1, { two: 2 }, 3, 4, 5, { six: 6 }]

    ReadArray.obj(
      array.slice()
    )
      .pipe(Through.obj(
        function (data) {
          this.push(data)
          // ~ console.log(data)
          if (data === 5) {
            this.emit('error', new Error('bamm'))
          }
        }
      ))
      .pipe(Through.obj(
        { passError: true },
        function (data) {
          this.push(data)
        }
      ))
      .pipe(WriteArray.obj(
        function (err, data) {
        // ~ console.log(err, data);
          assert.strictEqual(err.message, 'bamm')
          testDone()
        })
      )
  })
})
