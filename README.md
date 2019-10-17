# Conventional Changelog action

This action will generate a conventional changelog, tag the commit and push all the changes.

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

uses: actions/hello-world-javascript-action@v1
with:
  git-: 'Mona the Octocat'
