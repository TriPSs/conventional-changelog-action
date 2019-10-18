const conventionalChangelog = require('conventional-changelog')

module.exports = (tagPrefix, preset, jsonPackage) => new Promise((resolve) => {
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
    .pipe(fs.createWriteStream('CHANGELOG.md'))
    .on('finish', resolve)
})
