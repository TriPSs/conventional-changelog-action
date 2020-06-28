const core = require('@actions/core')
const conventionalRecommendedBump = require('conventional-recommended-bump')
const path = require('path')

const getVersioning = require('./version')
const git = require('./helpers/git')
const changelog = require('./helpers/generateChangelog')

async function run() {
  try {
    const gitCommitMessage = core.getInput('git-message')
    const gitUserName = core.getInput('git-user-name')
    const gitUserEmail = core.getInput('git-user-email')
    const tagPrefix = core.getInput('tag-prefix')
    const preset = core.getInput('preset')
    const outputFile = core.getInput('output-file')
    const releaseCount = core.getInput('release-count')
    const versionFile = core.getInput('version-file')
    const versionPath = core.getInput('version-path')
    const skipVersionFile = core.getInput('skip-version-file').toLowerCase() === 'true'
    const skipTag = core.getInput('skip-tag').toLowerCase() === 'true'
    const skipCommit = core.getInput('skip-commit').toLowerCase() === 'true'
    const skipEmptyRelease = core.getInput('skip-on-empty').toLowerCase() === 'true'

    core.info(`Using "${preset}" preset`)
    core.info(`Using "${gitCommitMessage}" as commit message`)
    core.info(`Using "${gitUserName}" as git user.name`)
    core.info(`Using "${gitUserEmail}" as git user.email`)
    core.info(`Using "${releaseCount}" release count`)
    core.info(`Using "${versionFile}" as version file`)
    core.info(`Using "${versionPath}" as version path`)
    core.info(`Using "${tagPrefix}" as tag prefix`)
    core.info(`Using "${outputFile}" as output file`)

    core.info(`Skipping empty releases is "${skipEmptyRelease ? 'enabled' : 'disabled'}"`)
    core.info(`Skipping the update of the version file is "${skipVersionFile ? 'enabled' : 'disabled'}"`)
    core.info(`Skipping the creation of the GIT tag is "${skipTag ? 'enabled' : 'disabled'}"`)

    core.info('Pull to make sure we have the full git history')
    await git.pull()

    conventionalRecommendedBump({ preset, tagPrefix }, async(error, recommendation) => {
      if (error) {
        core.setFailed(error.message)
        return
      }

      core.info(`Recommended release type: ${recommendation.releaseType}`)

      // If we have a reason also log it
      if (recommendation.reason) {
        core.info(`Because: ${recommendation.reason}`)
      }

      // If skipVersionFile is true we use GIT to determine the new version
      const fileExtension = skipVersionFile
        ? 'git'
        : versionFile.split('.').pop()

      const versioning = getVersioning(fileExtension)

      // File type not supported
      if (versioning === null) {
        throw new Error(`File extension "${fileExtension}" from file "${versionFile}" is not supported`)
      }

      versioning.init(path.resolve(versionFile), versionPath)

      // Bump the version in the package.json
      versioning.bump(
        recommendation.releaseType,
      )

      // Generate the string changelog
      const stringChangelog = await changelog.generateStringChangelog(tagPrefix, preset, versioning.newVersion, 1)
      core.info('Changelog generated')
      core.info(stringChangelog)

      // Removes the version number from the changelog
      const cleanChangelog = stringChangelog.split('\n').slice(3).join('\n').trim()

      if (skipEmptyRelease && cleanChangelog === '') {
        core.info('Generated changelog is empty and skip-on-empty has been activated so we skip this step')
        core.setOutput('skipped', 'true')
        return
      }

      core.info(`New version: ${versioning.newVersion}`)

      // If output file === 'false' we don't write it to file
      if (outputFile !== 'false') {
        // Generate the changelog
        await changelog.generateFileChangelog(tagPrefix, preset, versioning.newVersion, outputFile, releaseCount)
      }

      const gitTag = `${tagPrefix}${versioning.newVersion}`

      if (!skipCommit) {
        // Add changed files to git
        await git.add('.')
        await git.commit(gitCommitMessage.replace('{version}', gitTag))
      }

      if (!skipTag) {
        // Only create the tag if skip tag is false
        await git.createTag(gitTag)
      }

      if (!skipCommit || !skipTag) {
        core.info('Push all changes')
        await git.push()
      }

      // Set outputs so other actions (for example actions/create-release) can use it
      core.setOutput('changelog', stringChangelog)
      core.setOutput('clean_changelog', cleanChangelog)
      core.setOutput('version', versioning.newVersion)

      // Only add the output tag if we did not skip it
      if (!skipTag) {
        core.setOutput('tag', gitTag)
      }

      core.setOutput('skipped', 'false')
    })

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
