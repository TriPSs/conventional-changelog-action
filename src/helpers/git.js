const exec = require('@actions/exec')

const git = command => exec.exec(`git ${command}`)

module.exports = {

  /**
   * Add a file to commit
   *
   * @param file
   * @returns {*}
   */
  add: file => git(`add ${file}`),

  /**
   * Commit all changes
   *
   * @param message
   * @param skipBuild
   * @param args
   *
   * @returns {*}
   */
  commit: (message, skipBuild = true, args = []) => (
    git(`commit -m "${message} ${skipBuild ? '[skip ci]' : ''}" ${args.join(' ')}`)
  ),

  /**
   * Push all changes
   *
   * @param branch
   * @param origin
   * @param args
   *
   * @returns {*}
   */
  push: (branch, origin, args = []) => (
    git(`push ${args.join(' ')} ${origin} ${branch}`, { silent: true })
  ),

  tag: {

    getCurrent: () => git('describe --tags --abbrev=0').toString().trim(),

    getSha: (tag) => git(`rev-list -n 1 ${tag}`).toString().trim(),

    latest: () => git('describe --tags $(git rev-list --tags --max-count=1)').toString().trim(),

    create: (tag) => git(`tag -a ${tag} -m "${tag}"`),

    update: (tag) => git(`tag -fa ${tag} -m "${tag}"`),

  },
}
