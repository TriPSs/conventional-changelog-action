const core = require('@actions/core')
const objectPath = require('object-path')
const toml = require('@iarna/toml')

const BaseVersioning = require('./base')
const bumpVersion = require('../helpers/bumpVersion')

module.exports = class Toml extends BaseVersioning {

  tomlContent = null

  constructor(fileLocation, versionPath) {
    super(fileLocation, versionPath)
    this.readToml()
  }

  /**
   * Reads and parses the toml file
   */
  readToml = () => {
    // Read the file
    const fileContent = this.read()

    // Parse the file
    this.tomlContent = toml.parse(fileContent)
    this.oldVersion = objectPath.get(this.fileContent, this.versionPath, null)
  }

  /**
   * Bumps the version in the package.json
   *
   * @param {!string} releaseType - The type of release
   * @return {*}
   */
  bump = async (releaseType) => {
    // Get the new version
    this.newVersion = await bumpVersion(
      releaseType,
      this.oldVersion,
    )

    // Update the file
    if (this.oldVersion) {
      // Get the name of where the version is in
      const versionName = this.versionPath.split('.').pop()

      core.info(`Bumped file "${this.fileLocation}" from "${this.oldVersion}" to "${this.newVersion}"`)

      this.update(
        // We use replace instead of yaml.stringify so we can preserve white spaces and comments
        this.fileContent.replace(
          `${versionName} = "${this.oldVersion}"`,
          `${versionName} = "${this.newVersion}"`,
        ),
      )
    } else {
      // Update the content with the new version
      objectPath.set(this.tomlContent, this.versionPath, this.newVersion)
      this.update(toml.stringify(this.tomlContent))
    }
  }

}

