const objectPath = require('object-path')
const toml = require('toml')

const BaseVersioning = require('./base')
const bumpVersion = require('../helpers/bumpVersion')

module.exports = new (class Toml extends BaseVersioning{

  /**
   * Bumps the version in the package.json
   *
   * @param {!string} releaseType - The type of release
   * @return {*}
   */
  bump = (releaseType) => {
    // Read the file
    const fileContent = this.read()
    const tomlContent = toml.parse(fileContent)
    const oldVersion = objectPath.get(tomlContent, this.versionPath)

    // Get the new version
    this.newVersion = bumpVersion(
      releaseType,
      oldVersion,
    )

    // Get the name of where the version is in
    const versionName = this.versionPath.split('.').pop()

    // Update the file
    this.update(
      // We use replace so we can preserve white spaces and comments
      fileContent.replace(
        `${versionName} = "${oldVersion}"`,
        `${versionName} = "${this.newVersion}"`,
      ),
    )
  }

})

