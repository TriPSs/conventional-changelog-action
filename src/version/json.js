const core = require('@actions/core')
const objectPath = require('object-path')

const BaseVersioning = require('./base')
const bumpVersion = require('../helpers/bumpVersion')

module.exports = new (class Json extends BaseVersioning {

  /**
   * Bumps the version in the package.json
   *
   * @param {!string} releaseType - The type of release
   * @param {string} customVersion - Bump file with manually provided version
   * @return {*}
   */
  bump = (releaseType, customVersion) => {
    // Read the file
    const fileContent = this.read()

    // Parse the file
    let jsonContent
    try {
      jsonContent = JSON.parse(fileContent)
    } catch (error) {
      core.startGroup(`Error when parsing the file '${this.fileLocation}'`)
      core.info(`File-Content: ${fileContent}`)
      core.info(error) // should be 'warning' ?
      core.endGroup()

      jsonContent = {}
    }

    // Get the old version
    const oldVersion = objectPath.get(jsonContent, this.versionPath, null)

    // Get the new version
    this.newVersion = bumpVersion(
      releaseType,
      oldVersion,
    )

    if (customVersion) {
      this.newVersion = customVersion 
    }

    // Update the content with the new version
    objectPath.set(jsonContent, this.versionPath, this.newVersion)

    // Update the file
    this.update(
      JSON.stringify(jsonContent, null, 2),
    )
  }

})

