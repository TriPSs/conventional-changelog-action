const BaseVersioning = require('./base')
const bumpVersion = require('../helpers/bumpVersion')

module.exports = class Mix extends BaseVersioning {
  /**
   * Bumps the version in the package.json
   *
   * @param {!string} releaseType - The type of release
   * @return {*}
   */
  bump = async(releaseType) => {
    // Read the file
    const fileContent = this.read()

    const [_, oldVersion] = fileContent.match(/version: "([0-9.]+)"/i)
    this.oldVersion = oldVersion

    if (!this.oldVersion) {
      throw new Error(`Failed to extract mix project version.`)
    }

    this.newVersion = await bumpVersion(
      releaseType,
      this.oldVersion
    )

    this.update(
      fileContent.replace(`version: "${this.oldVersion}"`, `version: "${this.newVersion}"`)
    )
  }
}
