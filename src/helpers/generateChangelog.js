const fs = require('fs')
const conventionalChangelog = require('conventional-changelog')

module.exports = (tagPrefix, preset, jsonPackage, fileName, releaseCount) => new Promise((resolve) => {
  const changelogStream = conventionalChangelog({
      preset,
      releaseCount: parseInt(releaseCount, 10),
      tagPrefix
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
