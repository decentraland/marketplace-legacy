export function isDuplicatedConstraintError(error = {}) {
  const errorMessage = typeof error === 'string' ? error : error.message
  const duplicateErrorRegexp = /duplicate key value violates unique constraint ".+"/

  return errorMessage.search(duplicateErrorRegexp) !== -1
}

export function getInStatus(status, defaultStatuses) {
  if (!status) {
    return Object.keys(defaultStatuses)
      .map(key => `'${defaultStatuses[key]}'}`)
      .join(',')
  }
  return status
    .split(',')
    .map(s => `'${s}'`)
    .join(',')
}
