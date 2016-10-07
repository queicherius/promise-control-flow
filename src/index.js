import asyncParallel from 'async/parallel'
import asyncSeries from 'async/series'
import asyncParallelLimit from 'async/parallelLimit'

export default {parallel, series}

// Work on the tasks in parallel, with a optional concurrency limit
export function parallel (promiseFunctions, limit = false, silenceErrors = false) {
  const asyncFunction = !limit
    ? asyncParallel
    : (tasks, callback) => asyncParallelLimit(tasks, limit, callback)

  return generatePromise(promiseFunctions, asyncFunction, silenceErrors)
}

// Work on the tasks in series (one by one)
export function series (promiseFunctions, silenceErrors = false) {
  return generatePromise(promiseFunctions, asyncSeries, silenceErrors)
}

// Wrap the async library with a promise, and convert the promise functions into callbacks
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
