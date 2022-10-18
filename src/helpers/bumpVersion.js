const core = require('@actions/core');
const semverValid = require('semver').valid;
const SemVer = require('semver/classes/semver');

const requireScript = require('./requireScript');

/**
 * Bumps the given version with the given release type
 *
 * @param releaseType
 * @param version
 * @returns {string}
 */
module.exports = async (releaseType, version) => {
  let semver;
  if (!version) {
    semver = new SemVer(
      semverValid(core.getInput('fallback-version')) ?? '0.1.0'
    );
    core.info(
      `The version could not be detected, using fallback version '${major}.${minor}.${patch}'.`
    );
  } else {
    semver = new SemVer(version);
    if (semver.prerelease && semver.prerelease.length) {
      semver.inc('prerelease');
    } else {
      semver.inc(releaseType);
    }
  }

  const preChangelogGenerationFile = core.getInput('pre-changelog-generation');

  if (preChangelogGenerationFile) {
    const preChangelogGenerationScript = requireScript(
      preChangelogGenerationFile
    );

    // Double check if we want to update / do something with the version
    if (
      preChangelogGenerationScript &&
      preChangelogGenerationScript.preVersionGeneration
    ) {
      const modifiedVersion =
        await preChangelogGenerationScript.preVersionGeneration(semver.version);

      if (modifiedVersion) {
        core.info(`Using modified version "${modifiedVersion}"`);
        semver = new SemVer(modifiedVersion);
      }
    }
  }

  return semver.version;
};
