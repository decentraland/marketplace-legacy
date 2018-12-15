import { isDistrict, isPlaza, isRoad } from '../../shared/district'
import { TYPES } from '../../shared/map'
import { isEstate } from '../../shared/parcel'

export class ParcelReference {
  constructor(parcel, traits = {}) {
    this.parcel = parcel
    this.traits = Object.assign(
      { isOnSale: false, district: null, estate: null },
      traits
    )
  }

  getType() {
    if (isDistrict(this.parcel)) {
      if (isRoad(this.parcel.district_id)) {
        return TYPES.roads
      }
      if (isPlaza(this.parcel.district_id)) {
        return TYPES.plaza
      }
      return TYPES.district
    }

    return this.traits.isOnSale
      ? TYPES.onSale
      : this.parcel.owner
        ? TYPES.taken
        : TYPES.unowned
  }

  getNameByType(type) {
    switch (type) {
      case TYPES.district:
      case TYPES.contribution:
        return this.traits.district ? this.traits.district.name : ''
      case TYPES.myParcels:
      case TYPES.myParcelsOnSale:
      case TYPES.myEstates:
      case TYPES.myEstatesOnSale:
      case TYPES.taken:
      case TYPES.onSale: {
        const asset = this.traits.estate || this.parcel
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

  getContributionType() {
    return TYPES.contribution
  }

  getTypeForOwner(owner, currentType = null) {
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
}
