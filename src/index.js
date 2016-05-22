const async = require('async')

function parallel (promiseFunctions, limit = false) {
  const asyncFunction = !limit
    ? async.parallel
    : (tasks, callback) => async.parallelLimit(tasks, limit, callback)

  return generatePromise(promiseFunctions, asyncFunction)
}

function series (promiseFunctions) {
  return generatePromise(promiseFunctions, async.series)
}

function generatePromise (promiseFunctions, asyncMethod) {
  return new Promise((resolve, reject) => {
    // Generate a function that executes the promise function and
    // calls back in a way that the async library requires
    let tasks = promiseFunctions.map(promiseFunction =>
      (callback) =>
        promiseFunction().then(
          data => callback(null, data),
          err => callback(err)
        )
    )

    asyncMethod(tasks, (err, results) => {
      if (err) {
        return reject(err)
      }
      resolve(results)
    })
  })
}

module.exports = {parallel, series}
