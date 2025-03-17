const core = require('@actions/core')
const properties = require('properties')
const fs = require('fs')

const BaseVersioning = require('./base')
const bumpVersion = require('../helpers/bumpVersion')

module.exports = class Properties extends BaseVersioning {
  propertiesContent = null
  fileContent = null

  /**
   * Reads and parses the properties file
   */
  parseFile = () => {
    this.propertiesContent = properties.parse(fs.readFileSync(this.fileLocation, 'utf8'), {
      separator: [':', '='],
    })
    this.oldVersion = this.propertiesContent[this.versionPath]
    this.fileContent = fs.readFileSync(this.fileLocation, 'utf8')
  }

  /**
   * Bumps the version in the properties file
   *
   * @param {!string} releaseType - The type of release
   * @return {*}
   */
  bump = async (releaseType) => {
    this.newVersion = await bumpVersion(releaseType, this.oldVersion)

    if (this.oldVersion) {
      // Directly replace the version in the file
      core.info(
        `Bumped file "${this.fileLocation}" from "${this.oldVersion}" to "${this.newVersion}"`
      )

      // Replace the version line in the file
      const updatedContent = this.fileContent.replace(
        new RegExp(`(${this.versionPath}\\s*[:=]\\s*)${this.oldVersion}`),
        `$1${this.newVersion}`
      )

      // Write back to the file
      this.update(updatedContent)
    } else {
      core.error(
        `Version path "${this.versionPath}" not found in properties file`
      )
    }
  }
}
