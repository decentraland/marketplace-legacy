import { TYPES } from './tile'
import { isDistrict, isPlaza, isRoad } from '../district'
import { isEstate } from '../parcel'

export class TileType {
  static getExpired(type) {
    // We purposefully avoid adding this method to more hollistic methods like `get` or `getForOwner`
    // so we can have the choice of getting the type with or without the expired publication
    switch (type) {
      case TYPES.onSale:
        return TYPES.taken
      case TYPES.myParcelsOnSale:
        return TYPES.myParcels
      case TYPES.myEstatesOnSale:
        return TYPES.myEstates
      default:
        return type
    }
  }

  constructor(parcel) {
    this.parcel = parcel
  }

  get() {
    if (this.parcel.contribution) {
      return TYPES.contribution
    }

    if (isDistrict(this.parcel)) {
      if (isRoad(this.parcel.district_id)) {
        return TYPES.roads
      }
      if (isPlaza(this.parcel.district_id)) {
        return TYPES.plaza
      }
      return TYPES.district
    }

    return this.isOnSale()
      ? TYPES.onSale
      : this.parcel.owner
        ? TYPES.taken
        : TYPES.unowned
  }

  getName(type) {
    switch (type) {
      case TYPES.district:
      case TYPES.contribution:
        return this.parcel.district ? this.parcel.district.name : ''
      case TYPES.myParcels:
      case TYPES.myParcelsOnSale:
      case TYPES.myEstates:
      case TYPES.myEstatesOnSale:
      case TYPES.taken:
      case TYPES.onSale: {
        const asset = this.parcel.estate || this.parcel
        return asset.data.name || ''
      }
      case TYPES.roads:
      case TYPES.plaza:
      case TYPES.unowned:
      case TYPES.background:
      default:
        return ''
    }
  }

  getForOwner(owner, currentType = null) {
    const isOwner = this.parcel.owner === owner
    const isOnSale = currentType === TYPES.onSale || this.isOnSale()

    let newType = ''

    if (isOnSale) {
      newType = isOwner
        ? isEstate(this.parcel)
          ? TYPES.myEstatesOnSale
          : TYPES.myParcelsOnSale
        : TYPES.onSale
    } else {
      newType = isOwner
        ? isEstate(this.parcel)
          ? TYPES.myEstates
          : TYPES.myParcels
        : this.parcel.owner
          ? TYPES.taken
          : TYPES.unowned
    }

    return newType
  }

  isOnSale() {
    return !!this.parcel.publication
  }
}
