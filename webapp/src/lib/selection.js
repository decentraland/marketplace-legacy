export const selection = {
  draw({
    ctx,
    x,
    y,
    scale = 1.2,
    size = 10,
    fill = '#ff9990',
    stroke = '#ff4130',
    width = 1
  }) {
    ctx.fillStyle = fill
    ctx.strokeStyle = stroke
    ctx.strokeWidth = width
    ctx.beginPath()
    ctx.rect(
      x - size / 2 * scale,
      y - size / 2 * scale,
      size * scale,
      size * scale
    )
    ctx.shadowBlur = 20
    ctx.shadowColor = fill
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
    ctx.shadowBlur = 0
  }
}
