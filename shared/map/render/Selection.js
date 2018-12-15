import { COLORS } from '../tile'

export class Selection {
  static draw({
    ctx,
    x,
    y,
    selection = [],
    scale = 1.2,
    size = 10,
    fill = COLORS.myParcels,
    stroke = '#ff0044',
    width = 1
  }) {
    // border
    ctx.fillStyle = stroke
    ctx.shadowBlur = 20 * scale
    ctx.shadowColor = stroke
    ctx.beginPath()

    const borderOffset = size + width * 2
    const borderOffsetCoord = borderOffset / 2 * scale
    const borderSide = borderOffset * scale
    selection.forEach(({ x, y }) => {
      ctx.rect(
        x - borderOffsetCoord,
        y - borderOffsetCoord,
        borderSide,
        borderSide
      )
    })
    ctx.fill()
    ctx.closePath()

    // fill
    ctx.fillStyle = fill
    ctx.shadowBlur = 0
    ctx.beginPath()

    const fillOffset = size / 2 * scale
    const filSide = size * scale
    selection.forEach(({ x, y }) => {
      ctx.rect(x - fillOffset, y - fillOffset, filSide, filSide)
    })
    ctx.fill()
    ctx.closePath()
  }
}
