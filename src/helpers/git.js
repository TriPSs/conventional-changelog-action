const core = require('@actions/core')
const exec = require('@actions/exec')

const { GITHUB_REPOSITORY, GITHUB_REF } = process.env

const branch = GITHUB_REF.replace('refs/heads/', '')

module.exports = new (class Git {

  constructor() {
    const githubToken = core.getInput('github-token', { required: true })

    // Make the Github token secret
    core.setSecret(githubToken)

    // Set config
    this.config('user.name', 'Conventional Changelog Action')
    this.config('user.email', 'conventional.changelog.action@github.com')

    // Update the origin
    this.updateOrigin(`https://x-access-token:${githubToken}@github.com/${GITHUB_REPOSITORY}.git`)

    // Checkout the branch
    this.checkout()
  }

  /**
   * Executes the git command
   *
   * @param command
   * @return {Promise<>}
   */
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
   * @return {Promise<>}
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
   * @return {Promise<>}
   */
  commit = (message, args = []) => (
    this.exec(`commit -m "${message}" ${args.join(' ')}`)
  )

  /**
   * Push all changes
   *
   * @return {Promise<>}
   */
  push = () => (
    this.exec(`push origin ${branch} --follow-tags`)
  )

  /**
   * Checkout branch
   *
   * @return {Promise<>}
   */
  checkout = () => (
    this.exec(`checkout ${branch}`)
  )

  /**
   * Updates the origin remote
   *
   * @param repo
   * @return {Promise<>}
   */
  updateOrigin = repo => this.exec(`remote set-url origin ${repo}`)

  /**
   * Creates git tag
   *
   * @param tag
   * @return {Promise<>}
   */
  createTag = tag => this.exec(`tag -a ${tag} -m "${tag}"`)

})()
