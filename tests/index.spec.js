/* eslint-env node, mocha */
import {expect} from 'chai'
import module from '../src/index.js'

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

describe('promise-flowcontrol', () => {
  it('can work on promises in parallel', async () => {
    let promises = [
      timeoutPromise(100),
      timeoutPromise(100),
      timeoutPromise(100)
    ]

    let timestamps = await module.parallel(promises)
    expect(timestamps[1] - timestamps[0]).to.be.below(25)
    expect(timestamps[2] - timestamps[1]).to.be.below(25)
  })

  it('can work on promises in parallel with a limit', async () => {
    let promises = [
      timeoutPromise(100),
      timeoutPromise(100),
      timeoutPromise(100),
      timeoutPromise(100)
    ]

    let timestamps = await module.parallel(promises, 2)
    expect(timestamps[1] - timestamps[0]).to.be.below(25)
    expect(timestamps[2] - timestamps[1]).to.be.above(95)
    expect(timestamps[3] - timestamps[2]).to.be.below(25)
  })

  it('can work on promises in series', async () => {
    let promises = [
      timeoutPromise(100),
      timeoutPromise(100),
      timeoutPromise(100)
    ]

    let timestamps = await module.series(promises)
    expect(timestamps[1] - timestamps[0]).to.be.above(95)
    expect(timestamps[2] - timestamps[1]).to.be.above(95)
  })

  it('can catch the promise error for parallel', async () => {
    let promises = [
      timeoutPromise(10, true),
      timeoutPromise(10, true),
      timeoutPromise(10, true)
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
      timeoutPromise(10, true),
      timeoutPromise(10, true),
      timeoutPromise(10, true)
    ]

    let err
    try {
      await module.series(promises)
    } catch (e) {
      err = e
    }

    expect(err.message).to.equal('Error')
  })

  it('can work on promises as an object', async () => {
    const promiseFunc = async (x) => x
    let promises = {
      one: () => promiseFunc('one-result'),
      two: () => promiseFunc('two-result'),
      three: () => promiseFunc('three-result')
    }

    let result = await module.parallel(promises)
    expect(result).to.deep.equal({
      one: 'one-result',
      two: 'two-result',
      three: 'three-result'
    })
  })

  it('supports silencing errors for parallel', async () => {
    const promiseFunc = async (x) => x
    const promiseError = async () => {
      throw new Error('Oh boy')
    }

    let promises = {
      one: () => promiseFunc('one-result'),
      two: () => promiseError(),
      three: () => promiseFunc('three-result')
    }

    let result = await module.parallel(promises, false, true)
    expect(result).to.deep.equal({
      one: 'one-result',
      two: null,
      three: 'three-result'
    })
  })

  it('supports silencing errors for series', async () => {
    const promiseFunc = async (x) => x
    const promiseError = async () => {
      throw new Error('Oh boy')
    }

    let promises = [
      () => promiseFunc('one-result'),
      () => promiseError(),
      () => promiseFunc('three-result')
    ]

    let result = await module.series(promises, true)
    expect(result).to.deep.equal([
      'one-result',
      null,
      'three-result'
    ])
  })

  it('throws an error for invalid promise functions', async () => {
    let promises = [
      false
    ]

    let err
    try {
      await module.parallel(promises)
    } catch (e) {
      err = e
    }

    expect(err.message).to.equal('One of the supplied promise functions is not a function')
  })
})
