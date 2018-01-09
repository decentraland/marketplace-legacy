/**
 * A set of helpers to work with (x, y) coordinates
 * @type {Object}
 */
const coordinates = {
  /**
   * Split coordinate string into an array.
   * @param  {string|array} coordinate
   * @return {array} The splitted result. From "1, 2" to [1, 2]
   */
  toArray(coordinate) {
    this.checkIsValid(coordinate)
    return coordinate
      .toString()
      .split(',')
      .map(coord => coord.trim())
  },

  /**
   * Expects an string or array of the form "x, y". Throws if the input is invalid
   * @param  {string|array} coordinates
   */
  checkIsValid(coordinate) {
    if (!this.isValid(coordinate)) {
      throw new Error(`The coordinate "${coordinate}" are not valid`)
    }
  },

  /**
   * Expects an string or array of the form "x, y". Throws if the input is invalid
   * @param  {string|array} coordinates
   */
  isValid(coordinate) {
    const match = coordinate.toString().match(/^-?(\d+)\s*,\s*-?(\d+)$/)
    return !!match
  }
}

export default coordinates
