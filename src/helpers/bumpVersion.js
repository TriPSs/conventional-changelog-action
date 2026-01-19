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

  if (version) {
    if (prerelease) {
      const parsedVersion = semver.parse(version)

      // Check if the current version is already a pre-release with the same identifier
      if (parsedVersion.prerelease && parsedVersion.prerelease.length > 0 && parsedVersion.prerelease[0] === identifier) {
        // Determine what type of release the current prerelease is targeting
        // If patch is 0, we're targeting a minor/major release
        // If patch > 0, we're targeting a patch release
        const isTargetingMinorOrMajor = parsedVersion.patch === 0

        // If the required release type is already satisfied by the current target, just increment counter
        // Otherwise, bump to the new target version
        if (releaseType === 'major') {
          // Major changes always require a new major version
          newVersion = semver.inc(version, 'premajor', identifier)
        } else if (releaseType === 'minor') {
          if (isTargetingMinorOrMajor) {
            // Already targeting a minor/major release, just increment counter
            // (e.g., 1.8.0-dev.2 with minor -> 1.8.0-dev.3)
            newVersion = semver.inc(version, 'prerelease', identifier)
          } else {
            // Currently targeting a patch, need to bump to minor
            // (e.g., 1.7.1-dev.0 with minor -> 1.8.0-dev.0)
            newVersion = semver.inc(version, 'preminor', identifier)
          }
        } else {
          // Patch changes always just increment the prerelease counter
          // (e.g., 1.7.1-dev.0 with patch -> 1.7.1-dev.1)
          // (e.g., 1.8.0-dev.2 with patch -> 1.8.0-dev.3)
          newVersion = semver.inc(version, 'prerelease', identifier)
        }
      } else {
        // First pre-release for this version or different identifier, bump base version
        // (e.g., 1.5.0 -> 1.5.1-dev.0 or 1.5.0-beta.0 -> 1.5.1-dev.0)
        newVersion = semver.inc(version, `pre${releaseType}`, identifier)
      }
    } else {
      newVersion = semver.inc(version, releaseType, identifier)
    }
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
