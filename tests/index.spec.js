/* eslint-env node, mocha */
const expect = require('chai').expect
const module = require('../src/index.js')

function timeoutPromise (ms, throwError = false) {
  return () => new Promise((resolve, reject) => {
    setTimeout(function () {
      let x = new Date().getTime()
      if (!throwError) {
        resolve(x)
      } else {
        reject({message: 'Error'})
      }
    }, ms)
  })
}

describe('async-promises', () => {
  it('can work on promises in parallel', async () => {
    let promises = [
      timeoutPromise(250),
      timeoutPromise(250),
      timeoutPromise(250)
    ]

    let timestamps = await module.parallel(promises)
    expect(timestamps[1] - timestamps[0]).to.be.below(20)
    expect(timestamps[2] - timestamps[1]).to.be.below(20)
  })

  it('can work on promises in series', async () => {
    let promises = [
      timeoutPromise(250),
      timeoutPromise(250),
      timeoutPromise(250)
    ]

    let timestamps = await module.series(promises)
    expect(timestamps[1] - timestamps[0]).to.be.above(250)
    expect(timestamps[2] - timestamps[1]).to.be.above(250)
  })

  it('can catch the promise error for parallel', async () => {
    let promises = [
      timeoutPromise(250, true),
      timeoutPromise(250, true),
      timeoutPromise(250, true)
    ]

    let err
    try {
      await module.parallel(promises)
    } catch (e) {
      err = e
    }

    expect(err.message).to.equal('Error')
  })

  it('can catch the promise error for series', async () => {
    let promises = [
      timeoutPromise(250, true),
      timeoutPromise(250, true),
      timeoutPromise(250, true)
    ]

    let err
    try {
      await module.series(promises)
    } catch (e) {
      err = e
    }

    expect(err.message).to.equal('Error')
  })
})
