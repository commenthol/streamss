const { ReadBuffer, WriteArray } = require('..')

const str = 'line 1\nline 2\nline 3\nline 4'

ReadBuffer(
  { highWaterMark: 7, encoding: 'utf8' },
  str
).pipe(WriteArray(
  { decodeStrings: false },
  function (err, arr) {
    err = null
    console.log(arr)
    // > [ 'line 1\n', 'line 2\n', 'line 3\n', 'line 4' ]
  })
)
