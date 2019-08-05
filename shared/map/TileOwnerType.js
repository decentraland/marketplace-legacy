import { TYPES } from './tile'
import { isPartOfEstate } from '../parcel'

export class TileOwnerType {
  constructor(owner) {
    this.owner = owner
  }

  get(tile) {
    const isOwner = tile.owner === this.owner
    const hasAccess = tile.approvals.includes(this.owner)
    const isOnSale = tile.type === TYPES.onSale || tile.price != null

    let type = ''

    if (isOnSale) {
      if (isOwner) {
        type = isPartOfEstate(tile)
          ? TYPES.myEstatesOnSale
          : TYPES.myParcelsOnSale
      } else {
        type = TYPES.onSale
      }
    } else {
      if (isOwner) {
        type = isPartOfEstate(tile) ? TYPES.myEstates : TYPES.myParcels
      } else if (hasAccess) {
        type = TYPES.withAccess
      } else {
        type = tile.owner ? TYPES.taken : TYPES.unowned
      }
    }

    return type
  }
}
