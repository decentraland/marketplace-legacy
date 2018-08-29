export class Viewport {
  static getDimensions({ width, height, center, pan, size, padding }) {
    const dimensions = {
      width: Math.ceil(width / size + padding),
      height: Math.ceil(height / size + padding)
    }
    const panX = pan ? Math.ceil(pan.x / size) : 0
    const panY = pan ? Math.ceil(pan.y / size) : 0
    dimensions.nw = {
      x: center.x - Math.ceil(dimensions.width / 2) + panX,
      y: center.y + Math.ceil(dimensions.height / 2) - panY
    }
    dimensions.se = {
      x: center.x + Math.ceil(dimensions.width / 2) + panX,
      y: center.y - Math.ceil(dimensions.height / 2) - panY
    }
    dimensions.area =
      (dimensions.se.x - dimensions.nw.x) * (dimensions.nw.y - dimensions.se.y)
    return dimensions
  }
}
