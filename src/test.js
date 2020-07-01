const conventionalRecommendedBump = require('conventional-recommended-bump')

async function run() {
  conventionalRecommendedBump({ preset: 'angular', tagPrefix: 'v' }, async(error, recommendation, tag) => {
    console.log(recommendation, tag)
  })
}

run()
