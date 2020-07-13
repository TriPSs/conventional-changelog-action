const fs = require('fs')
const path = require('path')

exports.preCommit = (props) => {
  const body = {
    workspace: props.workspace,
    tag: props.tag,
    version: props.version,
    random: Math.random(),
  }

  const dest = path.resolve(props.workspace, 'pre-commit.test.json')

  fs.writeFileSync(dest, JSON.stringify(body, null, 2))
}
