const concurrent = require('contra/concurrent')
const isFunction = require('is-function')

module.exports = { series, parallel }

// Work on the tasks in series (one by one)
function series (promiseFunctions, silenceErrors = false) {
  return parallel(promiseFunctions, 1, silenceErrors)
}

// Work on the tasks in parallel, with a optional concurrency limit
function parallel (promiseFunctions, limit = Infinity, silenceErrors = false) {
  const contraMethod = (tasks, callback) => concurrent(tasks, limit, callback)
  return generatePromise(promiseFunctions, contraMethod, silenceErrors)
}

// Wrap the contra library with a promise, and convert the promise functions into callbacks
function generatePromise (promiseFunctions, contraMethod, silenceErrors) {
  return new Promise((resolve, reject) => {
    // Generate a function that executes the promise function and
    // calls back in a way that the contra library requires
    for (let i in promiseFunctions) {
      let promiseFunction = promiseFunctions[i]

      if (!isFunction(promiseFunction)) {
        return reject(new Error('One of the supplied promise functions is not a function'))
      }

      promiseFunctions[i] = (contraCallback) => {
        promiseFunction()
          .then(data => contraCallback(null, data))
          .catch(err => silenceErrors ? contraCallback(null, null) : contraCallback(err))
      }
    }

    contraMethod(promiseFunctions, (err, results) => {
      if (err) return reject(err)
      resolve(results)
    })
  })
}
