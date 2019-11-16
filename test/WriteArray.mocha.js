/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict'

/* global describe, it */

const assert = require('assert')
const { ReadArray, readArrayObj, WriteArray, writeArrayObj, throughObj } = require('..')

describe('#WriteArray', function () {
  it('with new operator', function () {
    const writeArray = new WriteArray()
    assert.ok(writeArray instanceof WriteArray)
  })

  it('read and write array of buffers', function (testDone) {
    const array = ['0', '1', '2', '3', '4', '5', '6']

    new ReadArray(
      array.slice()
    )
      .pipe(new WriteArray(
        function (err, data) {
          assert.ok(!err, '' + err)
          assert.strictEqual(data.length, array.length)
          testDone()
        })
      )
  })

  it('read and write array of strings', function (testDone) {
    const array = ['0', '1', '2', '3', '4', '5', '6']

    new ReadArray(
      { encoding: 'utf8' },
      array.slice()
    )
      .pipe(new WriteArray(
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

    readArrayObj(
      array.slice()
    )
      .pipe(writeArrayObj(
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

    readArrayObj(
      array.slice()
    )
      .pipe(throughObj(
        function (data) {
          this.push(data)
          // ~ console.log(data)
          if (data === 5) {
            this.emit('error', new Error('bamm'))
          }
        }
      ))
      .pipe(throughObj(
        { passError: true },
        function (data) {
          this.push(data)
        }
      ))
      .pipe(writeArrayObj(
        function (err, data) {
        // ~ console.log(err, data);
          assert.strictEqual(err.message, 'bamm')
          testDone()
        })
      )
  })
})
