import { Parcel } from './Parcel'
import { Selection } from './Selection'
import { COLORS, getBackgroundColor, getLoadingColor } from '../tile'
import { buildCoordinate } from '../../coordinates'

export class Map {
  static draw({
    ctx,
    width,
    height,
    size,
    pan,
    nw,
    se,
    center,
    atlas,
    selected
  }) {
    ctx.fillStyle = COLORS.background
    ctx.fillRect(0, 0, width, height)

    const selection = []

    const padding = size < 7 ? 0.5 : size < 12 ? 1 : size < 18 ? 1.5 : 2
    const panX = pan ? pan.x : 0
    const panY = pan ? pan.y : 0
    const cx = width / 2
    const cy = height / 2

    for (let px = nw.x; px < se.x; px++) {
      for (let py = se.y; py < nw.y; py++) {
        const offsetX = (center.x - px) * size + panX
        const offsetY = (py - center.y) * size + panY
        const rx = cx - offsetX
        const ry = cy - offsetY

        const id = buildCoordinate(px, py)
        const atlasLocation = atlas[id]
        let color
        let connectedLeft = false
        let connectedTop = false
        let connectedTopLeft = false

        if (atlasLocation) {
          color = getBackgroundColor(atlasLocation.type)
          connectedLeft = atlasLocation.left
          connectedTop = atlasLocation.top
          connectedTopLeft = atlasLocation.topLeft
        } else {
          color = getLoadingColor(px, py)
        }

        if (this.isSelected(selected, px, py)) {
          selection.push({ x: rx, y: ry })
        }

        Parcel.draw({
          ctx,
          x: rx + size / 2,
          y: ry + size / 2,
          size,
          padding,
          color,
          connectedLeft,
          connectedTop,
          connectedTopLeft
        })
      }
    }

    if (selection.length > 0) {
      Selection.draw({ ctx, selection, size })
    }
  }

  static isSelected(selected, x, y) {
    return selected.some(coords => coords.x === x && coords.y === y)
  }
}
