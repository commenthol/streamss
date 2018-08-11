/**
 * @copyright 2014- commenthol
 * @licence MIT
 */

'use strict'

/* global describe, it */

var fs = require('fs')
var path = require('path')
var assert = require('assert')
var SplitLine = require('..').SplitLine
var ReadBuffer = require('..').ReadBuffer
var Through = require('..').Through
var JsonArray = require('..').JsonArray

describe('#JsonArray', function () {
  it('with new operator', function () {
    var jsonArray = new JsonArray()
    assert.ok(jsonArray instanceof JsonArray)
  })

  it('without new operator', function () {
    var jsonArray = JsonArray()
    assert.ok(jsonArray instanceof JsonArray)
  })

  it('parse empty stream', function (done) {
    var rs = ReadBuffer('[\n\n]')
    rs
      .pipe(SplitLine())
      .pipe(JsonArray())
      .pipe(Through.obj(
        function transform (obj) {},
        function flush () {
          done()
        }
      ))
  })

  it('parse JsonArray', function (done) {
    var cnt = 0
    var last
    var rs = fs.createReadStream(path.resolve(__dirname, 'fixtures/test.json'))

    rs
      .pipe(SplitLine({chomp: true}))
      .pipe(JsonArray())
      .pipe(Through.obj(
        function transform (obj) {
        // ~ console.log(obj)
          last = obj
          cnt++
          assert.equal(typeof obj[cnt], 'object')
        },
        function flush () {
          assert.equal(cnt, 5)
          assert.deepEqual(last, {'5': {'five': {'cinco': 5}}})
          done()
        }
      ))
  })

  it('parse JsonArray and show errors', function (done) {
    var cnt = 0
    var last
    var errs = []
    var rs = fs.createReadStream(path.resolve(__dirname, 'fixtures/test.json'))

    rs
      .pipe(SplitLine({chomp: true}))
      .pipe(JsonArray({error: true}))
      .pipe(Through.obj(
        function transform (obj) {
          if (obj instanceof Error) {
            errs.push(obj)
          } else {
            this.push(obj)
          }
        }
      ))
      .pipe(Through.obj(
        function transform (obj) {
          last = obj
          cnt++
          assert.equal(typeof obj[cnt], 'object')
        },
        function flush () {
          assert.equal(cnt, 5)
          assert.equal(errs.length, 1)
          assert.ok(errs[0].message.match(/Unexpected token B/))
          assert.equal(errs[0].line, 2)
          assert.deepEqual(last, {'5': {'five': {'cinco': 5}}})
          done()
        }
      ))
  })

  it('parse and stringify JsonArray', function (done) {
    var all = ''
    var rs = fs.createReadStream(path.resolve(__dirname, 'fixtures/test.json'))
    var ws = fs.createWriteStream(path.resolve(__dirname, 'fixtures/out.stringify.json'))

    rs
      .pipe(SplitLine({chomp: true}))
      .pipe(JsonArray.parse())
      .pipe(JsonArray.stringify())
      .pipe(Through(
        function transform (line) {
          all += line.toString()
          this.push(line)
        },
        function flush () {
          assert.equal(all,
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
    var all = ''
    var rs = fs.createReadStream(path.resolve(__dirname, 'fixtures/test.json'))
    var ws = fs.createWriteStream(path.resolve(__dirname, 'fixtures/out.stringify.json'))

    rs
      .pipe(SplitLine({chomp: true}))
      .pipe(JsonArray.parse())
      .pipe(JsonArray.stringify({validJson: false}))
      .pipe(Through(
        function transform (line) {
          all += line.toString()
          this.push(line)
        },
        function flush () {
          assert.equal(all,
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
