export const flag = {
  draw(
    ctx,
    x,
    y,
    scale = 2.5,
    fillPrimary = '#d1344e',
    fillSecondary = '#970a09',
    stroke = '#970a09',
    width = 1
  ) {
    const flagWidth = 10 * scale
    const mastHeight = 15 * scale
    const flagHeight = 5 * scale
    ctx.fillStyle = fillPrimary
    ctx.strokeStyle = stroke
    ctx.strokeWidth = width
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x, y - mastHeight)
    ctx.lineTo(x + flagWidth, y - mastHeight)
    ctx.lineTo(x + flagWidth, y - mastHeight + flagHeight)
    ctx.lineTo(x, y - mastHeight + flagHeight)
    ctx.stroke()
    ctx.fill()
    ctx.closePath()
  }
}
