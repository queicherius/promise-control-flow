const async = require('async')

function parallel (promiseFunctions, limit = false, silenceErrors = false) {
  const asyncFunction = !limit
    ? async.parallel
    : (tasks, callback) => async.parallelLimit(tasks, limit, callback)

  return generatePromise(promiseFunctions, asyncFunction, silenceErrors)
}

function series (promiseFunctions, silenceErrors = false) {
  return generatePromise(promiseFunctions, async.series, silenceErrors)
}

function generatePromise (promiseFunctions, asyncMethod, silenceErrors) {
  return new Promise((resolve, reject) => {
    // Generate a function that executes the promise function and
    // calls back in a way that the async library requires
    for (let i in promiseFunctions) {
      let promiseFunction = promiseFunctions[i]

      if (typeof promiseFunction !== 'function') {
        return reject(new Error('One of the supplied promise functions is not a function'))
      }

      promiseFunctions[i] = (asyncCallback) => {
        promiseFunction()
          .then(data => asyncCallback(null, data))
          .catch(err => silenceErrors ? asyncCallback(null, null) : asyncCallback(err))
      }
    }

    asyncMethod(promiseFunctions, (err, results) => {
      if (err) return reject(err)
      resolve(results)
    })
  })
}

module.exports = {parallel, series}
