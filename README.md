# Conventional Changelog action

This action will bump version, tag commit and generate a changelog with conventional commits.

## Inputs

- **Required** `github-token`: Github token.
- **Optional** `git-message`: Commit message that is used when committing the changelog.
- **Optional** `preset`: Preset that is used from conventional commits. Default `angular`.
- **Optional** `tag-prefix`: Prefix for the git tags. Default `v`.
- **Optional** `output-file`: File to output the changelog to. Default `CHANGELOG.md`.
- **Optional** `release-count`: Number of releases to preserve in changelog. Default `5`, use `0` to regenerate all.
- **Optional** `package-json`: The path to the package.json to use. Default `./package.json`.

## Example usages

Uses all the defaults
```yaml
- name: Conventional Changelog Action
  uses: TriPSs/conventional-changelog-action@v2.1.0
  with:
    github-token: ${{ secrets.github_token }}
```

Overwrite everything
```yaml
- name: Conventional Changelog Action
  uses: TriPSs/conventional-changelog-action@v2.1.0
  with:
    github-token: ${{ secrets.github_token }}
    git-message: 'chore(release): {version}'
    preset: 'angular'
    tag-prefix: 'v'
    output-file: 'CHANGELOG.md'
    release-count: '5'
    package-json: './package.json'
```
