const path = require('path')
const { Split, Through } = require('..')

require('fs').createReadStream(path.resolve(__dirname, '../test/test.txt'))
  .pipe(Split({ matcher: ' are ', encoding: 'utf8' }))
  .pipe(Through(
    { decodeStrings: false },
    function (string) {
      this.push('>>>' + string + '<<<\n')
    }
  ))
  .pipe(process.stdout)
