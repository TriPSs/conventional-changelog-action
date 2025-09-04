const BaseVersioning = require('./base')
const bumpVersion = require('../helpers/bumpVersion')
const core = require("@actions/core");
const properties = require('properties')

module.exports = class Properties extends BaseVersioning {

  /**
   * @type {string | null}
   */
  fileContent = null

  /**
   * Reads and parses .properties file
   */
  parseFile = () => {
    this.fileContent = this.readFile()
    this.oldVersion = properties.parse(this.fileContent)[this.versionPath]
  }

  /**
   * Bumps the version in .properties file
   *
   * @param {!string} releaseType - The type of release
   * @return {*}
   */
  bump = async (releaseType) => {
    this.newVersion = await bumpVersion(
      releaseType,
      this.oldVersion,
    )

    // regex to capture key, separator and value in separate groups with whitespace
    // see: https://regexr.com/8gtpa
    const regex = new RegExp(`^(\\s*${this.versionPath}\\s*)(\\s*[:=]\\s*)(.*)$`, 'm')

    if (regex.test(this.fileContent)) {
      // replace existing version in file while preserving the separator and whitespaces
      this.update(
        this.fileContent.replace(
          regex,
          `$1$2${this.newVersion}`
        )
      )
    } else {
      // append new version to the end of the file and preserve previous newline character
      const eof = this.fileContent.endsWith('\n') ? '\n' : ''
      const newline = this.fileContent.length > 0 && !this.fileContent.endsWith('\n') ? '\n' : ''

      this.update(
        this.fileContent + newline + `${this.versionPath}=${this.newVersion}` + eof
      )
    }

    core.info(`Bumped file "${this.fileLocation}" from "${this.oldVersion}" to "${this.newVersion}"`)
  }

}
