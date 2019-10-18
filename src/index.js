const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
  try {
    const githubToken = core.getInput('github-token', { required: true })
    const commitMessage = core.getInput('git-message')
    const octokit = new github.GitHub(githubToken);

    // Make the Github token secret
    // core.setSecret(githubToken)

    // console.log()

    core.info(`Current version: ${JSON.stringify(octokit.context.repo)}`)

    // Get the current version
    // const currentVersion = require('./package.json').version

    // core.debug(`Current version: ${currentVersion}`);

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
