const fs = require('fs')
const conventionalChangelog = require('conventional-changelog')

/**
 * Generates a changelog stream with the given arguments
 *
 * @param tagPrefix
 * @param preset
 * @param version
 * @param releaseCount
 * @param config
 * @param gitPath
 * @returns {*}
 */
const getChangelogStream = (tagPrefix, preset, version, releaseCount, config, gitPath) => conventionalChangelog({
    preset,
    releaseCount: parseInt(releaseCount, 10),
    tagPrefix,
    config
  },
  {
    version,
    currentTag: `${tagPrefix}${version}`,
  },
  {
    path: gitPath === '' || gitPath === null ? undefined : gitPath
  },
  config && config.parserOpts,
  config && config.writerOpts
)

module.exports = getChangelogStream

/**
 * Generates a string changelog
 *
 * @param tagPrefix
 * @param preset
 * @param version
 * @param releaseCount
 * @param config
 * @param gitPath
 * @returns {Promise<string>}
 */
module.exports.generateStringChangelog = (tagPrefix, preset, version, releaseCount, config, gitPath) => new Promise((resolve, reject) => {
  const changelogStream = getChangelogStream(tagPrefix, preset, version, releaseCount, config, gitPath)

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
 * @param config
 * @param gitPath
 * @returns {Promise<>}
 */
module.exports.generateFileChangelog = (tagPrefix, preset, version, fileName, releaseCount, config, gitPath) => new Promise((resolve) => {
  const changelogStream = getChangelogStream(tagPrefix, preset, version, releaseCount, config, gitPath)

  changelogStream
    .pipe(fs.createWriteStream(fileName))
    .on('finish', resolve)
})
