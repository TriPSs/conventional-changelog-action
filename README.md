# Conventional Changelog action

This action will bump version, tag commit and generate a changelog with conventional commits.

## Inputs

- **Optional** `github-token`: Github token, if different permissions required than from checkout.
- **Optional** `git-message`: Commit message that is used when committing the changelog.
- **Optional** `git-user-name`: The git user.name to use for the commit. Default `Conventional Changelog Action`
- **Optional** `git-user-email`: The git user.email to use for the commit. Default `conventional.changelog.action@github.com`
- **Optional** `git-pull-method`: The git pull method used when pulling all changes from remote. Default `--ff-only`
- **Optional** `git-push`: Push all the GIT changes. Default `true`
- **Optional** `git-branch`: The branch used to push. Default is the current branch (`${{ github.ref }}`)
- **Optional** `git-url`: Git repository domain. Default is `github.com`
- **Optional** `git-path`: Path filter for the logs and version. If set, only commits that match the path filter will be considered. By default, we won't use this feature(empty string).
- **Optional** `preset`: Preset that is used from conventional commits. Default is `angular` ([learn more about presents here](https://github.com/TriPSs/conventional-changelog-action/issues/223))
- **Optional** `tag-prefix`: Prefix for the git tags. Default `v`.
- **Optional** `input-file`: Read the changelog from this file. This will prepend the newly generated changelogs to the file's content.
- **Optional** `output-file`: File to output the changelog to. Default `CHANGELOG.md`, when providing `'false'` no file will be generated / updated.
- **Optional** `release-count`: Number of releases to preserve in changelog. Default `5`, use `0` to regenerate all. This input has no effect if `input-file` is used.
- **Optional** `version-file`: The path to the file that contains the version to bump (supports comma-separated list of file paths). Default `./package.json`. Other supported formats are `mix.exs`, `.toml`, `.yml`, `.yaml`, and `.json`.
- **Optional** `version-path`: The place inside the version file to bump. Default `version`.
- **Optional** `skip-git-pull`: Do not pull the repo before tagging. Ensure you full cloned the repo in the first place to get tags. Default `'false'`.
- **Optional** `skip-on-empty`: Boolean to specify if you want to skip empty release (no-changelog generated). This case occurred when you push `chore` commit with `angular` for example. Default `'true'`.
- **Optional** `skip-version-file`: Do not update the version file. Default `'false'`.
- **Optional** `skip-commit`: Do not create a release commit. Default `'false'`.
- **Optional** `skip-tag`: Do not tag the release. Helpful for using action to check if a release is going to be made. Default `'false'`.
- **Optional** `pre-commit`: Path to the pre-commit script file. No hook by default.
- **Optional** `fallback-version`: The fallback version, if no older one can be detected, or if it is the first one. Default `'0.1.0'`. If `pre-release`is set to `true` it will default to the configured pre-release format (i.e. `'0.1.0-rc.0'`)
- **Optional** `config-file-path`: Path to the conventional changelog config file. If set, the preset setting will be ignored
- **Optional** `pre-changelog-generation`: Path to the pre-changelog-generation script file. No hook by default.
- **Optional** `skip-ci`: Adds instruction to Github to not consider the push something to rebuild. Default `true`.
- **Optional** `create-summary`: Adds the generated changelog as Action Summary. Default `false`.
- **Optional** `pre-release`: Marks the release as pre-release. Default `false`.
- **Optional** `pre-release-identifier`: The identifier to use for the pre-release. Default `rc`.
- **Optional** `skip-bump`: Prevents the action from bumping the version.
- **Optional** `is-protected-branch`: If set to `true`, the action will wait for required checks to pass before proceeding. Default `false`.

### Presets

This action comes pre-compiled with the `angular` (default) and `conventionalcommits`, if you wish to use an other preset
you need to make sure it's installed with `npm install conventional-changelog-<preset name>`

### Pre-Commit hook

> Function in a specified file will be run right before the git-add-git-commit phase, when the next
> version is already known and a new changelog has been generated. You can run any chores across your
> repository that should be added and committed with the release commit.

Specified path could be relative or absolute. If it is relative, then it will be based on the `GITHUB_WORKSPACE` path.

Script should:

- be a CommonJS module
- have a single export: `exports.preCommit = (props) => { /* ... */ }`
- not have any return value
- be bundled (contain all dependencies in itself, just like the bundled webapp)

`preCommit` function can be `async`.

Following props will be passed to the function as a single parameter:

```typescript
interface Props {
  tag: string; // Next tag e.g. v1.12.3
  version: string; // Next version e.g. 1.12.3
}

export function preCommit(props: Props): void {}
```

A bunch of useful environment variables are available to the script with `process.env`. See [docs.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables](https://docs.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables) to learn more.

### Pre-Changelog-Generation hook

> Function in a specified file will be run right before the changelog generation phase, when the next
> version is already known, but it was not used anywhere yet. It can be useful if you want to manually update version or tag.

Same restrictions as for the pre-commit hook, but exported functions names should be `preVersionGeneration` for modifications to the version and `preTagGeneration` for modifications to the git tag.

Following props will be passed to the function as a single parameter and same output is expected:

```typescript
// Next version e.g. 1.12.3
export function preVersionGeneration(version: string): string {}

// Next tag e.g. v1.12.3
export function preTagGeneration(tag: string): string {}
```

### Config-File-Path

A config file to define the conventional commit settings. Use it if you need to override values like `issuePrefix` or `issueUrlFormat`. If you set a `config-file-path`, the `preset` setting will be ignored. Therefore use an existing config and override the values you want to adjust.

example:

```javascript
'use strict'
const config = require('conventional-changelog-conventionalcommits');

module.exports = config({
    "issuePrefixes": ["TN-"],
    "issueUrlFormat": "https://jira.example.com/browse/{{prefix}}{{id}}",
})
```

The specified path can be relative or absolute. If it is relative, then it will be based on the `GITHUB_WORKSPACE` path.

Make sure to install all required packages in the workflow before executing this action.

## Outputs

- `changelog`: The generated changelog for the new version.
- `clean_changelog`: The generated changelog for the new version without the version name in it (Better for Github releases)
- `version`: The new version.
- `tag`: The name of the generated tag.
- `skipped`: Boolean (`'true'` or `'false'`) specifying if this step have been skipped

## Example usages

Uses all the defaults

```yaml
permissions:
  contents: write

- name: Conventional Changelog Action
  uses: TriPSs/conventional-changelog-action@v5
  with:
    github-token: ${{ secrets.github_token }}
```

Write permissions are required in order to enable `git push` when a new version is generated. In some configurations, the
default `secrets.github_token` may not have the correct permissions. You can check your default permissions by looking at
"Set up job" section of your GitHub action run log.

Overwrite everything

```yaml
- name: Conventional Changelog Action
  uses: TriPSs/conventional-changelog-action@v5
  with:
    github-token: ${{ secrets.github_token }}
    git-message: 'chore(release): {version}'
    git-user-name: 'Awesome Changelog Action'
    git-user-email: 'awesome_changelog@github.actions.com'
    preset: 'angular'
    tag-prefix: 'v'
    output-file: 'MY_CUSTOM_CHANGELOG.md'
    release-count: '10'
    version-file: './my_custom_version_file.json' // or .yml, .yaml, .toml, mix.exs
    version-path: 'path.to.version'
    skip-on-empty: 'false'
    skip-version-file: 'false'
    skip-commit: 'false'
    git-branch: 'my-maintenance-branch'
```

No file changelog

```yaml
- name: Conventional Changelog Action
  uses: TriPSs/conventional-changelog-action@v5
  with:
    github-token: ${{ secrets.github_token }}
    output-file: "false"
```

Tag only

```yaml
- name: Conventional Changelog Action
  uses: TriPSs/conventional-changelog-action@v5
  with:
    github-token: ${{ secrets.github_token }}
    skip-commit: "true"
```

Skip Git Pull
In CI you might not want to pull extra changes before tagging e.g. if running a long build before tagging, another commit may have come into the branch which would get pulled leading to tagging a different commit to the one which was built.

```yaml
- name: Checkout repository
  uses: actions/checkout@v4
  with:
    fetch-depth: 0

- name: Conventional Changelog Action
  uses: TriPSs/conventional-changelog-action@v5
  with:
    github-token: ${{ secrets.github_token }}
    skip-git-pull: "true"
```

Use a custom file for versioning

```yaml
- name: Conventional Changelog Action
  uses: TriPSs/conventional-changelog-action@v5
  with:
    github-token: ${{ secrets.github_token }}
    version-file: "my-custom-file.yaml"
```

Use a pre-commit hook

```yaml
- name: Conventional Changelog Action
  uses: TriPSs/conventional-changelog-action@v5
  with:
    github-token: ${{ secrets.github_token }}
    pre-commit: some/path/pre-commit.js
```

Github releases

```yaml
- name: Conventional Changelog Action
  id: changelog
  uses: TriPSs/conventional-changelog-action@v5
  with:
    github-token: ${{ secrets.github_token }}
    output-file: "false"

- name: Create Release
  uses: actions/create-release@v1
  if: ${{ steps.changelog.outputs.skipped == 'false' }}
  env:
    GITHUB_TOKEN: ${{ secrets.github_token }}
  with:
    tag_name: ${{ steps.changelog.outputs.tag }}
    release_name: ${{ steps.changelog.outputs.tag }}
    body: ${{ steps.changelog.outputs.clean_changelog }}
```

Use a deploy key

If you want to trigger another GitHub action based on pushed tag, you can use Deploy Key,
To make full use of the Deploy Key, you must set the value of github-token input to empty string.

```yaml
- name: Checkout GitHub Action
  uses: actions/checkout@v4
  with:
    ssh-key: ${{ secrets.SSH_DEPLOY_KEY }}
- name: Conventional Changelog Action
  id: changelog
  uses: TriPSs/conventional-changelog-action@v5
  with:
    github-token: ""
```

## Development

If you'd like to contribute to this project, all you need to do is clone and install [act](https://github.com/nektos/act) this project and run:

> Note: The image used is 18 gb!

```shell
$ npm install

# To run / test one specific job
$ act -j <workflow job name> -P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-22.04 --quiet
# Example
$ act -j test-json -P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-22.04 --quiet

# To run all tests
$ act pull_request -P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-22.04 --quiet
```

## [License](./LICENSE)

Conventional Changelog Action is [MIT licensed](./LICENSE).

## Collaboration

If you have questions or [issues](https://github.com/TriPSs/conventional-changelog-action/issues), please [open an issue](https://github.com/TriPSs/conventional-changelog-action/issues/new)!
