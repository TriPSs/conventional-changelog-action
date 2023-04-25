const core = require('@actions/core')
const exec = require('@actions/exec')
const assert = require('assert')

const { GITHUB_REPOSITORY, ENV } = process.env

module.exports = new (class Git {

  commandsRun = []

  init = async() => {
    const githubToken = core.getInput('github-token')

    // Make the Github token secret
    core.setSecret(githubToken)

    const gitUserName = core.getInput('git-user-name')
    const gitUserEmail = core.getInput('git-user-email')
    const gitUrl = core.getInput('git-url')

    // if the env is dont-use-git then we mock exec as we are testing a workflow
    if (ENV === 'dont-use-git') {
      this.exec = (command) => {
        const fullCommand = `git ${command}`

        console.log(`Skipping "${fullCommand}" because of test env`)

        if (!fullCommand.includes(`git remote set-url origin`) && !fullCommand.includes(`git config --local --add http.https://github.com/.extraheader`)) {
          this.commandsRun.push(fullCommand)
        }
      }
    }

    // Set config
    await this.config('user.name', gitUserName)
    await this.config('user.email', gitUserEmail)

    // Update the origin
    if (githubToken) {
      await this.updateGitHubOrigin(githubToken, `${gitUrl}/${GITHUB_REPOSITORY}.git`)
      await this.addGithubTokenAuthorization(githubToken)
    }
  }

  /**
   * Executes the git command
   *
   * @param command
   * @return {Promise<>}
   */
  exec = (command) => new Promise(async (resolve, reject) => {
    let execOutput = ''

    const options = {
      listeners: {
        stdout: (data) => {
          execOutput += data.toString()
        },
      },
    }

    const exitCode = await exec.exec(`git ${command}`, null, options)

    if (exitCode === 0) {
      resolve(execOutput)

    } else {
      reject(`Command "git ${command}" exited with code ${exitCode}.`)
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
  add = (file) => this.exec(`add ${file}`)

  /**
   * Commit all changes
   *
   * @param message
   *
   * @return {Promise<>}
   */
  commit = (message) => this.exec(`commit -m "${message}"`)

  /**
   * Pull the full history
   *
   * @return {Promise<>}
   */
  pull = async() => {
    const args = ['pull']

    // Check if the repo is unshallow
    if (await this.isShallow()) {
      args.push('--unshallow')
    }

    args.push('--tags')
    args.push(core.getInput('git-pull-method'))

    return this.exec(args.join(' '))
  }

  /**
   * fetch
   *
   * @return {Promise<>}
   */
  fetch = (depth) => {
    if (depth == "" || depth == null) {
      return this.exec(`fetch --depth 1`)
    } else {
      return this.exec(`fetch --depth ${depth}`)
    }
  }

  /**
   * Push all changes
   *
   * @return {Promise<>}
   */
  push = (branch, forcePush) => {
    const args = ['push']
    args.push(`origin ${branch}`)
    if (forcePush) {
      args.push(`--force-with-lease`)
    }
    return this.exec(args.join(' '))
  }

  /**
   * Check if the repo is shallow
   *
   * @return {Promise<boolean>}
   */
  isShallow = async() => {
    if (ENV === 'dont-use-git') {
      return false
    }

    const isShallow = await this.exec('rev-parse --is-shallow-repository')

    return isShallow.trim().replace('\n', '') === 'true'
  }

    /**
   * Check if the repo is shallow
   *
   * @return {Promise<boolean>}
   */
  hasChanges = async() => {
    let execOutput = ''

    const options = {
      ignoreReturnCode : true,
      failOnStdErr: true,
      listeners: {
        stdout: (data) => {
          execOutput += data.toString()
        },
      },
    }

    const exitCode = await exec.exec(`git diff --no-ext-diff --quiet --exit-code`, null, options)

    if (execOutput.trim()){
      throw `Unable to determine git status: ${execOutput.trim()}`
    }

    return exitCode !== 0
  } 

  /**
   * Updates the origin remote
   *
   * @param repo
   * @return {Promise<>}
   */
  updateGitHubOrigin = async(githubToken, gitUrl) => {
    if (githubToken) {
      const username = `x-access-token`
      return this.exec(`remote set-url origin https://${username}:${githubToken}@${gitUrl}`)
    } else {
      return this.exec(`remote set-url origin https://${gitUrl}`)
    }
  }

  addGithubTokenAuthorization = async(githubToken) => {
    const username = `x-access-token`
    const configKey = `http.https://github.com/.extraheader`
    const globalConfig = false
    const configExists = await this.configExists(configKey, globalConfig)
    if (configExists){
      core.warning(`Removing authorization header ${configKey}`)
      await this.configUnset(configKey, globalConfig)
    }

    const credentials = Buffer.from(`${username}:${githubToken}`, `utf8`).toString('base64')
    core.setSecret(credentials)
    const configValue = `AUTHORIZATION: basic ${credentials}`
    const add = true
    await this.configSet(configKey, configValue, globalConfig, add)
  }

  removeGithubTokenAuthorization = async()=> {
    const configKey = `http.https://github.com/.extraheader`
    const globalConfig = false
    const configExists = await this.configExists(configKey, globalConfig)    
    if (configExists){
      core.warning(`Removing authorization header ${configKey}`)
      await this.configUnset(configKey, globalConfig)
    }
  }
  
  /**
   * Set git config
   *
   * @param configKey
   * @param globalConfig
   * @return {Promise<>}
   */
  configSet = (configKey, configValue, globalConfig, add) => this.exec(`config ${globalConfig ? '--global' : '--local'}${add ? ' --add': ''} ${configKey} "${configValue}"`)
  
  /**
   * Escape regex for use in git command line
   *
   * @param value
   * @return {string}
   */
  regexEscape = (value) => value.replace(/[^a-zA-Z0-9_]/g, x => { return `\\${x}` })

  /**
   * Check if git config exists
   *
   * @param configKey
   * @param globalConfig
   * @return {Promise<>}
   */
  configExists = async(configKey, globalConfig) => {
    let execOutput = ''

    const options = {
      ignoreReturnCode : true,
      failOnStdErr: false,
      listeners: {
        stdout: (data) => {
          execOutput += data.toString()
        },
      },
    }

    const escapeConfigKey = this.regexEscape(configKey)
    const exitCode = await exec.exec(`git config ${globalConfig ? '--global' : '--local'} --name-only --get-regexp ${escapeConfigKey}`, null, options)

    if (exitCode != 0 && exitCode != 1){
      throw `Unable to determine git status: ${execOutput.trim()}`
    }

    return exitCode === 0
  } 

  /**
   * Check if git config exists
   *
   * @param configKey
   * @param globalConfig
   * @return {Promise<>}
   */
  configUnset = (configKey, globalConfig) => this.exec(`config ${globalConfig ? '--global' : '--local'} --unset-all ${configKey}`)

  /**
   * Creates git branch
   *
   * @param tag
   * @return {Promise<>}
   */
  createBranch = (branch) => this.exec(`branch ${branch}`)

  /**
   * Creates git tag
   *
   * @param tag
   * @return {Promise<>}
   */
  createTag = (tag) => this.exec(`tag -af ${tag} -m "${tag}"`)

  /**
   * Validates the commands run
   */
  testHistory = async(branch, releaseBranch) => {
    if (ENV === 'dont-use-git') {
      const { EXPECTED_TAG, SKIPPED_COMMIT, EXPECTED_NO_PUSH, SKIPPED_RELEASE_BRANCH, SKIPPED_TAG, SKIPPED_PULL, SKIP_CI } = process.env

      const expectedCommands = [
        'git config user.name "Conventional Changelog Action"',
        'git config user.email "conventional.changelog.action@github.com"',
        'git config --local --unset-all http.https://github.com/.extraheader',
      ]

      if (!SKIPPED_PULL) {
        expectedCommands.push('git fetch --depth 1')
        expectedCommands.push('git pull --tags --ff-only')
      }

      if (!SKIPPED_COMMIT) {
        expectedCommands.push('git add .')

        if (SKIP_CI === 'false') {
          expectedCommands.push(`git commit -m "chore(release): ${EXPECTED_TAG}"`)

        } else {
          expectedCommands.push(`git commit -m "chore(release): ${EXPECTED_TAG} [skip ci]"`)
        }
      }

      if(!(SKIPPED_RELEASE_BRANCH == "" || SKIPPED_RELEASE_BRANCH == null) && !SKIPPED_RELEASE_BRANCH) {
        expectedCommands.push(`git branch ${releaseBranch}`)
      } 

      if(!SKIPPED_TAG) {
        expectedCommands.push(`git tag -af ${EXPECTED_TAG} -m "${EXPECTED_TAG}"`)
      } 

      if (!EXPECTED_NO_PUSH) {
        expectedCommands.push(`git push origin ${branch}`)
      }

      if(!SKIPPED_TAG) {
        expectedCommands.push(`git push origin ${EXPECTED_TAG}`)
      }

      if(!(SKIPPED_RELEASE_BRANCH == "" || SKIPPED_RELEASE_BRANCH == null) && !SKIPPED_RELEASE_BRANCH) {
        expectedCommands.push(`git push origin ${releaseBranch}`)
      }       

      assert.deepStrictEqual(
        this.commandsRun,
        expectedCommands,
      )
    }
  }

})()
