const core = require('@actions/core')
const exec = require('@actions/exec')

const { GITHUB_REPOSITORY } = process.env

module.exports = new (class Git {

  constructor() {
    const githubToken = core.getInput('github-token', { required: true })

    // Make the Github token secret
    core.setSecret(githubToken)

    this.config('user.name', 'Conventional Changelog Action')
    this.config('user.email', 'conventional.changelog.action@github.com')

    this.updateOrigin(`https://${githubToken}@github.com/${GITHUB_REPOSITORY}.git`)
  }

  exec = command => new Promise(async(resolve, reject) => {
    let myOutput = ''
    let myError = ''

    const options = {
      listeners: {
        stdout: (data) => {
          myOutput += data.toString()
        },
        stderr: (data) => {
          myError += data.toString()
        },
      },
    }

    try {
      await exec.exec(`git ${command}`, null, options)

      resolve(myOutput)

    } catch (e) {
      reject(e)
    }
  })

  /**
   * Set a git config prop
   *
   * @param prop
   * @param value
   * @returns {*}
   */
  config = (prop, value) => this.exec(`config ${prop} "${value}"`)

  /**
   * Add a file to commit
   *
   * @param file
   * @returns {*}
   */
  add = file => this.exec(`add ${file}`)

  /**
   * Commit all changes
   *
   * @param message
   * @param args
   *
   * @returns {*}
   */
  commit = (message, args = []) => (
    this.exec(`commit -m "${message}" ${args.join(' ')}`)
  )

  /**
   * Push all changes
   *
   * @param branch
   * @param origin
   * @param args
   *
   * @returns {*}
   */
  push = (branch, origin, args = []) => (
    this.exec(`push ${args.join(' ')} ${origin} ${branch}`)
  )

  /**
   * Updates the origin remote
   *
   * @param repo
   * @returns {*}
   */
  updateOrigin = (repo) => this.exec(`remote set-url origin ${repo}`)

})()
//
// module.exports = {
//
//
//
//   tag: {
//
//     getCurrent: () => git('describe --tags --abbrev=0').toString().trim(),
//
//     getSha: (tag) => git(`rev-list -n 1 ${tag}`).toString().trim(),
//
//     latest: () => git('describe --tags $(git rev-list --tags --max-count=1)').toString().trim(),
//
//     create: (tag) => git(`tag -a ${tag} -m "${tag}"`),
//
//     update: (tag) => git(`tag -fa ${tag} -m "${tag}"`),
//
//   },
// }
