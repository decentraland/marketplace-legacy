export const Selection = {
  draw({
    ctx,
    x,
    y,
    selection = [],
    scale = 1.2,
    size = 10,
    fill = '#ff9990',
    stroke = '#ff4130',
    width = 1
  }) {
    // border
    ctx.fillStyle = stroke
    ctx.shadowBlur = 20 * scale
    ctx.shadowColor = stroke
    ctx.beginPath()
    selection.forEach(({ x, y }) => {
      ctx.rect(
        x - (size + width * 2) / 2 * scale,
        y - (size + width * 2) / 2 * scale,
        (size + width * 2) * scale,
        (size + width * 2) * scale
      )
    })
    ctx.fill()
    ctx.closePath()

    // fill
    ctx.fillStyle = fill
    ctx.shadowBlur = 0
    ctx.beginPath()
    selection.forEach(({ x, y }) => {
      ctx.rect(
        x - size / 2 * scale,
        y - size / 2 * scale,
        size * scale,
        size * scale
      )
    })
    ctx.fill()
    ctx.closePath()
  }
}
