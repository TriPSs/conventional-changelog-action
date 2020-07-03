const fs = require('fs')
const conventionalChangelog = require('conventional-changelog')

/**
 * Generates a changelog stream with the given arguments
 *
 * @param tagPrefix
 * @param preset
 * @param version
 * @param releaseCount
 * @returns {*}
 */
const getChangelogStream = (tagPrefix, preset, version, releaseCount) => conventionalChangelog({
    preset,
    releaseCount: parseInt(releaseCount, 10),
    tagPrefix,
  },
  {
    version,
    currentTag: `${tagPrefix}${version}`,
  },
)

module.exports = getChangelogStream

/**
 * Generates a string changelog
 *
 * @param tagPrefix
 * @param preset
 * @param version
 * @param releaseCount
 * @returns {Promise<string>}
 */
module.exports.generateStringChangelog = (tagPrefix, preset, version, releaseCount) => new Promise((resolve, reject) => {
  const changelogStream = getChangelogStream(tagPrefix, preset, version, releaseCount)

  let changelog = ''

  changelogStream
    .on('data', (data) => {
      changelog += data.toString()
    })
    .on('end', () => resolve(changelog))
})

/**
 * Generates a file changelog
 *
 * @param tagPrefix
 * @param preset
 * @param version
 * @param fileName
 * @param releaseCount
 * @returns {Promise<>}
 */
module.exports.generateFileChangelog = (tagPrefix, preset, version, fileName, releaseCount) => new Promise((resolve) => {
  const changelogStream = getChangelogStream(tagPrefix, preset, version, releaseCount)

  changelogStream
    .pipe(fs.createWriteStream(fileName))
    .on('finish', resolve)
})
