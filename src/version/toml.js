const objectPath = require('object-path')
const toml = require('@iarna/toml')

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
    let tomlContent = {}
    let oldVersion

    // Read the file
    const fileContent = this.read()
    if (fileContent) {
      tomlContent = toml.parse(fileContent)
      oldVersion = objectPath.get(tomlContent, this.versionPath)
    }

    // Get the new version
    this.newVersion = bumpVersion(
      releaseType,
      oldVersion,
    )

    // Get the name of where the version is in
    const versionName = this.versionPath.split('.').pop()

    // Update the file
    if (fileContent) {
      this.update(
        // We use replace instead of yaml.stringify so we can preserve white spaces and comments
        fileContent.replace(
          `${versionName} = "${oldVersion}"`,
          `${versionName} = "${this.newVersion}"`,
        ),
      )
    } else {
      // Update the content with the new version
      objectPath.set(tomlContent, this.versionPath, this.newVersion)
      this.update(toml.stringify(tomlContent))
    }
  }

})

