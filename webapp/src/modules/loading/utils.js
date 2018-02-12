export function removeLast(array, comparator) {
  const last = array.filter(comparator).pop()
  return array.filter(x => x !== last)
}
