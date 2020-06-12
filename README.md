# Conventional Changelog action

This action will bump version, tag commit and generate a changelog with conventional commits.

## Inputs

- **Required** `github-token`: Github token.
- **Optional** `git-message`: Commit message that is used when committing the changelog.
- **Optional** `preset`: Preset that is used from conventional commits. Default `angular`.
- **Optional** `tag-prefix`: Prefix for the git tags. Default `v`.
- **Optional** `output-file`: File to output the changelog to. Default `CHANGELOG.md`, when providing `'false'` no file will be generated / updated.
- **Optional** `release-count`: Number of releases to preserve in changelog. Default `5`, use `0` to regenerate all.
- **Optional** `package-json`: The path to the package.json to use. Default `./package.json`.
- **Optional** `skip-on-empty`: Boolean to specify if you want to skip empty release (no-changelog generated). This case occured when you push `chore` commit with `angular` for example. Default `'false'`.

## Outputs

- `changelog`: The generated changelog for the new version.
- `clean_changelog`: The generated changelog for the new version without the version name in it (Better for Github releases)
- `version`: The new version.
- `tag`: The name of the generated tag.
- `skipped`: Boolean (`'true'` or `'false'`) specifying if this step have been skipped

## Example usages

Uses all the defaults

```yaml
- name: Conventional Changelog Action
  uses: TriPSs/conventional-changelog-action@v2
  with:
    github-token: ${{ secrets.github_token }}
```

Overwrite everything

```yaml
- name: Conventional Changelog Action
  uses: TriPSs/conventional-changelog-action@v2
  with:
    github-token: ${{ secrets.github_token }}
    git-message: 'chore(release): {version}'
    preset: 'angular'
    tag-prefix: 'v'
    output-file: 'CHANGELOG.md'
    release-count: '5'
    package-json: './package.json'
    skip-on-empty: 'false'
```

No file changelog

```yaml
- name: Conventional Changelog Action
  uses: TriPSs/conventional-changelog-action@v2
  with:
    github-token: ${{ secrets.github_token }}
    output-file: 'false'
```

Github releases

```yaml
- name: Conventional Changelog Action
  id: changelog
  uses: TriPSs/conventional-changelog-action@v2
  with:
    github-token: ${{ secrets.github_token }}
    output-file: 'false'
    skip-on-empty: 'true'

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
