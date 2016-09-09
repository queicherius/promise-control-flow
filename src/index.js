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
    for (let i in promiseFunctions) {
      let promiseFunction = promiseFunctions[i]

      promiseFunctions[i] = (asyncCallback) => {
        promiseFunction()
          .then(data => asyncCallback(null, data))
          .catch(err => asyncCallback(err))
      }
    }

    asyncMethod(promiseFunctions, (err, results) => {
      if (err) return reject(err)
      resolve(results)
    })
  })
}

module.exports = {parallel, series}
