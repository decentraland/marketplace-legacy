interface Option<T> {
  elements?: T[]
  callback: (batch: T[], batchedCount: number, elements: T[]) => Promise<void>
  batchSize?: number
  retryAttempts?: number
}

export async function asyncBatch<T>(options: Option<T>): Promise<void> {
  let {
    elements = [],
    callback,
    batchSize = elements.length / 2,
    retryAttempts = 0
  } = options

  let batchedCount = 0

  while (elements.length > 0) {
    try {
      const batch = elements.slice(0, batchSize)
      await callback(batch, batchedCount, elements)

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
}
