const conventionalChangelog = require('conventional-changelog')

module.exports = (tagPrefix, preset, jsonPackage, fileName) => new Promise((resolve) => {
  const changelogStream = conventionalChangelog({
      preset,
      releaseCount: 5,
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
