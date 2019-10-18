const core = require('@actions/core')
const github = require('@actions/github')

const git = require('./helpers/git')

async function run() {
  try {
    const githubToken = core.getInput('github-token', { required: true })
    const commitMessage = core.getInput('git-message')

    // Make the Github token secret
    core.setSecret(githubToken)

    core.info(`The previous tag was: ${await git.tag.latest()} `)

    // Get the current version
    // const currentVersion = require('./package.json').version

    // core.debug(`Current version: ${currentVersion}`);

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
