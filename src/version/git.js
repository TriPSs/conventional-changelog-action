const core = require('@actions/core')
const gitSemverTags = require('git-semver-tags')

const bumpVersion = require('../helpers/bumpVersion')

module.exports = new (class Git {

  newVersion = null

  init = (fileLocation, versionPath) => {}

  bump = (releaseType) => {
    return new Promise((resolve) => {
      const tagPrefix = core.getInput('tag-prefix')

      gitSemverTags({
        tagPrefix,
      }, (err, tags) => {
        const currentVersion = tags.shift().replace(tagPrefix, '')

        // Get the new version
        this.newVersion = bumpVersion(
          releaseType,
          currentVersion
        )

        // We are done
        resolve()
      })
    })
  }

})

