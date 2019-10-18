const path = require('path')
const fs = require('fs')

module.exports = {

  /**
   * Get's the project package.json
   * @return {any}
   */
  get: () => {
    const packageJsonLoc = path.resolve('./', 'package.json')

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
        major = major + 1
        minor = 0
        patch = 0
        break

      case 'minor':
        minor = minor + 1
        patch = 0
        break

      default:
        patch = patch + 1
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
