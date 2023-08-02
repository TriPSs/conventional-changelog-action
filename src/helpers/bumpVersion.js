const core = require('@actions/core')
const semver = require('semver')

const requireScript = require('./requireScript')

/**
 * Bumps the given version with the given release type
 *
 * @param releaseType
 * @param version
 * @returns {string}
 */
module.exports = async (releaseType, version) => {
  let newVersion

  const prerelease = core.getBooleanInput('pre-release')
  const identifier = core.getInput('pre-release-identifier')
  const prereleaseBumpsMinor = core.getBooleanInput('pre-release-bumps-minor')

  core.info(`Bumping from version '${version}'.`)

  if (version) {

    if (prereleaseBumpsMinor) {
      if (semver.prerelease(version) === null) {
        version = semver.inc(version, 'preminor')
        version += `-${identifier}.0`
      }
      core.info(`Pre-release bumps minor base '${version}'.`)
    }

    newVersion = semver.inc(version, (prerelease ? 'prerelease' : releaseType), identifier)

  } else {

    const fallbackVersion = core.getInput('fallback-version')

    if (fallbackVersion) {
      newVersion = semver.valid(fallbackVersion)
    }

    if (!newVersion) {
      // default
      newVersion = (prerelease ? `0.1.0-${identifier}.0` : '0.1.0')
    }

    core.info(`The version could not be detected, using fallback version '${newVersion}'.`)
  }

  const preChangelogGenerationFile = core.getInput('pre-changelog-generation')

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
