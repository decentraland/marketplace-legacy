export function isDuplicatedConstraintError(
  error: string | { [message: string]: string } = {}
): boolean {
  const errorMessage = typeof error === 'string' ? error : error.message
  const duplicateErrorRegexp = /duplicate key value violates unique constraint ".+"/

  return errorMessage.search(duplicateErrorRegexp) !== -1
}
