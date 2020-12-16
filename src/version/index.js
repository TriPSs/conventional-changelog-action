const Json = require('./json')
const Git = require('./git')
const Yaml = require('./yaml')
const Toml = require('./toml')

module.exports = (fileExtension) => {
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

    default:
      return null
  }
}
