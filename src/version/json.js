const fs = require('fs')
const objectPath = require('object-path')

const bumpVersion = require('../helpers/bumpVersion')

module.exports = new (class JSON {

  fileLocation = null

  versionPath = null

  newVersion = null

  init = (fileLocation, versionPath) => {
    this.fileLocation = fileLocation
    this.versionPath = versionPath
  }

  /**
   * Get's the JSON file
   *
   * @return {string}
   */
  read = () => {
    return JSON.parse(fs.readFileSync(this.fileLocation))
  }

  /**
   * Bumps the version in the package.json
   *
   * @param {!string} releaseType - The type of release
   * @return {*}
   */
  bump = (releaseType) => {
    // Read the JSON file
    const jsonFile = this.read()

    // Get the new version
    this.newVersion = bumpVersion(
      releaseType,
      objectPath.get(jsonFile, this.versionPath),
    )

    // Update the json file with the new version
    objectPath.set(jsonFile, this.versionPath, this.newVersion)

    // Update the JSON file
    this.update(jsonFile)
  }

  /**
   * Update JSON file
   *
   * @param {!string} newJSONContent - New content for the JSON file
   * @return {*}
   */
  update = (newJSONContent) => (
    fs.writeFileSync(this.fileLocation, JSON.stringify(newJSONContent, null, 2))
  )

})

