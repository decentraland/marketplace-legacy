export async function asyncPool(promises, iteratorFn, poolLimit) {
  const result = []
  const executing = []

  for (const item of promises) {
    const promise = Promise.resolve().then(() => iteratorFn(item, promises))
    result.push(promise)

    const runningPromise = promise.then(() =>
      executing.splice(executing.indexOf(runningPromise), 1)
    )
    executing.push(runningPromise)

    if (executing.length >= poolLimit) {
      await Promise.race(executing)
    }
  }
  return Promise.all(result)
}
