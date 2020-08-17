'use strict'
const config = require('conventional-changelog-conventionalcommits');

module.exports = config({
    "types": [
        { type: 'feat', section: 'New Features' },
        { type: 'fix', section: 'Bugs' }
    ]
})