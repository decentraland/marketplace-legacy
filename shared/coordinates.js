// A set of helpers to work with (x, y) coordinates

/**
 * Returns a string represeting a (x, y) coordinate. Throws if x or y are not defined
 * @param  {number} x
 * @param  {number} y
 * @return {string}
 */
export function buildCoordinate(x, y) {
  if (x == null || y == null) {
    throw new Error(
      `You need to supply both coordinates to be able to hash them. x = ${x} y = ${y}`
    )
  }

  return `${x},${y}`
}

/**
 * Split coordinate string into an array. Throws on invalid coords like "a,2"
 * @param  {string|array} coordinate
 * @return {array} The result array. From "1, 2" to [1, 2] and from [1, 2] to a new [1, 2]
 */
export function splitCoordinate(coordinate) {
  validateCoordinate(coordinate)

  const [x, y] = coordinate
    .toString()
    .split(',')
    .map(coordinate => parseInt(coordinate, 10))
    .filter(coordinate => !!coordinate)

  return [x, y]
}

/**
 * Takes an array of { x, y } pairs and splits them into x and y arrays
 * @param  {Array<object>} pairs - Array of { x, y } pairs
 * @return {Object} coordinates  - Object with a x[] and y[] properties
 */
export function splitCoodinatePairs(pairs) {
  const x = []
  const y = []

  for (const pair of pairs) {
    x.push(pair.x)
    y.push(pair.y)
  }

  return { x, y }
}

/**
 * Expects an string or array of the form "x, y". Throws if the input is invalid
 * @param {string|array} coordinates
 */
export function validateCoordinate(coordinate) {
  if (!isValid(coordinate)) {
    throw new Error(`The coordinate "${coordinate}" are not valid`)
  }
}

/**
 * Expects an string or array of the form "x, y". Throws if the input is invalid
 * @param {string|array} coordinates
 */
export function isValid(coordinate) {
  const match = coordinate.toString().match(/^-?(\d+)\s*,\s*-?(\d+)$/)
  return !!match
}
