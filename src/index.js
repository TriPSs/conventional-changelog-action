const core = require('@actions/core')
const conventionalRecommendedBump = require('conventional-recommended-bump')

const git = require('./helpers/git')
const packageJson = require('./helpers/packageJson')
const changelog = require('./helpers/generateChangelog')

async function run() {
  try {
    const commitMessage = core.getInput('git-message')
    const tagPrefix = core.getInput('tag-prefix')
    const preset = core.getInput('preset')
    const outputFile = core.getInput('output-file')
    const releaseCount = core.getInput('release-count')
    const packageJsonToUse = core.getInput('package-json')
    const skipOnEmptyRelease = core.getInput('skip-on-empty').toLowerCase() === 'true'

    core.info(`Using "${preset}" preset`)
    core.info(`Using "${commitMessage}" as commit message`)
    core.info(`Using "${releaseCount}" release count`)
    core.info(`Using "${packageJsonToUse}"`)
    core.info(`Using "${tagPrefix}" as tag prefix`)
    core.info(`Using "${outputFile}" as output file`)

    core.info('Pull to make sure we have the full git history')
    await git.pull()

    conventionalRecommendedBump({ preset, tagPrefix }, async (error, recommendation) => {
      if (error) {
        core.setFailed(error.message)
        return
      }

      core.info(`Recommended release type: ${recommendation.releaseType}`)
      recommendation.reason && core.info(`because: ${recommendation.reason}`)

      // Bump the version in the package.json
      const jsonPackage = packageJson.bump(
        packageJson.get(),
        recommendation.releaseType,
      )

      const stringChangelog = await changelog.generateStringChangelog(tagPrefix, preset, jsonPackage, 1)
      core.info('Changelog generated')
      core.info(stringChangelog)

      const cleanChangelog = stringChangelog.split('\n').slice(3).join('\n').trim()

      if (skipOnEmptyRelease && cleanChangelog === '') {
        core.info('Generated changelog is empty and skip-on-empty has been activated so we skip this step')
        core.setOutput('skipped', 'true')
        return
      }

      // Update the package.json file
      packageJson.update(jsonPackage)

      core.info(`New version: ${jsonPackage.version}`)

      // If output file === 'false' we don't write it to file
      if (outputFile !== 'false') {
        // Generate the changelog
        await changelog.generateFileChangelog(tagPrefix, preset, jsonPackage, outputFile, releaseCount)
      }

      core.info('Push all changes')

      // Add changed files to git
      await git.add('.')
      await git.commit(commitMessage.replace('{version}', `${tagPrefix}${jsonPackage.version}`))
      await git.createTag(`${tagPrefix}${jsonPackage.version}`)
      await git.push()

      // Set outputs so other actions (for example actions/create-release) can use it
      core.setOutput('changelog', stringChangelog)
      // Removes the version number from the changelog
      core.setOutput('clean_changelog', cleanChangelog)
      core.setOutput('version', jsonPackage.version)
      core.setOutput('tag', `${tagPrefix}${jsonPackage.version}`)
      core.setOutput('skipped', 'false')
    })

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
