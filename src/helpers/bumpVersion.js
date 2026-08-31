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
  const smartBump = core.getBooleanInput('pre-release-smart-bump')

  if (version) {
    if (prerelease) {
      const parsedVersion = semver.parse(version)

      // Check if the current version is already a pre-release with the same identifier
      if (smartBump && parsedVersion.prerelease && parsedVersion.prerelease.length > 0 && parsedVersion.prerelease[0] === identifier) {
        // Smart bump mode: Determine what type of release the current prerelease is targeting
        // x.0.0-dev.y = targeting a major release
        // x.y.0-dev.z (where y > 0) = targeting a minor release
        // x.y.z-dev.n (where z > 0) = targeting a patch release
        const isTargetingMajor = parsedVersion.minor === 0 && parsedVersion.patch === 0
        const isTargetingMinor = parsedVersion.minor > 0 && parsedVersion.patch === 0

        if (isTargetingMajor) {
          // Already targeting a major release, always just increment counter
          // (e.g., 3.0.0-dev.2 with any change -> 3.0.0-dev.3)
          newVersion = semver.inc(version, 'prerelease', identifier)
        } else if (releaseType === 'major') {
          // Need to bump to a new major version
          // (e.g., 1.8.0-dev.2 with major -> 2.0.0-dev.0)
          newVersion = semver.inc(version, 'premajor', identifier)
        } else if (releaseType === 'minor') {
          if (isTargetingMinor) {
            // Already targeting a minor release, just increment counter
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
        // Standard semver behavior: always bump based on release type
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
