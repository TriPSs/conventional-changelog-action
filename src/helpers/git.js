const core = require('@actions/core')
const exec = require('@actions/exec')

const { GITHUB_REPOSITORY, GITHUB_REF, ENV } = process.env

const branch = GITHUB_REF.replace('refs/heads/', '')

module.exports = new (class Git {

  constructor() {
    const githubToken = core.getInput('github-token', { required: true })

    // Make the Github token secret
    core.setSecret(githubToken)

    const gitUserName = core.getInput('git-user-name')
    const gitUserEmail = core.getInput('git-user-email')

    // if the env is dont-use-git then we mock exec as we are testing a workflow locally
    if (ENV === 'dont-use-git') {
      this.exec = (command) => {
        console.log(`Skipping "git ${command}" because of test env`)
      }
    }

    // Set config
    this.config('user.name', gitUserName)
    this.config('user.email', gitUserEmail)

    // Update the origin
    this.updateOrigin(`https://x-access-token:${githubToken}@github.com/${GITHUB_REPOSITORY}.git`)
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
   * Pull the full history
   *
   * @return {Promise<>}
   */
  pull = () => (
    
    this.exec(`fetch --depth 1; git pull --tags ${core.getInput('git-pull-method')}`)
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
