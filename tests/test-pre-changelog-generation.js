const fs = require('fs')
const assert = require('assert')

exports.preVersionGeneration = (version) => {
  const { GITHUB_WORKSPACE } = process.env

  assert.ok(GITHUB_WORKSPACE, 'GITHUB_WORKSPACE should not be empty')
  assert.ok(version, 'version should not be empty')

  const newVersion = '1.0.100'

  fs.writeFileSync('pre-changelog-generation.version.test.json', newVersion)

  return newVersion
}

exports.preTagGeneration = (tag) => {
  const { GITHUB_WORKSPACE } = process.env

  assert.ok(GITHUB_WORKSPACE, 'GITHUB_WORKSPACE should not be empty')
  assert.ok(tag, 'tag should not be empty')
  assert.strictEqual(tag, 'v1.0.100')

  const newTag = 'v1.0.100-alpha'

  fs.writeFileSync('pre-changelog-generation.tag.test.json', newTag)

  return newTag
}
