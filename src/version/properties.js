const BaseVersioning = require('./base')
const bumpVersion = require('../helpers/bumpVersion')

module.exports = class Properties extends BaseVersioning {

  fileContent = null

  #getProperty(content, key) {
    const regex = new RegExp(`^\\s*${key}\\s*[:=]\\s*(.*)$`, "m")
    const match = content.match(regex)
    return match ? match[1].trim() : null
  }

  #setProperty(content, key, value) {
    // https://regexr.com/8gtpa
    const regex = new RegExp(`^(\\s*${key}\\s*)([:=])(.*)$`, "m")

    if (regex.test(content)) {
      return content.replace(regex, (_, _key, sep) => `${key.trim()}${sep.trim()}${value}`)
    }
    else {
      if (content.length > 0 && !content.endsWith("\n")) {
        return content + `\n${key}=${value}`
      }
      return content + `${key}=${value}`
    }
  }

  /**
   * Reads and parses .properties file
   */
  parseFile = () => {
    this.fileContent = this.readFile()
    this.oldVersion = this.#getProperty(this.fileContent, this.versionPath)
  }

  /**
   * Bumps the version in .properties file
   *
   * @param {!string} releaseType - The type of release
   * @return {*}
   */
  bump = async(releaseType) => {
    this.newVersion = await bumpVersion(releaseType, this.oldVersion)

    this.update(
      this.#setProperty(this.fileContent, this.versionPath, this.newVersion)
    )
  }

}
