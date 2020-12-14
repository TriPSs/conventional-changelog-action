const fs = require('fs')
const t = require('assert')

exports.preChangelogGeneration = (props) => {
  const { GITHUB_WORKSPACE } = process.env

  t.ok(GITHUB_WORKSPACE, 'GITHUB_WORKSPACE should not be empty')
  t.ok(props.tag, 'tag should not be empty')
  t.ok(props.version, 'version should not be empty')

  const newVersion = '1.0.100'
  const newTag = 'v1.0.100'

  const body = {
    version: newVersion,
    tag: newTag,
  }

  fs.writeFileSync('pre-changelog-generation.test.json', JSON.stringify(body, null, 2))

  return body
}
