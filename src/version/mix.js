const BaseVersioning = require('./base')
const bumpVersion = require('../helpers/bumpVersion')

module.exports = class Mix extends BaseVersioning {

  fileLocation = null
  fileContent = null

  constructor(fileLocation, versionPath) {
    super(fileLocation, versionPath)
    this.readMix()
  }


  /**
   * Reads and parses the mix file
   */
  readMix = () => {
    // Read the file
    this.fileContent = this.read()

    // Parse the file
    const [_, oldVersion] = this.fileContent.match(/version: "([0-9.]+)"/i)
    this.oldVersion = oldVersion

    if (!this.oldVersion) {
      throw new Error(`Failed to extract mix project version.`)
    }
  }

  /**
   * Bumps the version in the package.json
   *
   * @param {!string} releaseType - The type of release
   * @return {*}
   */
  bump = async(releaseType) => {
    this.newVersion = await bumpVersion(
      releaseType,
      this.oldVersion
    )

    this.update(
      this.fileContent.replace(`version: "${this.oldVersion}"`, `version: "${this.newVersion}"`)
    )
  }
}
