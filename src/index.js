require('babel-polyfill')
const async = require('async')

function parallel (promiseFunctions) {
  return generatePromise(promiseFunctions, async.parallel)
}

function series (promiseFunctions) {
  return generatePromise(promiseFunctions, async.series)
}

function generatePromise (promiseFunctions, asyncMethod) {
  return new Promise((resolve, reject) => {
    let callbacks = promiseFunctions
      .map(promiseFunction =>
        async (callback) => {
          try {
            callback(null, await promiseFunction())
          } catch (err) {
            callback(err)
          }
        }
      )

    asyncMethod(callbacks, (err, results) => {
      if (err) {
        return reject(err)
      }
      resolve(results)
    })
  })
}

module.exports = {parallel, series}
