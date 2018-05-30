export class Bounds {
  static getBounds() {
    return {
      minX: -150,
      minY: -150,
      maxX: 150,
      maxY: 150
    }
  }

  static inBounds(x, y) {
    const { minX, minY, maxX, maxY } = Bounds.getBounds()
    return x >= minX && x <= maxX && y >= minY && y <= maxY
  }
}
