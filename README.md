# Conventional Changelog action

This action will bump version, tag commit and generates changelog with conventional commits.

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

uses: actions/hello-world-javascript-action@v1
with:
  git-message: 'chore: Release {version}'
  github-token: ${{ secrets.github_token }}

