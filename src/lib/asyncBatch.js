export async function asyncBatch(options = {}) {
  let {
    elements = [],
    callback = () => {},
    batchSize = elements.length
  } = options

  let result = []

  while (elements.length > 0) {
    const partialResult = await callback(elements.slice(0, batchSize))

    result = result.concat(partialResult)
    elements = elements.slice(batchSize)
  }

  return result
}
