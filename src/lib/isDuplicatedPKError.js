export function isDuplicatedPKError(error = {}) {
  const errorMessage = typeof error === 'string' ? error : error.message
  const duplicateErrorRegexp = /duplicate key value violates unique constraint ".+_pkey"/

  return errorMessage.search(duplicateErrorRegexp) !== -1
}
