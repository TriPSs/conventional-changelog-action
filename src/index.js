const core = require('@actions/core')
const conventionalRecommendedBump = require('conventional-recommended-bump')
const path = require('path')

const getVersioning = require('./version')
const git = require('./helpers/git')
const changelog = require('./helpers/generateChangelog')
const requireScript = require('./helpers/requireScript')

async function handleVersioningByExtension(ext, file, versionPath, releaseType) {
  const versioning = getVersioning(ext)

  // File type not supported
  if (versioning === null) {
    throw new Error(`File extension "${ext}" from file "${file}" is not supported`)
  }

  versioning.init(path.resolve(process.cwd(), file), versionPath)

  // Bump the version in the package.json
  await versioning.bump(releaseType)

  return versioning
}

async function run() {
  try {
    let gitCommitMessage = core.getInput('git-message')
    const gitUserName = core.getInput('git-user-name')
    const gitUserEmail = core.getInput('git-user-email')
    const gitPush = core.getBooleanInput('git-push')
    const gitBranch = core.getInput('git-branch').replace('refs/heads/', '')
    const gitReleaseBranchPrefix = core.getInput('git-release-branch-prefix')
    const tagPrefix = core.getInput('tag-prefix')
    const preset = !core.getInput('config-file-path') ? core.getInput('preset') : ''
    const preCommitFile = core.getInput('pre-commit')
    const outputFile = core.getInput('output-file')
    const releaseCount = core.getInput('release-count')
    const versionFile = core.getInput('version-file')
    const versionPath = core.getInput('version-path')
    const skipGitPull = core.getBooleanInput('skip-git-pull')
    const gitPullDepth = core.getInput('git-pull-depth')
    const skipVersionFile = core.getBooleanInput('skip-version-file')
    const skipCommit = core.getBooleanInput('skip-commit')
    const skipEmptyRelease = core.getBooleanInput('skip-on-empty')
    const skipTag = core.getBooleanInput('skip-tag')
    const skipReleaseBranch = core.getBooleanInput('skip-release-branch')
    const conventionalConfigFile = core.getInput('config-file-path')
    const preChangelogGenerationFile = core.getInput('pre-changelog-generation')
    const dryRun = core.getInput('dry-run').toLowerCase() === 'true'
    const forcePush = core.getInput('force-push').toLowerCase() === 'true'
    const gitUrl = core.getInput('git-url')
    const gitPath = core.getInput('git-path')
    const skipCi = core.getBooleanInput('skip-ci')
    const createSummary = core.getBooleanInput('create-summary')
    const prerelease = core.getBooleanInput('pre-release')

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
    core.info(`Using "${gitReleaseBranchPrefix}" as gitReleaseBranchPrefix`)
    core.info(`Using "${gitPath}" as gitPath`)
    core.info(`Using "${forcePush}" as force push`)
    core.info(`Using "${dryRun}" as dry run`)
    core.info(`Using "${skipTag}" as skip tag`)
    core.info(`Using "${skipReleaseBranch}" as skip release branch`)
    core.info(`Using "${skipGitPull}" as skip git pull`)
    core.info(`Using "${gitPullDepth}" as git pull depth`)
    
    if (preCommitFile) {
      core.info(`Using "${preCommitFile}" as pre-commit script`)
    }

    if (preChangelogGenerationFile) {
      core.info(`Using "${preChangelogGenerationFile}" as pre-changelog-generation script`)
    }

    core.info(`Skipping empty releases is "${skipEmptyRelease ? 'enabled' : 'disabled'}"`)
    core.info(`Skipping the update of the version file is "${skipVersionFile ? 'enabled' : 'disabled'}"`)

    await git.init()

    if (!skipGitPull) {
      core.info('Pull to make sure we have the full git history')
      await git.fetch(gitPullDepth)
      await git.pull()
    }

    const config = conventionalConfigFile && requireScript(conventionalConfigFile)

    conventionalRecommendedBump({ preset, tagPrefix, config, skipUnstable: !prerelease }, async (error, recommendation) => {
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
        )

        newVersion = versioning.newVersion
        oldVersion = versioning.oldVersion

      } else {
        const files = versionFile.split(',').map((f) => f.trim())
        core.info(`Files to bump: ${files.join(', ')}`)

        const versioning = await Promise.all(
          files.map((file) => {
            const fileExtension = file.split('.').pop()
            core.info(`Bumping version to file "${file}" with extension "${fileExtension}"`)

            return handleVersioningByExtension(fileExtension, file, versionPath, recommendation.releaseType)
          }),
        )

        newVersion = versioning[0].newVersion
        oldVersion = versioning[0].oldVersion
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
        core.setOutput('version', oldVersion)
        core.setOutput('skipped', 'true')
        return
      }

      core.info(`Old version: ${oldVersion}`)
      core.info(`New version: ${newVersion}`)

      // If output file === 'false' we don't write it to file
      if (outputFile !== 'false' && !dryRun) {
        // Generate the changelog
        await changelog.generateFileChangelog(tagPrefix, preset, newVersion, outputFile, releaseCount, config, gitPath)
        core.info(`Generated file change log at: ${outputFile}`)
      }

      let needsPush = false

      if (!skipCommit && !dryRun) {
        // Add changed files to git
        if (preCommitFile) {
          const preCommitScript = requireScript(preCommitFile)

          // Double check if the file exists and the export exists
          if (preCommitScript && preCommitScript.preCommit) {
            await preCommitScript.preCommit({
              tag: gitTag,
              version: newVersion,
            })
          }
        }

        await git.add('.')
        await git.commit(gitCommitMessage.replace('{version}', gitTag))
        core.info(`Commited changes to git`)

        let hasChanges = await git.hasChanges()
        if (hasChanges) {
          needsPush = true
        }
      }

      let gitReleaseBranch = `${gitReleaseBranchPrefix}/${gitTag}`

      // Create the new release branch
      if (!skipReleaseBranch && !dryRun) {
        await git.createBranch(`${gitReleaseBranch}`)
        needsPush = true
        core.info(`Release branch: ${gitReleaseBranch}`)
      } else {
        core.info('We not going to create release branch for GIT changes')
      }

      // Create the new tag
      if (!skipTag && !dryRun) {
        await git.createTag(gitTag)
        needsPush = true
        core.info(`Tag: ${gitTag}`)
      } else {
        core.info('We not going to the tag the GIT changes')
      }

      if (!dryRun && needsPush) {
        try {
          core.info('Push all changes')

          if (gitPush) {
            await git.push(gitBranch, forcePush)
          } else {
            core.info('We not going to push GIT changes to current branch')
          }

          if (!skipTag) {
            await git.push(gitTag, forcePush)
          } else {
            core.info('We not going to push GIT changes to tag')
          }

          if (!skipReleaseBranch){
            await git.push(gitReleaseBranch, forcePush)
          } else {
            core.info('We not going to push GIT changes to release branch')
          }
        } catch (error) {
          console.error(error)
          core.setFailed(error)
          return
        }
      } else {
        core.info('We not going to push any GIT changes')
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
          core.warning(`Was unable to create summary! Error: "${err}"`,)
        }
      }

      try {
        // If we are running in test mode we use this to validate everything still runs
        await git.testHistory(gitBranch, gitReleaseBranch)
      } catch (error) {
        console.error(error)
        core.setFailed(error)
      }
    })
  } catch (error) {
    core.setFailed(error)
  }
}

process.on('unhandledRejection', (reason, promise) => {
  let error = `Unhandled Rejection occurred. ${reason.stack}`
  console.error(error)
  core.setFailed(error)
});

run()