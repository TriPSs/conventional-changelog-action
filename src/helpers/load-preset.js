/**
 * Skips loading of the "angular" preset as that one is compiled with this action
 */
module.exports.loadPreset = async(preset) => {
  switch (preset) {
    case 'angular':
    case 'conventionalcommits':
      return null

    default:
      return preset
  }
}

/**
 * Loads the "angular" preset, so it works with ncc compiled dist, if user provided own config
 * that one will be used instead
 */
module.exports.loadPresetConfig = async(preset, providedConfig = {}) => {
  if (providedConfig && typeof providedConfig === 'object') {
    return providedConfig
  }

  switch (preset) {
    case 'angular':
      return await require('conventional-changelog-angular')()

    case 'conventionalcommits':
      return await require('conventional-changelog-conventionalcommits')()

    default:
      return {}
  }
}
