import { TYPES } from './tile'
import { isDistrict, isPlaza, isRoad } from '../district'
import { isPartOfEstate } from '../parcel'

export class TileOwnerType {
  constructor(owner) {
    this.owner = owner
  }

  get(tile) {
    const isOwner = tile.owner === this.owner
    const hasAccess = tile.approvals.includes(this.owner)
    const isOnSale = tile.type === TYPES.onSale || tile.price != null

    let newType = ''

    if (isOnSale) {
      newType = isOwner
        ? isPartOfEstate(tile)
          ? TYPES.myEstatesOnSale
          : TYPES.myParcelsOnSale
        : TYPES.onSale
    } else {
      newType = isOwner
        ? isPartOfEstate(tile)
          ? TYPES.myEstates
          : TYPES.myParcels
        : hasAccess
          ? TYPES.withAccess
          : tile.owner
            ? TYPES.taken
            : TYPES.unowned
    }

    return newType
  }
}
