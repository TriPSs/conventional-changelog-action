const path = require('path')
const fs = require('fs')
const core = require('@actions/core')

const packageJsonLoc = path.resolve(core.getInput('package-json'))

module.exports = {

  /**
   * Get's the project package.json
   * @return {any}
   */
  get: () => {
    return JSON.parse(fs.readFileSync(packageJsonLoc))
  },

  /**
   * Bumps the version in the package.json
   *
   * @param packageJson
   * @param releaseType
   * @return {*}
   */
  bump: (packageJson, releaseType) => {
    let [major, minor, patch] = packageJson.version.split('.')

    switch (releaseType) {
      case 'major':
        major = parseInt(major, 10) + 1
        minor = 0
        patch = 0
        break

      case 'minor':
        minor = parseInt(minor, 10) + 1
        patch = 0
        break

      default:
        patch = parseInt(patch, 10) + 1
    }

    // Update the package.json with the new version
    packageJson.version = `${major}.${minor}.${patch}`

    return packageJson
  },

  /**
   * Update package.json
   *
   * @param packageJson
   * @return {*}
   */
  update: (packageJson) => (
    fs.writeFileSync(packageJsonLoc, JSON.stringify(packageJson, null, 2))
  ),

}
