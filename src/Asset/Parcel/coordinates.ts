export type SingleCoordinate = string | number
export interface Coordinate {
  x: SingleCoordinate
  y: SingleCoordinate
}
export type UnifiedCoordinate = string | number[]

/**
 * A set of helpers to work with (x, y) coordinates
 * @type {Object}
 */
export const coordinates = {
  /**
   * Takes an array of { x, y } pairs and splits them into x and y arrays
   * @param  {Array<object>} pairs - Array of { x, y } pairs
   * @return {Object} coordinates  - Object with a x[] and y[] properties
   */
  splitPairs(
    pairs: Coordinate[]
  ): { x: Coordinate['x'][]; y: Coordinate['y'][] } {
    const x: Coordinate['x'][] = []
    const y: Coordinate['y'][] = []

    for (const pair of pairs) {
      x.push(pair.x)
      y.push(pair.y)
    }

    return { x, y }
  },

  /**
   * Split coordinate string into an array.
   * @param  {string|array} coordinate
   * @return {array} The result array. From "1, 2" to [1, 2] and from [1, 2] to a new [1, 2]
   */
  toArray(coordinate: UnifiedCoordinate): number[] {
    this.checkIsValid(coordinate)

    return coordinate
      .toString()
      .split(',')
      .map(coord => parseInt(coord.trim(), 10))
  },

  /**
   * Expects an string or array of the form "x, y". Throws if the input is invalid
   * @param  {string|array} coordinates
   */
  checkIsValid(coordinate: UnifiedCoordinate): void {
    if (!this.isValid(coordinate)) {
      throw new Error(`The coordinate "${coordinate}" are not valid`)
    }
  },

  /**
   * Expects an string or array of the form "x, y". Throws if the input is invalid
   * @param  {string|array} coordinates
   */
  isValid(coordinate: UnifiedCoordinate): boolean {
    const match = coordinate.toString().match(/^-?(\d+)\s*,\s*-?(\d+)$/)
    return !!match
  }
}
