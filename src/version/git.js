const core = require('@actions/core')
const gitSemverTags = require('git-semver-tags')

const BaseVersioning = require('./base')
const bumpVersion = require('../helpers/bumpVersion')

module.exports = new (class Git extends BaseVersioning {

  bump = (releaseType) => {
    return new Promise((resolve) => {
      const tagPrefix = core.getInput('tag-prefix')

      gitSemverTags({
        tagPrefix,
      }, (err, tags) => {
        const currentVersion = tags.length > 0 ? tags.shift().replace(tagPrefix, '') : '0.1.0'

        // Get the new version
        this.newVersion = bumpVersion(
          releaseType,
          currentVersion,
        )

        // We are done
        resolve()
      })
    })
  }

})

