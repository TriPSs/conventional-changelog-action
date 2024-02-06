const fs = require('fs')
const assert = require('assert')
const yaml = require('yaml')

const actionConfig = yaml.parse(fs.readFileSync('./action.yml', 'utf8'))

const {
  OUTPUT_FILE = 'CHANGELOG.md',
  EXPECTED_FILE = 'test-input-file.md',
} = process.env

assert.ok(OUTPUT_FILE, 'Output file is not defined!')
assert.ok(EXPECTED_FILE, 'Expected file is not defined!')

/**
 * Test that the generated logs match the expected output
 */
console.log(`Going to test file "${OUTPUT_FILE}" against expected "${EXPECTED_FILE}"`)

const outputFileContent = fs.readFileSync(OUTPUT_FILE.trim(), 'utf8').split('\n');
assert.ok(outputFileContent, 'Content could not be parsed!')
console.log(`"${OUTPUT_FILE}" has valid content`, outputFileContent)

const expectedFileContent = fs.readFileSync(EXPECTED_FILE.trim(), 'utf8').split('\n');
assert.ok(expectedFileContent, 'Content could not be parsed!')
console.log(`"${EXPECTED_FILE}" has valid content`, expectedFileContent)

const linesToCompare = 11
assert.deepStrictEqual(outputFileContent.slice(linesToCompare * -1), expectedFileContent.slice(linesToCompare * -1), 'Output-file does not contain the expected input-file content')
console.log('The input-file\'s content exists at the end of the generated logs')
