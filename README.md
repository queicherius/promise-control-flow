# async-promises

[![Build Status](https://img.shields.io/travis/gw2efficiency/async-promises.svg?style=flat-square)](https://travis-ci.org/gw2efficiency/async-promises)
[![Coverage Status](https://img.shields.io/codecov/c/github/gw2efficiency/async-promises/master.svg?style=flat-square)](https://codecov.io/github/gw2efficiency/async-promises)

> Wrapping promises with the [async](https://github.com/caolan/async) library. This enables you to
> pass promise-generating functions to the `parallel` and `series` methods and returns a promise instead of having to specify a callback

*This is part of [gw2efficiency](https://gw2efficiency.com). Please report all issues in [the central repository](https://github.com/gw2efficiency/issues/issues).*

## Install

```
npm install gw2e-async-promises
```

This module can be used for Node.js as well as browsers using [Browserify](https://github.com/substack/browserify-handbook#how-node_modules-works).

## Usage

```js
const async = require('gw2e-async-promises')

// Note: promisesArray expects to be built out of *functions*
// that return promises, because else the promises start 
// instantly and can't be run in series anymore.
let promiseArray = [
  () => new Promise(resolve => resolve('Test.')),
  // ...
]

// Await
let results = await async.parallel(promiseArray)
let results = await async.series(promiseArray)

// Promises
async.parallel(promiseArray).then(results => console.log(results))
async.series(promiseArray).then(results => console.log(results))
```

## Tests

```
npm test
```

## Licence

MIT
