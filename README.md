# promise-flowcontrol

[![Build Status](https://img.shields.io/travis/queicherius/promise-flowcontrol.svg?style=flat-square)](https://travis-ci.org/queicherius/promise-flowcontrol)
[![Coverage Status](https://img.shields.io/codecov/c/github/queicherius/promise-flowcontrol/master.svg?style=flat-square)](https://codecov.io/github/queicherius/promise-flowcontrol)

> Wrapping the [async](https://github.com/caolan/async) library to support working with promises. This enables you to pass promise-generating functions to the `parallel` and `series` methods and returns a promise instead of having to specify a callback

## Install

```
npm install promise-flowcontrol
```

This module can be used for Node.js as well as browsers using [Browserify](https://github.com/substack/browserify-handbook#how-node_modules-works).

## Usage

### Basic usage

```js
import async from 'promise-flowcontrol'

// Note: promisesArray expects to be built out of *functions*
// that return promises, because else the promises start 
// instantly and can't be run in series anymore.
let promiseArray = [
  () => new Promise(resolve => resolve('Test.')),
  // ...
]

// Work on all promises in parallel
async.parallel(promiseArray)
  .then(results => console.log(results))

// Work on the promises in series
async.series(promiseArray)
  .then(results => console.log(results))
```

### API

- **parallel(tasks, [limit], [silenceErrors])**
    - `tasks` - List of promise-returning functions
    - `limit` - Optional concurrency limit
    - `silenceErrors` - If optionally set to `true`, ignore errors in the promises and return `null` for failed promises instead
- **series(tasks, [silenceErrors])**
    - `tasks` - List of promise-returning functions
    - `silenceErrors` - If optionally set to `true`, ignore errors in the promises and return `null` for failed promises instead

## Tests

```
npm test
```

## Licence

MIT
