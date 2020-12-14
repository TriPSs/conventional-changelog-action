const fs = require('fs')
const t = require('assert')

exports.preVersionGeneration = (version) => {
  const { GITHUB_WORKSPACE } = process.env

  t.ok(GITHUB_WORKSPACE, 'GITHUB_WORKSPACE should not be empty')
  t.ok(version, 'version should not be empty')

  const newVersion = '1.0.100'

  fs.writeFileSync('pre-changelog-generation.version.test.json', newVersion)

  return newVersion
}

exports.preTagGeneration = (tag) => {
  const { GITHUB_WORKSPACE } = process.env

  t.ok(GITHUB_WORKSPACE, 'GITHUB_WORKSPACE should not be empty')
  t.ok(tag, 'tag should not be empty')
  t.strictEqual(tag, 'v1.0.100')

  const newTag = 'v1.0.100-alpha'

  fs.writeFileSync('pre-changelog-generation.tag.test.json', newTag)

  return newTag
}
