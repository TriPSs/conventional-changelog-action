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
        // Calculate what the new base version would be with the recommended release type
        const potentialNewVersion = semver.inc(version, `pre${releaseType}`, identifier)
        const potentialParsed = semver.parse(potentialNewVersion)

        // Compare base versions (major.minor.patch only)
        const currentBase = `${parsedVersion.major}.${parsedVersion.minor}.${parsedVersion.patch}`
        const newBase = `${potentialParsed.major}.${potentialParsed.minor}.${potentialParsed.patch}`

        if (currentBase === newBase) {
          // Base version unchanged, just increment pre-release counter
          // (e.g., 1.5.1-dev.3 with no significant changes -> 1.5.1-dev.4)
          newVersion = semver.inc(version, 'prerelease', identifier)
        } else {
          // Base version changed due to release type, bump to new base with .0
          // (e.g., 1.5.1-dev.3 with minor bump -> 1.6.0-dev.0)
          newVersion = potentialNewVersion
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
