const Json = require('./json')
const Git = require('./git')
const Yaml = require('./yaml')
const Toml = require('./toml')
const Mix = require('./mix')

module.exports = (fileExtension, filePath) => {
  switch (fileExtension.toLowerCase()) {
    case 'json':
      return new Json()

    case 'yaml':
    case 'yml':
      return new Yaml()

    case 'toml':
      return new Toml()

    case 'git':
      return new Git()

    case 'exs':
      return new Mix()

    default:
      throw new Error(`File extension "${fileExtension}" from file "${filePath}" is not supported`)
  }
}
