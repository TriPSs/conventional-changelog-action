const core = require('@actions/core')
const github = require('@actions/github')
const conventionalChangelog = require('conventional-changelog')
const conventionalRecommendedBump = require('conventional-recommended-bump')

const git = require('./helpers/git')
const packageJson = require('./helpers/packageJson')

async function run() {
  try {
    const githubToken = core.getInput('github-token', { required: true })
    const commitMessage = core.getInput('git-message')
    const preset = core.getInput('preset')

    // Make the Github token secret
    core.setSecret(githubToken)


    // conventionalChangelog({
    //   preset: 'angular',
    // }).pipe(process.stdout)

    conventionalRecommendedBump({ preset }, (error, recommendation) => {
      if (error) {
        core.setFailed(error.message)
        
      } else {
        const packageJson = packageJson.bump(
          packageJson.get(),
          recommendation.releaseType,
        )

        core.info(`New version: ${packageJson.version}`)
      }
    })

    // Get the current version
    // const currentVersion = require('./package.json').version

    // core.debug(`Current version: ${currentVersion}`);

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
