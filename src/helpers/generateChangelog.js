const fs = require('fs')
const conventionalChangelog = require('conventional-changelog')

module.exports.generateStringChangelog = (tagPrefix, preset, jsonPackage, releaseCount) => new Promise((resolve, reject) => {
  const changelogStream = conventionalChangelog({
      preset,
      releaseCount: parseInt(releaseCount, 10),
      tagPrefix,
    },
    {
      version: jsonPackage.version,
      currentTag: `${tagPrefix}${jsonPackage.version}`,
    },
  )

  let changelog = ''

  changelogStream
    .on('data', (data) => {
      changelog += data.toString()
    })
    .on('end', () => resolve(changelog))
})

module.exports.generateFileChangelog = (tagPrefix, preset, jsonPackage, fileName, releaseCount) => new Promise((resolve) => {
  const changelogStream = conventionalChangelog({
      preset,
      releaseCount: parseInt(releaseCount, 10),
      tagPrefix,
    },
    {
      version: jsonPackage.version,
      currentTag: `${tagPrefix}${jsonPackage.version}`,
    },
  )

  changelogStream
    .pipe(fs.createWriteStream(fileName))
    .on('finish', resolve)
})
