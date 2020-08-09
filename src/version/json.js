const objectPath = require('object-path')

const BaseVersioning = require('./base')
const bumpVersion = require('../helpers/bumpVersion')

module.exports = new (class Json extends BaseVersioning {

  /**
   * Bumps the version in the package.json
   *
   * @param {!string} releaseType - The type of release
   * @return {*}
   */
  bump = (releaseType) => {
    let jsonContent = {}
    let oldVersion

    // Read the file
    const fileContent = this.read()
    if (fileContent) {
      jsonContent = JSON.parse(fileContent)
      oldVersion = objectPath.get(jsonContent, this.versionPath)
    }

    // Get the new version
    this.newVersion = bumpVersion(
      releaseType,
      oldVersion,
    )

    // Update the content with the new version
    objectPath.set(jsonContent, this.versionPath, this.newVersion)

    // Update the file
    this.update(
      JSON.stringify(jsonContent, null, 2),
    )
  }

})

