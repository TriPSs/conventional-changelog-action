/**
 * Bumps the given version with the given release type
 *
 * @param releaseType
 * @param version
 * @returns {string}
 */
module.exports = (releaseType, version) => {
  let [major, minor, patch] = version.split('.')

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

  return `${major}.${minor}.${patch}`
}
