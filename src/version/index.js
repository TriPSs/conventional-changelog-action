const JSON = require('./json')
const Git = require('./git')
const Yaml = require('./yaml')

module.exports = (fileExtension) => {
  switch (fileExtension.toLowerCase()) {
    case 'json':
      return JSON
    case 'yaml':
    case 'yml':
      return Yaml


    case 'git':
      return Git

    default:
      return null
  }
}
