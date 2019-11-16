/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict'

/* global describe, it */

const fs = require('fs')
const path = require('path')
const assert = require('assert')
const { SplitLine, ReadBuffer, Through, JsonArray } = require('..')

describe('#JsonArray', function () {
  it('with new operator', function () {
    const jsonArray = new JsonArray()
    assert.ok(jsonArray instanceof JsonArray)
  })

  it('parse empty stream', function (done) {
    const rs = new ReadBuffer('[\n\n]')
    rs
      .pipe(new SplitLine())
      .pipe(new JsonArray())
      .pipe(Through.throughObj(
        function transform (obj) {},
        function flush () {
          done()
        }
      ))
  })

  it('parse JsonArray', function (done) {
    let cnt = 0
    let last
    const rs = fs.createReadStream(path.resolve(__dirname, 'fixtures/test.json'))

    rs
      .pipe(new SplitLine({ chomp: true }))
      .pipe(new JsonArray())
      .pipe(Through.throughObj(
        function transform (obj) {
        // ~ console.log(obj)
          last = obj
          cnt++
          assert.strictEqual(typeof obj[cnt], 'object')
        },
        function flush () {
          assert.strictEqual(cnt, 5)
          assert.deepStrictEqual(last, { 5: { five: { cinco: 5 } } })
          done()
        }
      ))
  })

  it('parse JsonArray and show errors', function (done) {
    let cnt = 0
    let last
    const errs = []
    const rs = fs.createReadStream(path.resolve(__dirname, 'fixtures/test.json'))

    rs
      .pipe(new SplitLine({ chomp: true }))
      .pipe(new JsonArray({ error: true }))
      .pipe(Through.throughObj(
        function transform (obj) {
          if (obj instanceof Error) {
            errs.push(obj)
          } else {
            this.push(obj)
          }
        }
      ))
      .pipe(Through.throughObj(
        function transform (obj) {
          last = obj
          cnt++
          assert.strictEqual(typeof obj[cnt], 'object')
        },
        function flush () {
          assert.strictEqual(cnt, 5)
          assert.strictEqual(errs.length, 1)
          assert.ok(errs[0].message.match(/Unexpected token B/))
          assert.strictEqual(errs[0].line, 2)
          assert.deepStrictEqual(last, { 5: { five: { cinco: 5 } } })
          done()
        }
      ))
  })

  it('parse and stringify JsonArray', function (done) {
    let all = ''
    const rs = fs.createReadStream(path.resolve(__dirname, 'fixtures/test.json'))
    const ws = fs.createWriteStream(path.resolve(__dirname, 'fixtures/out.stringify.json'))

    rs
      .pipe(new SplitLine({ chomp: true }))
      .pipe(JsonArray.parse())
      .pipe(JsonArray.stringify())
      .pipe(Through.through(
        function transform (line) {
          all += line.toString()
          this.push(line)
        },
        function flush () {
          assert.strictEqual(all,
            '[\n' +
          '{"1":{"one":{"uno":1}}},\n' +
          '{"2":{"two":{"dos":2}}},\n' +
          '{"3":{"three":{"tres":3}}},\n' +
          '{"4":{"four":{"cuatro":4}}},\n' +
          '{"5":{"five":{"cinco":5}}}\n' +
          ']\n'
          )
          done()
        }
      ))
      .pipe(ws)
  })

  it('parse and stringify JsonArray - do not output a valid JSON file', function (done) {
    let all = ''
    const rs = fs.createReadStream(path.resolve(__dirname, 'fixtures/test.json'))
    const ws = fs.createWriteStream(path.resolve(__dirname, 'fixtures/out.stringify.json'))

    rs
      .pipe(new SplitLine({ chomp: true }))
      .pipe(JsonArray.parse())
      .pipe(JsonArray.stringify({ validJson: false }))
      .pipe(Through.through(
        function transform (line) {
          all += line.toString()
          this.push(line)
        },
        function flush () {
          assert.strictEqual(all,
            '{"1":{"one":{"uno":1}}}\n' +
          '{"2":{"two":{"dos":2}}}\n' +
          '{"3":{"three":{"tres":3}}}\n' +
          '{"4":{"four":{"cuatro":4}}}\n' +
          '{"5":{"five":{"cinco":5}}}\n'
          )
          done()
        }
      ))
      .pipe(ws)
  })
})
