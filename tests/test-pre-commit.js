const fs = require('fs')
const assert = require('assert')

exports.preCommit = (props) => {
  const {GITHUB_WORKSPACE} = process.env;

  assert.ok(GITHUB_WORKSPACE, 'GITHUB_WORKSPACE should not be empty')
  assert.ok(props.tag, 'tag should not be empty')
  assert.ok(props.version, 'version should not be empty')

  const body = {
    workspace: GITHUB_WORKSPACE,
    tag: props.tag,
    version: props.version,
    random: Math.random(),
  }

  fs.writeFileSync('pre-commit.test.json', JSON.stringify(body, null, 2))
}
