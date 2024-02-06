const core = require('@actions/core')
const gitSemverTags = require('git-semver-tags')

const BaseVersioning = require('./base')
const bumpVersion = require('../helpers/bumpVersion')

module.exports = class Git extends BaseVersioning {

  /**
   * Set some basic configurations
   *
   * @param {!string} fileLocation - Full location of the file
   * @param {!string} versionPath - Path inside the file where the version is located
   */
  init = (fileLocation, versionPath) => {
    this.initBase(fileLocation, versionPath)
  }

  /**
   * Left empty to override the parent's abstract method, which would throw an error
   */
  parseFile = () => {

  }

  bump = async(releaseType) => {
    const tagPrefix = core.getInput('tag-prefix')
    const prerelease = core.getBooleanInput('pre-release')

    const tags = await gitSemverTags({ tagPrefix, skipUnstable: !prerelease })
    this.oldVersion = tags.length > 0 ? tags.shift().replace(tagPrefix, '') : null

    // Get the new version
    this.newVersion = await bumpVersion(
      releaseType,
      this.oldVersion
    )
  }

}
