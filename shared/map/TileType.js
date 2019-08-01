import { TYPES } from './tile'
import { isDistrict, isPlaza, isRoad } from '../district'
import { isPartOfEstate } from '../../shared/parcel'

export class TileType {
  constructor(parcel) {
    this.parcel = parcel
    this.asset = isPartOfEstate(this.parcel) ? this.parcel.estate : this.parcel
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
        return this.asset.data.name || ''
      }
      case TYPES.roads:
      case TYPES.plaza:
      case TYPES.unowned:
      case TYPES.background:
      default:
        return ''
    }
  }

  isOnSale() {
    return !!this.asset.publication
  }
}
