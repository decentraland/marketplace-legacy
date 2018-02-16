export function removeLast(array, comparator) {
  const last = array.filter(comparator).pop()
  return array.filter(x => x !== last)
}

export const getType = action => action.type.slice(10)
export const getStatus = action => action.type.slice(1, 8).toUpperCase()
