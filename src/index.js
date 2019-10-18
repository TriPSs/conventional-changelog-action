const core = require('@actions/core')
const github = require('@actions/github')
const conventionalChangelog = require('conventional-changelog')
const conventionalRecommendedBump = require('conventional-recommended-bump')

const git = require('./helpers/git')

async function run() {
  try {
    const githubToken = core.getInput('github-token', { required: true })
    const commitMessage = core.getInput('git-message')

    // Make the Github token secret
    core.setSecret(githubToken)

    // conventionalChangelog({
    //   preset: 'angular',
    // }).pipe(process.stdout)


    conventionalRecommendedBump({
      preset: `angular`,
    }, (error, recommendation) => {
      console.log(recommendation.releaseType) // 'major'

      core.info(`[recommendation.releaseType]: ${recommendation.releaseType}`)
    })

    // Get the current version
    // const currentVersion = require('./package.json').version

    // core.debug(`Current version: ${currentVersion}`);

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
