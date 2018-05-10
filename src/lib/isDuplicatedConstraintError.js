export function isDuplicatedConstraintError(error = {}) {
  const errorName = typeof error === 'string' ? error : error.name
  return errorName === 'SequelizeUniqueConstraintError'
}
