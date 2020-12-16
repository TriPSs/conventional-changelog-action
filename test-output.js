const fs = require('fs')
const assert = require('assert')
const objectPath = require('object-path')
const yaml = require('yaml')
const toml = require('@iarna/toml')

const actionConfig = yaml.parse(fs.readFileSync('./action.yml', 'utf8'))

const {
  FILES = actionConfig.inputs['version-file'].default,
  EXPECTED_VERSION_PATH = actionConfig.inputs['version-path'].default,
  EXPECTED_VERSION = actionConfig.inputs['fallback-version'].default,
} = process.env

assert.ok(FILES, 'Files not defined!')

/**
 * Test if all the files are updated
 */
FILES.split(',').map((file, index) => {
  console.log(`Going to test file "${file}"`)

  const fileContent = fs.readFileSync(file.trim(), 'utf8')
  const fileExtension = file.split('.').pop()

  assert.ok(fileExtension, 'No file extension found!')

  let parsedContent = null

  switch (fileExtension.toLowerCase()) {
    case 'json':
      parsedContent = JSON.parse(fileContent)
      break

    case 'yaml':
    case 'yml':
      parsedContent = yaml.parse(fileContent)
      break

    case 'toml':
      parsedContent = toml.parse(fileContent)
      break

    default:
      assert.fail('File extension not supported!')
  }

  console.log(`"${file}" has a valid extension "${fileExtension.toLowerCase()}"`)

  assert.ok(parsedContent, 'Content could not be parsed!')

  console.log(`"${file}" has valid content`, parsedContent)

  const newVersionInFile = objectPath.get(parsedContent, EXPECTED_VERSION_PATH, null)

  const expectedVersions = EXPECTED_VERSION.split(',')
  const expectedVersion = expectedVersions.length > 0
    ? expectedVersions[index]
    : expectedVersions

  console.log(`"${file}" check if "${newVersionInFile}" matches what is expected "${expectedVersion.trim()}"`)

  assert.strictEqual(newVersionInFile, expectedVersion.trim(), 'Version does not match what is expected')
})

