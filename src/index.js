const core = require('@actions/core')
const github = require('@actions/github')
const conventionalRecommendedBump = require('conventional-recommended-bump')

const git = require('./helpers/git')
const packageJson = require('./helpers/packageJson')
const generateChangelog = require('./helpers/generateChangelog')

async function run() {
  try {
    const commitMessage = core.getInput('git-message')
    const tagPrefix = core.getInput('tag-prefix')
    const preset = core.getInput('preset')
    const outputFile = core.getInput('output-file')

    core.info(`Using "${preset}" preset`)

    conventionalRecommendedBump({ preset }, async(error, recommendation) => {
      core.info(github.context.payload.head_commit);
      if (github.context.payload.head_commit.author.email === "conventional.changelog.action@github.com") {
        core.setFailed("Cannot bump self, reject")
        return false
      }

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

        // Generate the changelog
        await generateChangelog(tagPrefix, preset, jsonPackage, outputFile)

        core.info('Push all changes')

        // Add changed files to git
        await git.add('.')
        await git.commit(commitMessage.replace('{version}', `${tagPrefix}${jsonPackage.version}`))
        await git.createTag(`${tagPrefix}${jsonPackage.version}`)
        await git.push()
      }
    })

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
