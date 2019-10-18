# Conventional Changelog action

This action will bump version, tag commit and generate a changelog with conventional commits.

## Inputs

### `github-token`

**Required** Github token.

### `git-message`

**Optional** Commit message that is used when committing the changelog.

### `preset`

**Optional** Preset that is used from conventional commits. Default `angular`.

### `tag-prefix`

**Optional** Prefix for the git tags. Default `v`.

### `output-file`

**Optional** File to output the changelog to. Default `CHANGELOG.md`.

## Example usage

- name: Conventional Changelog Action
  uses: TriPSs/conventional-changelog-action@v0.0.1
  with:
    github-token: ${{ secrets.github_token }}
    git-message: 'chore(release): {version}'
    preset: 'angular'
    tag-prefix: 'v'
    output-file: 'CHANGELOG.md'
