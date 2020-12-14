const core = require('@actions/core')
const conventionalRecommendedBump = require('conventional-recommended-bump')
const path = require('path')

const getVersioning = require('./version')
const git = require('./helpers/git')
const changelog = require('./helpers/generateChangelog')
const resolve = require('path').resolve

async function handleVersioningByExtension(ext, file, versionPath, releaseType) {
  const versioning = getVersioning(ext)

  // File type not supported
  if (versioning === null) {
    throw new Error(`File extension "${ext}" from file "${file}" is not supported`)
  }

  versioning.init(path.resolve(file), versionPath)

  // Bump the version in the package.json
  await versioning.bump(releaseType)

  return versioning
}

async function run() {
  try {
    const gitCommitMessage = core.getInput('git-message')
    const gitUserName = core.getInput('git-user-name')
    const gitUserEmail = core.getInput('git-user-email')
    const tagPrefix = core.getInput('tag-prefix')
    const preset = !core.getInput('config-file-path') ? core.getInput('preset') : ''
    const preCommit = core.getInput('pre-commit')
    const outputFile = core.getInput('output-file')
    const releaseCount = core.getInput('release-count')
    const versionFile = core.getInput('version-file')
    const versionPath = core.getInput('version-path')
    const skipVersionFile = core.getInput('skip-version-file').toLowerCase() === 'true'
    const skipCommit = core.getInput('skip-commit').toLowerCase() === 'true'
    const skipEmptyRelease = core.getInput('skip-on-empty').toLowerCase() === 'true'
    const conventionalConfigFile = core.getInput('config-file-path')
    const preChangelogGeneration = core.getInput('pre-changelog-generation')

    core.info(`Using "${preset}" preset`)
    core.info(`Using "${gitCommitMessage}" as commit message`)
    core.info(`Using "${gitUserName}" as git user.name`)
    core.info(`Using "${gitUserEmail}" as git user.email`)
    core.info(`Using "${releaseCount}" release count`)
    core.info(`Using "${versionFile}" as version file`)
    core.info(`Using "${versionPath}" as version path`)
    core.info(`Using "${tagPrefix}" as tag prefix`)
    core.info(`Using "${outputFile}" as output file`)
    core.info(`Using "${conventionalConfigFile}" as config file`)

    if (preCommit) {
      core.info(`Using "${preCommit}" as pre-commit script`)
    }

    if (preChangelogGeneration) {
      core.info(`Using "${preChangelogGeneration}" as pre-changelog-generation script`)
    }

    core.info(`Skipping empty releases is "${skipEmptyRelease ? 'enabled' : 'disabled'}"`)
    core.info(`Skipping the update of the version file is "${skipVersionFile ? 'enabled' : 'disabled'}"`)

    core.info('Pull to make sure we have the full git history')
    await git.pull()

    const config = conventionalConfigFile && require(resolve(process.cwd(), conventionalConfigFile))

    conventionalRecommendedBump({ preset, tagPrefix, config }, async (error, recommendation) => {
      if (error) {
        core.setFailed(error.message)
        return
      }

      core.info(`Recommended release type: ${recommendation.releaseType}`)

      // If we have a reason also log it
      if (recommendation.reason) {
        core.info(`Because: ${recommendation.reason}`)
      }

      let newVersion

      // If skipVersionFile or skipCommit is true we use GIT to determine the new version because
      // skipVersionFile can mean there is no version file and skipCommit can mean that the user
      // is only interested in tags
      if (skipVersionFile || skipCommit) {
        core.info('Using GIT to determine the new version')
        const versioning = await handleVersioningByExtension(
          'git',
          versionFile,
          versionPath,
          recommendation.releaseType
        )
        newVersion = versioning.newVersion
      } else {
        const files = versionFile.split(',').map((f) => f.trim())
        core.info(`Files to bump: ${files.join(', ')}`)

        const versioning = await Promise.all(
          files.map((file) => {
            const fileExtension = file.split('.').pop()
            core.info(`Bumping version to file "${file}" with extension "${fileExtension}"`)
            return handleVersioningByExtension(fileExtension, file, versionPath, recommendation.releaseType)
          })
        )

        newVersion = versioning[0].newVersion
      }

      let gitTag = `${tagPrefix}${newVersion}`

      if (preChangelogGeneration) {
        const newVersionAndTag = await require(path.resolve(preChangelogGeneration)).preChangelogGeneration({
          tag: gitTag,
          version: newVersion,
        })

        if (newVersionAndTag) {
          if (newVersionAndTag.tag) gitTag = newVersionAndTag.tag
          if (newVersionAndTag.version) newVersion = newVersionAndTag.version
        }
      }

      // Generate the string changelog
      const stringChangelog = await changelog.generateStringChangelog(tagPrefix, preset, newVersion, 1, config)
      core.info('Changelog generated')
      core.info(stringChangelog)

      // Removes the version number from the changelog
      const cleanChangelog = stringChangelog.split('\n').slice(3).join('\n').trim()

      if (skipEmptyRelease && cleanChangelog === '') {
        core.info('Generated changelog is empty and skip-on-empty has been activated so we skip this step')
        core.setOutput('skipped', 'true')
        return
      }

      core.info(`New version: ${newVersion}`)

      // If output file === 'false' we don't write it to file
      if (outputFile !== 'false') {
        // Generate the changelog
        await changelog.generateFileChangelog(tagPrefix, preset, newVersion, outputFile, releaseCount, config)
      }

      if (!skipCommit) {
        // Add changed files to git
        if (preCommit) {
          await require(path.resolve(preCommit)).preCommit({
            tag: gitTag,
            version: newVersion,
          })
        }
        await git.add('.')
        await git.commit(gitCommitMessage.replace('{version}', gitTag))
      }

      // Create the new tag
      await git.createTag(gitTag)

      core.info('Push all changes')
      try {
        await git.push()
      } catch (error) {
        core.setFailed(error.message)
      }

      // Set outputs so other actions (for example actions/create-release) can use it
      core.setOutput('changelog', stringChangelog)
      core.setOutput('clean_changelog', cleanChangelog)
      core.setOutput('version', newVersion)
      core.setOutput('tag', gitTag)
      core.setOutput('skipped', 'false')
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
