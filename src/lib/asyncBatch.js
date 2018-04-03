export async function asyncBatch(options = {}) {
  let {
    elements = [],
    callback = () => {},
    batchSize = elements.length / 2,
    retryAttempts = 0
  } = options

  let result = []
  let batchedCount = 0

  while (elements.length > 0) {
    try {
      const batch = elements.slice(0, batchSize)
      const partialResult = await callback(batch, batchedCount, elements)

      result = result.concat(partialResult)
      elements = elements.slice(batchSize)
      batchedCount += batch.length
    } catch (error) {
      if (retryAttempts <= 0) throw error
      retryAttempts -= 1

      console.warn(
        `[asyncBatch] Retrying upon error ${
          error.message
        }. Attempts left ${retryAttempts}`
      )
    }
  }

  return result
}
