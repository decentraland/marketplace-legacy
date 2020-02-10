const BOUND_COORDINATES = {
  minX: -150,
  minY: -150,
  maxX: 165,
  maxY: 165
}

export class Bounds {
  static getBounds() {
    return BOUND_COORDINATES
  }

  static validateInBounds(x, y) {
    if (!Bounds.inBounds(x, y)) {
      const stringBounds = JSON.stringify(Bounds.getBounds())
      throw new Error(`Coords (${x}, ${y}) are out of bounds: ${stringBounds}`)
    }
  }

  static inBounds(x, y) {
    const { minX, minY, maxX, maxY } = Bounds.getBounds()
    return x >= minX && x <= maxX && y >= minY && y <= maxY
  }
}
