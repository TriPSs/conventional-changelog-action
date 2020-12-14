const core = require('@actions/core')
const path = require('path')
const fs = require('fs')

/**
 * Requires an script
 *
 * @param file
 */
module.exports = (file) => {
  const fileLocation = path.resolve(process.cwd(), file)

  // Double check the script exists before loading it
  if (fs.existsSync(fileLocation)) {
    core.info(`Loading "${fileLocation}" script`)

    return require(fileLocation)
  }

  core.error(`Tried to load "${fileLocation}" script but it does not exists!`)

  return undefined
}
