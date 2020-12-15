const core = require('@actions/core')
const semverValid = require('semver').valid

const requireScript = require('./requireScript')

/**
 * Bumps the given version with the given release type
 *
 * @param releaseType
 * @param version
 * @returns {string}
 */
module.exports = async (releaseType, version) => {
  let major, minor, patch

  if (version) {
    [major, minor, patch] = version.split('.')

    switch (releaseType) {
      case 'major':
        major = parseInt(major, 10) + 1
        minor = 0
        patch = 0
        break

      case 'minor':
        minor = parseInt(minor, 10) + 1
        patch = 0
        break

      default:
        patch = parseInt(patch, 10) + 1
    }
  } else {
    let version = semverValid(core.getInput('fallback-version'))

    if (version) {
      [major, minor, patch] = version.split('.')
    } else {
      // default
      major = 0
      minor = 1
      patch = 0
    }

    core.info(`The version could not be detected, using fallback version '${major}.${minor}.${patch}'.`)
  }

  const preChangelogGenerationFile = core.getInput('pre-changelog-generation')

  let newVersion = `${major}.${minor}.${patch}`

  if (preChangelogGenerationFile) {
    const preChangelogGenerationScript = requireScript(preChangelogGenerationFile)

    // Double check if we want to update / do something with the version
    if (preChangelogGenerationScript && preChangelogGenerationScript.preVersionGeneration) {
      const modifiedVersion = await preChangelogGenerationScript.preVersionGeneration(newVersion)

      if (modifiedVersion) {
        core.info(`Using modified version "${modifiedVersion}"`)
        newVersion = modifiedVersion
      }
    }
  }

  return newVersion
}
