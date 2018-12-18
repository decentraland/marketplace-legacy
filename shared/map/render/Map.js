import { Parcel } from './Parcel'
import { Selection } from './Selection'
import { TYPES, COLORS, getBackgroundColor, getLoadingColor } from '../tile'
import { buildCoordinate } from '../../coordinates'

export class Map {
  static draw({ ctx, ...attributes }) {
    return new Map(ctx, attributes).draw(attributes)
  }

  constructor(ctx, { width, height, size, pan, colors }) {
    this.ctx = ctx

    this.width = width
    this.height = height
    this.size = size
    this.pan = pan
    this.colors = colors || COLORS

    this.padding = size < 7 ? 0.5 : size < 12 ? 1 : size < 18 ? 1.5 : 2
    this.middle = { x: width / 2, y: height / 2, size: size / 2 }
    this.pan = pan ? pan : { x: 0, y: 0 }

    this.ctx.fillStyle = this.colors.background
    this.ctx.fillRect(0, 0, width, height)
  }

  draw({ nw, se, center, atlas, selected, skipPublications }) {
    const selection = []

    for (let x = nw.x; x < se.x; x++) {
      for (let y = se.y; y < nw.y; y++) {
        const corner = this.getParcelCorner(x, y, center)

        const atlasLocation = atlas[buildCoordinate(x, y)]
        const attributes = this.getParcelAttributes(x, y, atlasLocation)
        if (skipPublications && this.isOnSale(atlasLocation)) {
          attributes.color = COLORS.taken
        }

        if (this.isSelected(selected, x, y)) {
          selection.push(corner)
        }

        this.drawParcel(corner, attributes)
      }
    }

    if (selection.length > 0) {
      Selection.draw({ ctx: this.ctx, size: this.size, selection })
    }
  }

  drawFromAtlas({ center, atlas, selected, skipPublications }) {
    const selection = []

    for (const atlasLocation of atlas) {
      const { x, y } = atlasLocation
      const corner = this.getParcelCorner(x, y, center)

      const attributes = this.getParcelAttributes(x, y, atlasLocation)
      if (skipPublications && this.isOnSale(atlasLocation)) {
        attributes.color = COLORS.taken
      }

      if (this.isSelected(selected, x, y)) {
        selection.push(corner)
      }

      this.drawParcel(corner, attributes)
    }

    if (selection.length > 0) {
      Selection.draw({ ctx: this.ctx, size: this.size, selection })
    }
  }

  getParcelCorner(x, y, center) {
    const offsetX = (center.x - x) * this.size + this.pan.x
    const offsetY = (y - center.y) * this.size + this.pan.y
    return { x: this.middle.x - offsetX, y: this.middle.y - offsetY }
  }

  isOnSale(atlasLocation) {
    if (!atlasLocation) return false

    const type = atlasLocation.type
    return (
      type === TYPES.myParcelsOnSale ||
      type === TYPES.myEstatesOnSale ||
      type === TYPES.onSale
    )
  }

  isSelected(selected, x, y) {
    return selected.some(coords => coords.x === x && coords.y === y)
  }

  getParcelAttributes(x, y, atlasLocation) {
    let color = ''
    let connectedLeft = false
    let connectedTop = false
    let connectedTopLeft = false

    if (atlasLocation) {
      color = getBackgroundColor(atlasLocation.type, this.colors)
      connectedLeft = atlasLocation.left
      connectedTop = atlasLocation.top
      connectedTopLeft = atlasLocation.topLeft
    } else {
      color = this.colors.loading || getLoadingColor(x, y)
    }

    return {
      color,
      connectedLeft,
      connectedTop,
      connectedTopLeft
    }
  }

  drawParcel(corner, attributes) {
    Parcel.draw({
      ctx: this.ctx,
      x: corner.x + this.middle.size,
      y: corner.y + this.middle.size,
      size: this.size,
      padding: this.padding,
      color: attributes.color,
      connectedLeft: attributes.connectedLeft,
      connectedTop: attributes.connectedTop,
      connectedTopLeft: attributes.connectedTopLeft
    })
  }
}
