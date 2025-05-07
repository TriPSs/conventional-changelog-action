const core = require('@actions/core')
const semver = require('semver')
const { exec } = require('child_process');

const requireScript = require('./requireScript')

// 执行 git 命令获取当前分支名
const getCurrentBranch = () => {
  return new Promise((resolve, reject) => {
    exec('git rev-parse --abbrev-ref HEAD', (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        reject(new Error(stderr));
        return;
      }
      resolve(stdout.trim());
    });
  });
};
const getPrereleaseFlag = async () => {
  let prerelease = core.getBooleanInput('pre-release')
  let identifier = core.getInput('pre-release-identifier')
  try {
    const currentBranch = await getCurrentBranch();
    const rcMatch = currentBranch.match(/^rc\//);
    const betaMatch = currentBranch.match(/^beta\//);
    
    core.info('currentBranch', currentBranch);
    core.info('rcMatch', rcMatch);
    core.info('betaMatch', betaMatch);
    
    if (rcMatch || betaMatch) {
      prerelease = true;
      identifier = rcMatch ? 'rc' : 'beta';
    }
  } catch (error) {
    core.warning(`Failed to get current git branch: ${error.message}`);
    // 若获取分支失败，使用输入值作为后备
  }
  
  return [prerelease, identifier]
}

/**
 * Bumps the given version with the given release type
 *
 * @param releaseType
 * @param version
 * @returns {string}
 */
module.exports = async (releaseType, version) => {
  let newVersion
  
  // const prerelease = core.getBooleanInput('pre-release')
  // const identifier = core.getInput('pre-release-identifier')
  const [prerelease, identifier] = await getPrereleaseFlag()
  
  if (version) {
    newVersion = semver.inc(version, (prerelease ? `pre${releaseType}` : releaseType), identifier)
  } else {
    
    const fallbackVersion = core.getInput('fallback-version')
    
    if (fallbackVersion) {
      newVersion = semver.valid(fallbackVersion)
    }
    
    if (!newVersion) {
      // default
      newVersion = (prerelease ? `0.1.0-${identifier}.0` : '0.1.0')
    }
    
    core.info(`The version could not be detected, using fallback version '${newVersion}'.`)
  }
  
  const preChangelogGenerationFile = core.getInput('pre-changelog-generation')
  
  if (preChangelogGenerationFile) {
    const preChangelogGenerationScript = requireScript(preChangelogGenerationFile)
    
    // Double check if we want to update / do something with the version
    if (preChangelogGenerationScript && preChangelogGenerationScript.preVersionGeneration) {
      const modifiedVersion = await preChangelogGenerationScript.preVersionGeneration(newVersion)
      
      if (modifiedVersion) {
        core.info(`Using modified version "${modifiedVersion}"`)
        newVersion = modifiedVersion
      }
    }
  }
  
  return newVersion
}
