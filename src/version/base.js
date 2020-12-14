const fs = require('fs')

module.exports = class BaseVersioning {

  fileLocation = null

  versionPath = null

  newVersion = null

  /**
   * Set some basic configurations
   *
   * @param {!string} fileLocation - Full location of the file
   * @param {!string} versionPath - Path inside the file where the version is located
   */
  init = (fileLocation, versionPath) => {
    this.fileLocation = fileLocation
    this.versionPath = versionPath
  }

  /**
   * Get the file's content
   *
   * @return {string}
   */
  read = () => {
    return fs.existsSync(this.fileLocation) ? fs.readFileSync(this.fileLocation, 'utf8') : ''
  }

  /**
   * Logic for bumping the version
   *
   * @param {!string} releaseType - The type of release
   * @param {string} customVersion - Bump file with manually provided version
   * @return {*}
   */
  bump = (releaseType, customVersion) => {
    throw new Error('Implement bump logic in class!')
  }

  /**
   * Update the file
   *
   * @param {!string} newContent - New content for the file
   * @return {*}
   */
  update = (newContent) => (
    fs.writeFileSync(this.fileLocation, newContent)
  )

}

