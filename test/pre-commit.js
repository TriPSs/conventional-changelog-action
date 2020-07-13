const fs = require('fs')
const t = require('assert')

exports.preCommit = (props) => {
  const {GITHUB_WORKSPACE} = process.env;

  t.ok(GITHUB_WORKSPACE, 'GITHUB_WORKSPACE should not be empty')
  t.ok(props.tag, 'tag should not be empty')
  t.ok(props.version, 'version should not be empty')

  const body = {
    workspace: GITHUB_WORKSPACE,
    tag: props.tag,
    version: props.version,
    random: Math.random(),
  }

  fs.writeFileSync('pre-commit.test.json', JSON.stringify(body, null, 2))
}
