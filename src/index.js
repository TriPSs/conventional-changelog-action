const core = require('@actions/core')
const conventionalRecommendedBump = require('conventional-recommended-bump')
const path = require('path')

const getVersioning = require('./version')
const git = require('./helpers/git')
const changelog = require('./helpers/generateChangelog')
const requireScript = require('./helpers/requireScript')
const { loadPreset, loadPresetConfig } = require('./helpers/load-preset')

async function handleVersioningByExtension(ext, file, versionPath, releaseType, skipBump) {
  const versioning = getVersioning(ext)

  // File type isn't supported
  if (versioning === null) {
    throw new Error(`File extension "${ext}" from file "${file}" is not supported`)
  }

  versioning.init(path.resolve(process.cwd(), file), versionPath)

  // Bump the version in the package.json
  if(!skipBump){
    await versioning.bump(releaseType)
  }

  return versioning
}

async function run() {
  try {
    let gitCommitMessage = core.getInput('git-message')
    const gitUserName = core.getInput('git-user-name')
    const gitUserEmail = core.getInput('git-user-email')
    const gitPush = core.getBooleanInput('git-push')
    const gitBranch = core.getInput('git-branch').replace('refs/heads/', '')
    const tagPrefix = core.getInput('tag-prefix')
    const preset = !core.getInput('config-file-path') ? core.getInput('preset') : ''
    const preCommitFile = core.getInput('pre-commit')
    const outputFile = core.getInput('output-file')
    const releaseCount = core.getInput('release-count')
    const versionFile = core.getInput('version-file')
    const versionPath = core.getInput('version-path')
    const skipGitPull = core.getBooleanInput('skip-git-pull')
    const skipVersionFile = core.getBooleanInput('skip-version-file')
    const skipCommit = core.getBooleanInput('skip-commit')
    const skipEmptyRelease = core.getBooleanInput('skip-on-empty')
    const skipTag = core.getBooleanInput('skip-tag')
    const conventionalConfigFile = core.getInput('config-file-path')
    const preChangelogGenerationFile = core.getInput('pre-changelog-generation')
    const gitUrl = core.getInput('git-url')
    const gitPath = core.getInput('git-path')
    const infile = core.getInput('input-file')
    const skipCi = core.getBooleanInput('skip-ci')
    const createSummary = core.getBooleanInput('create-summary')
    const prerelease = core.getBooleanInput('pre-release')
    const skipBump = core.getBooleanInput('skip-bump')

    if (skipCi) {
      gitCommitMessage += ' [skip ci]'
    }

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
    core.info(`Using "${gitUrl}" as gitUrl`)
    core.info(`Using "${gitBranch}" as gitBranch`)
    core.info(`Using "${gitPath}" as gitPath`)

    if (preCommitFile) {
      core.info(`Using "${preCommitFile}" as pre-commit script`)
    }

    if (infile) {
      core.info(`Using "${infile}" as input file`)
    }

    if (preChangelogGenerationFile) {
      core.info(`Using "${preChangelogGenerationFile}" as pre-changelog-generation script`)
    }

    if(skipBump) {
      core.info('Skipping bumping the version')
    }

    core.info(`Skipping empty releases is "${skipEmptyRelease ? 'enabled' : 'disabled'}"`)
    core.info(`Skipping the update of the version file is "${skipVersionFile ? 'enabled' : 'disabled'}"`)

    await git.init()

    if (!skipGitPull) {
      core.info('Pull to make sure we have the full git history')
      await git.pull()
    }

    const config = await loadPresetConfig(preset, conventionalConfigFile && requireScript(conventionalConfigFile))

    const recommendation = await conventionalRecommendedBump({
      preset: await loadPreset(preset),
      tagPrefix,
      config,
      skipUnstable: !prerelease
    })

    core.info(`Recommended release type: ${recommendation.releaseType}`)

    // If we have a reason also log it
    if (recommendation.reason) {
      core.info(`Because: ${recommendation.reason}`)
    }

    let newVersion
    let oldVersion

    // If skipVersionFile or skipCommit is true we use GIT to determine the new version because
    // skipVersionFile can mean there is no version file and skipCommit can mean that the user
    // is only interested in tags
    if (skipVersionFile || skipCommit) {
      core.info('Using GIT to determine the new version')
      const versioning = await handleVersioningByExtension(
        'git',
        versionFile,
        versionPath,
        recommendation.releaseType,
        skipBump
      )

      oldVersion = versioning.oldVersion
      newVersion = skipBump ? oldVersion : versioning.newVersion

    } else {
      const files = versionFile.split(',').map((f) => f.trim())
      core.info(`Files to bump: ${files.join(', ')}`)

      const versioning = await Promise.all(
        files.map((file) => {
          const fileExtension = file.split('.').pop()
          core.info(`Bumping version to file "${file}" with extension "${fileExtension}"`)

          return handleVersioningByExtension(fileExtension, file, versionPath, recommendation.releaseType, skipBump)
        })
      )

      oldVersion = versioning[0].oldVersion
      newVersion = skipBump ? oldVersion : versioning[0].newVersion
    }

    let gitTag = `${tagPrefix}${newVersion}`

    if (preChangelogGenerationFile) {
      const preChangelogGenerationScript = requireScript(preChangelogGenerationFile)

      // Double check if we want to update / do something with the tag
      if (preChangelogGenerationScript && preChangelogGenerationScript.preTagGeneration) {
        const modifiedTag = await preChangelogGenerationScript.preTagGeneration(gitTag)

        if (modifiedTag) {
          core.info(`Using modified tag "${modifiedTag}"`)
          gitTag = modifiedTag
        }
      }
    }

    // Generate the string changelog
    const stringChangelog = await changelog.generateStringChangelog(tagPrefix, preset, newVersion, 1, config, gitPath, !prerelease)
    core.info('Changelog generated')
    core.info(stringChangelog)

    // Removes the version number from the changelog
    const cleanChangelog = stringChangelog.split('\n').slice(3).join('\n').trim()

    if (skipEmptyRelease && cleanChangelog === '') {
      core.info('Generated changelog is empty and skip-on-empty has been activated so we skip this step')
      core.setOutput('old_version', oldVersion)
      core.setOutput('version', oldVersion)
      core.setOutput('skipped', 'true')
      return
    }

    core.info(`New version: ${newVersion}`)

    // If output file === 'false' we don't write it to file
    if (outputFile !== 'false') {
      // Generate the changelog
      await changelog.generateFileChangelog(tagPrefix, preset, newVersion, outputFile, releaseCount, config, gitPath, infile)
    }

    if (!skipCommit) {
      // Add changed files to git
      if (preCommitFile) {
        const preCommitScript = requireScript(preCommitFile)

        // Double check if the file exists and the export exists
        if (preCommitScript && preCommitScript.preCommit) {
          await preCommitScript.preCommit({
            tag: gitTag,
            version: newVersion
          })
        }
      }

      await git.add('.')
      await git.commit(gitCommitMessage.replace('{version}', gitTag))
    }

    // Create the new tag
    if (!skipTag) {
      await git.createTag(gitTag)
    } else {
      core.info('We not going to the tag the GIT changes')
    }

    if (gitPush) {
      try {
        core.info('Push all changes')
        await git.push(gitBranch)

      } catch (error) {
        console.error(error)

        core.setFailed(error)

        return
      }

    } else {
      core.info('We not going to push the GIT changes')
    }

    // Set outputs so other actions (for example actions/create-release) can use it
    core.setOutput('changelog', stringChangelog)
    core.setOutput('clean_changelog', cleanChangelog)
    core.setOutput('version', newVersion)
    core.setOutput('old_version', oldVersion)
    core.setOutput('tag', gitTag)
    core.setOutput('skipped', 'false')

    if (createSummary) {
      try {
        await core.summary
          .addHeading(gitTag, 2)
          .addRaw(cleanChangelog)
          .write()
      } catch (err) {
        core.warning(`Was unable to create summary! Error: "${err}"`)
      }
    }

    try {
      // If we are running in test mode we use this to validate everything still runs
      git.testHistory(gitBranch)

    } catch (error) {
      console.error(error)

      core.setFailed(error)
    }
  } catch (error) {
    core.setFailed(error)
  }
}

process.on('unhandledRejection', (reason, promise) => {
  let error = `Unhandled Rejection occurred. ${reason.stack}`
  console.error(error)
  core.setFailed(error)
})

run()