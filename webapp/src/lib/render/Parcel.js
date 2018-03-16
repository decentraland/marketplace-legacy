import { COLORS } from 'lib/parcelUtils'

export const Parcel = {
  draw({
    ctx,
    x,
    y,
    size = 10,
    padding = 2,
    offset = 1,
    color = '#ff9990',
    connectedLeft,
    connectedTop,
    connectedTopLeft
  }) {
    ctx.fillStyle = color
    ctx.fillRect(
      x - size + (connectedLeft ? -offset : padding),
      y - size + (connectedTop ? -offset : padding),
      size - (connectedLeft ? -offset : padding),
      size - (connectedTop ? -offset : padding)
    )
    if (connectedLeft && connectedTop && !connectedTopLeft) {
      ctx.fillStyle = COLORS.unowned
      ctx.fillRect(
        x - size - offset,
        y - size - offset,
        padding + offset,
        padding + offset
      )
    }
  }
}
