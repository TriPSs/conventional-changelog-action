const JSON = require('./json')
const Git = require('./git')

module.exports = (fileExtension) => {
  switch (fileExtension.toLowerCase()) {
    case 'json':
      return JSON

    // case 'yaml':
    // case 'yml':
    //   return Yaml
    //
    // case 'toml':
    //   return Toml
    //
    case 'git':
      return Git

    default:
      return null
  }
}
