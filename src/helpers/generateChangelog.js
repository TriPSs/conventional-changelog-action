const fs = require('fs')
const conventionalChangelog = require('conventional-changelog')

module.exports = (tagPrefix, preset, jsonPackage, fileName, releaseCount) => new Promise((resolve) => {
  const changelogStream = conventionalChangelog({
      preset,
      releaseCount: parseInt(releaseCount, 10)
    },
    {
      version: jsonPackage.version,
      currentTag: `${tagPrefix}${jsonPackage.version}`,
      tagPrefix,
    },
  )

  changelogStream
    .pipe(fs.createWriteStream(fileName))
    .on('finish', resolve)
})
