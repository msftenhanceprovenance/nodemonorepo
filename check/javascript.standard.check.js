'use strict'
const main = require('./lib/test-spawn')

test('JavaScript Code Style: StandardJS', () => {
  main({
    defaultExecutable: 'standard',
    envMiddleName: 'STANDARDJS'
  })
})
