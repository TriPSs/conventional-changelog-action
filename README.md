# Conventional Changelog action

This action will bump version, tag commit and generate a changelog with conventional commits.

## Inputs

- **Required** `github-token`: Github token.
- **Optional** `git-message`: Commit message that is used when committing the changelog.
- **Optional** `preset`: Preset that is used from conventional commits. Default `angular`.
- **Optional** `tag-prefix`: Prefix for the git tags. Default `v`.
- **Optional** `output-file`: File to output the changelog to. Default `CHANGELOG.md`.
- **Optional** `changelog-release-count`: FNumber of releases to preserve in changelog. Default `5`, use `0` to regenerate all.

## Example usage

```yaml
- name: Conventional Changelog Action
  uses: TriPSs/conventional-changelog-action@v1.2.0
  with:
    github-token: ${{ secrets.github_token }}
    git-message: 'chore(release): {version}'
    preset: 'angular'
    tag-prefix: 'v'
    output-file: 'CHANGELOG.md'
    changelog-release-count: 5
```
