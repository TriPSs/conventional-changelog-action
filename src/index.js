const core = require('@actions/core')
const github = require('@actions/github')
const conventionalChangelog = require('conventional-changelog')
const conventionalRecommendedBump = require('conventional-recommended-bump')
const fs = require('fs')

const git = require('./helpers/git')
const packageJson = require('./helpers/packageJson')

async function run() {
  try {
    const githubToken = core.getInput('github-token', { required: true })
    const commitMessage = core.getInput('git-message')
    const tagPrefix = core.getInput('tag-prefix')
    const preset = core.getInput('preset')

    // Make the Github token secret
    core.setSecret(githubToken)

    core.info(`Using "${preset}" preset`)

    conventionalRecommendedBump({ preset }, (error, recommendation) => {
      if (error) {
        core.setFailed(error.message)

      } else {
        core.info(`Recommended release type: ${recommendation.releaseType}`)

        const jsonPackage = packageJson.bump(
          packageJson.get(),
          recommendation.releaseType,
        )

        core.info(`New version: ${jsonPackage.version}`)

        const changelogStream = conventionalChangelog({
            preset,
            releaseCount: 5,
          },
          {
            version: jsonPackage.version,
            currentTag: `${tagPrefix}${jsonPackage.version}`,
            tagPrefix,
          },
        )

        changelogStream
          .pipe(fs.createWriteStream('CHANGELOG.md'))
          .on('finish', () => {
            // Add changed files to git
            git.add('.')
            git.commit(commitMessage.replace('{version}', jsonPackage.version))
            git.push()
            
          })

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
