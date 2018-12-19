export class Marker {
  static draw({
    ctx,
    x,
    y,
    scale = 2.5,
    fillPrimary = '#d1344e',
    fillSecondary = '#970a09',
    stroke = '#970a09',
    width = 1
  }) {
    const upperRadius = 5 * scale
    const innerRadius = 2 * scale
    const lowerRadius = 1 * scale
    const height = 10 * scale
    const angle = Math.atan2(upperRadius, height)

    ctx.fillStyle = fillPrimary
    ctx.strokeStyle = stroke
    ctx.strokeWidth = width

    ctx.beginPath()
    ctx.arc(x, y - height, upperRadius, angle, Math.PI - angle, true)
    ctx.lineTo(
      x - lowerRadius * Math.cos(angle),
      y - lowerRadius * Math.sin(angle)
    )
    ctx.arc(
      x,
      y - lowerRadius,
      lowerRadius,
      Math.PI - angle,
      2 * Math.PI + angle,
      true
    )
    ctx.lineTo(
      x + Math.cos(angle) * upperRadius,
      y - height + Math.sin(angle) * upperRadius
    )
    ctx.stroke()
    ctx.fill()
    ctx.closePath()
    ctx.beginPath()
    ctx.moveTo(x + innerRadius, y - height)
    ctx.arc(x, y - height, innerRadius, 0, Math.PI * 2)
    ctx.fillStyle = fillSecondary
    ctx.fill()
    ctx.closePath()
  }
}
