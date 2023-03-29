const assert = require('assert')

const {
  TAG,
  EXPECTED_TAG,
} = process.env

console.log(`Got tag "${TAG}"`)

assert.strictEqual(TAG, EXPECTED_TAG, 'Tag does not match what is expected')
