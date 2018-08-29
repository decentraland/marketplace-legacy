import { raw } from './SQL'

export function isDuplicatedConstraintError(error = {}) {
  const errorMessage = typeof error === 'string' ? error : error.message
  const duplicateErrorRegexp = /duplicate key value violates unique constraint ".+"/

  return errorMessage.search(duplicateErrorRegexp) !== -1
}

export function toRawStrings(arr) {
  const strings = arr.map(str => `'${str}'`).join(',')
  return raw(strings)
}
