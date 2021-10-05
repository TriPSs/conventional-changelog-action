const core = require('@actions/core')
const objectPath = require('object-path')
const toml = require('@iarna/toml')

const BaseVersioning = require('./base')
const bumpVersion = require('../helpers/bumpVersion')

module.exports = class Toml extends BaseVersioning {

  /**
   * Bumps the version in the package.json
   *
   * @param {!string} releaseType - The type of release
   * @return {*}
   */
  bump = async (releaseType) => {
    // Read the file
    const fileContent = this.read()
    const tomlContent = toml.parse(fileContent)
    const oldVersion = objectPath.get(tomlContent, this.versionPath, null)

    // Get the new version
    this.newVersion = await bumpVersion(
      releaseType,
      oldVersion,
    )

    // Update the file
    if (oldVersion) {
      // Get the name of where the version is in
      const versionName = this.versionPath.split('.').pop()

      core.info(`Bumped file "${this.fileLocation}" from "${oldVersion}" to "${this.newVersion}"`)

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

}

