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

    core.info(`Using "${preset}" preset`)

    conventionalRecommendedBump({ preset }, (error, recommendation) => {
      if (error) {
        core.setFailed(error.message)

      } else {
        core.info(`Recommended release type: ${recommendation.releaseType}`)

        // Bump the version in the package.json
        const jsonPackage = packageJson.bump(
          packageJson.get(),
          recommendation.releaseType,
        )

        // Update the package.json file
        packageJson.update(jsonPackage)

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
          .on('finish', async() => {
            core.info('Push all changes')
            // Add changed files to git
            await git.add('.')
            await git.commit(commitMessage.replace('{version}', jsonPackage.version))
            await git.push()
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
