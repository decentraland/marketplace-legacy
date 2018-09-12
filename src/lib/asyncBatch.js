import ProgressBar from 'progress'

export async function asyncBatch(options = {}) {
  let {
    elements = [],
    retryAttempts = 0,
    logFormat = 'Processing [:bar] :percent :current/:total elements. ETA :eta seconds',
    batchSize,
    callback
  } = options

  if (!callback) throw new Error('[asyncBatch] A callback is required')

  if (typeof batchSize !== 'number') {
    batchSize = Number(batchSize)

    if (isNaN(batchSize)) {
      batchSize = elements.length / 2

      console.warn(
        `[asyncBatch] ${batchSize} as batch size, got ${options.batchSize}`
      )
    }
  }

  let result = []
  let batchedCount = 0

  const bar = new ProgressBar(logFormat, { total: elements.length })

  while (elements.length > 0) {
    try {
      const batch = elements.slice(0, batchSize)
      const partialResult = await callback(batch, batchedCount, elements)

      result = result.concat(partialResult)
      batchedCount += batch.length
      elements = elements.slice(batchSize)

      bar.tick(batch.length)
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
