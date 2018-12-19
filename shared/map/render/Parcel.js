import { COLORS } from '../tile'

export class Parcel {
  static draw({
    ctx,
    x,
    y,
    size = 10,
    padding = 2,
    offset = 1,
    color = COLORS.myParcels,
    connectedLeft,
    connectedTop,
    connectedTopLeft
  }) {
    const leftOffset = connectedLeft ? -offset : padding
    const topOffset = connectedTop ? -offset : padding
    ctx.fillStyle = color
    ctx.fillRect(
      x - size + leftOffset,
      y - size + topOffset,
      size - leftOffset,
      size - topOffset
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
