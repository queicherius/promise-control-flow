# async-promises

[![Build Status](https://img.shields.io/travis/gw2efficiency/async-promises.svg?style=flat-square)](https://travis-ci.org/gw2efficiency/async-promises)
[![Coverage Status](https://img.shields.io/codecov/c/github/gw2efficiency/async-promises/master.svg?style=flat-square)](https://codecov.io/github/gw2efficiency/async-promises)

> Wrapping promises with the [async](https://github.com/caolan/async) library. This enables you to
> pass promise-functions to the `parallel` and `series` methods and returns a promise instead of using callbacks

## Install

```
npm install https://github.com/gw2efficiency/async-promises
```

This module can be used for Node.js as well as browsers using [Browserify](https://github.com/substack/browserify-handbook#how-node_modules-works).

(Note: Babel gets pulled in as a dependency, because the module is written in ES7 and 
gets compiled into ES5 during the installation. The Babel code is **not** included in the module, 
don't be shocked at the dependency tree. :wink:)

## Usage

```js
const async = require('async-promises')

// ES7
let results = await async.parallel(promisesArray)
let results = await async.series(promisesArray)

// Promises
async.parallel(promisesArray).then(results => console.log(results)
async.series(promisesArray).then(results => console.log(results)

// Note: promisesArray expects to be built out of FUNCTIONS
// that return promises, because else the promises start 
// instantly and can't be run in series anymore.
let promisesArray = [
  () => new Promise(resolve => resolve('Test.'))
]
```

## Tests

```
npm test
```

## Licence

MIT
