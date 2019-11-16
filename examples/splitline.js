const { resolve } = require('path')
const { SplitLine, Through } = require('..')

require('fs').createReadStream(resolve(__dirname, '../test/test.txt'))
  .pipe(SplitLine({ matcher: 'i', chomp: true, encoding: 'utf8' }))
  .pipe(Through(
    { decodeStrings: false },
    function (string) {
      this.push('>>>' + string + '<<<\n')
    }
  ))
  .pipe(process.stdout)
