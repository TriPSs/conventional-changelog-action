const Json = require('./json')
const Git = require('./git')
const Yaml = require('./yaml')
const Toml = require('./toml')
const Mix = require('./mix')

module.exports = (fileExtension, filePath, versionPath) => {
  switch (fileExtension.toLowerCase()) {
    case 'json':
      return new Json(filePath, versionPath)

    case 'yaml':
    case 'yml':
      return new Yaml(filePath, versionPath)

    case 'toml':
      return new Toml(filePath, versionPath)

    case 'git':
      return new Git(filePath, versionPath)

    case 'exs':
      return new Mix(filePath, versionPath)

    default:
      throw new Error(`File extension "${fileExtension}" from file "${filePath}" is not supported`)
  }
}
