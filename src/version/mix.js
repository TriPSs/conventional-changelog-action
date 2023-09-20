const exec = require('@actions/exec')
const path = require('path')

const BaseVersioning = require('./base')
const bumpVersion = require('../helpers/bumpVersion')

module.exports = class Mix extends BaseVersioning {
  /**
   * Bumps the version in the package.json
   *
   * @param {!string} releaseType - The type of release
   * @return {*}
   */
  bump = async (releaseType) => {
    // elixir is very structured and assumes a specific file name (mix.exs)
    const mixDirectory = path.dirname(this.fileLocation)

    let execOutput = ''
    const options = {
      cwd: mixDirectory,
      listeners: {
        stdout: (data) => {
          execOutput += data.toString()
        },
      },
    }

    const exitCode = await exec.exec(`mix run -e "IO.puts Mix.Project.config()[:version]"`, null, options)

    if (exitCode !== 0) {
      throw new Error(`Failed to extract mix project version exited with code ${exitCode}.`)
    }

    this.oldVersion = execOutput.trim()

    this.newVersion = await bumpVersion(
      releaseType,
      this.oldVersion,
    )

    const fileContent = this.read()
    this.update(
      fileContent.replace(`version: "${this.oldVersion}"`, `version: "${this.newVersion}"`)
    )
  }
}
