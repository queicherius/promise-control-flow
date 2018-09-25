# promise-control-flow

[![Build Status](https://img.shields.io/travis/queicherius/promise-control-flow.svg?style=flat-square)](https://travis-ci.org/queicherius/promise-control-flow)
[![Coverage Status](https://img.shields.io/codecov/c/github/queicherius/promise-control-flow/master.svg?style=flat-square)](https://codecov.io/github/queicherius/promise-control-flow)

> Wrapping the [contra](https://github.com/bevacqua/contra) library to support working with promises. This enables you to pass promise-generating functions to the `parallel` and `series` methods and returns a promise instead of having to specify a callback

## Install

```
npm install promise-control-flow
```

This module can be used for Node.js as well as browsers using [Browserify](https://github.com/substack/browserify-handbook#how-node_modules-works).

## Usage

### Basic usage

```js
const flow = require('promise-control-flow')

// Note: promisesArray expects to be built out of *functions*
// that return promises, because else the promises start 
// instantly and can't be run in series anymore.
let promiseArray = [
  () => new Promise(resolve => resolve('Test.')),
  // ...
]

// Work on all promises in parallel
flow.parallel(promiseArray)
  .then(results => console.log(results))

// Work on the promises in series
flow.series(promiseArray)
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
