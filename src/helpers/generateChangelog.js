const fs = require('fs')
const { Readable } = require('stream');
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
 * @param skipUnstable
 * @returns {*}
 */
const getChangelogStream = (tagPrefix, preset, version, releaseCount, config, gitPath, skipUnstable) => conventionalChangelog({
    preset,
    releaseCount: parseInt(releaseCount, 10),
    tagPrefix,
    config,
    skipUnstable
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
 * @param skipUnstable
 * @returns {Promise<string>}
 */
module.exports.generateStringChangelog = (tagPrefix, preset, version, releaseCount, config, gitPath, skipUnstable) => new Promise((resolve, reject) => {
  const changelogStream = getChangelogStream(tagPrefix, preset, version, releaseCount, config, gitPath, skipUnstable)

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
 * @param infile
 * @returns {Promise<>}
 */
module.exports.generateFileChangelog = (tagPrefix, preset, version, fileName, releaseCount, config, gitPath, infile) => new Promise((resolve) => {
  const changelogStream = getChangelogStream(tagPrefix, preset, version, infile ? 1 : releaseCount, config, gitPath)

  // The default changelog output to be streamed first
  const readStreams = [changelogStream]

  // If an input-file is provided and release count is not 0
  if (infile) {
    // The infile is read synchronously to avoid repeatedly reading newly written content while it is being written
    const buffer = fs.readFileSync(infile);
    const readableStream = Readable.from(buffer);
    // We add the stream as the next item for later pipe
    readStreams.push(readableStream)
  }

  const writeStream = fs.createWriteStream(fileName)

  let currentIndex = 0;

  function pipeNextStream() {
    if (currentIndex < readStreams.length) {
      const currentStream = readStreams[currentIndex];

      currentStream.pipe(writeStream, { end: false });

      currentStream.once('end', () => {
        currentIndex++;
        pipeNextStream();
      });
    } else {
      // All stream pipes have completed
      writeStream.end();
      resolve();
    }
  }

  pipeNextStream();

})
