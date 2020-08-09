const objectPath = require('object-path')
const yaml = require('yaml')

const BaseVersioning = require('./base')
const bumpVersion = require('../helpers/bumpVersion')

module.exports = new (class Yaml extends BaseVersioning{

  /**
   * Bumps the version in the package.json
   *
   * @param {!string} releaseType - The type of release
   * @return {*}
   */
  bump = (releaseType) => {
    let yamlContent = {}
    let oldVersion

    // Read the file
    const fileContent = this.read()
    if (fileContent) {
      yamlContent = yaml.parse(fileContent)
      oldVersion = objectPath.get(yamlContent, this.versionPath)
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
          `${versionName}: '${oldVersion}'`,
          `${versionName}: '${this.newVersion}'`,
        ),
      )
    } else {
      // Update the content with the new version
      objectPath.set(yamlContent, this.versionPath, this.newVersion)
      this.update(yaml.stringify(yamlContent))
    }
  }

})

