const core = require('@actions/core')
const gitSemverTags = require('git-semver-tags')

const BaseVersioning = require('./base')
const bumpVersion = require('../helpers/bumpVersion')

module.exports = class Git extends BaseVersioning {

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
