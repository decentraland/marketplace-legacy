import { isDistrict, isPlaza, isRoad } from '../../shared/district'
import { TYPES, COLORS } from '../../shared/map'
import { PUBLICATION_STATUS } from '../shared/publication'
import { isEstate } from '../../shared/parcel'
import { ASSET_TYPES } from '../../shared/asset'

export class ParcelReference {
  constructor(parcel, traits = {}) {
    this.parcel = parcel
    this.traits = Object.assign(
      { isOnSale: false, district: null, estate: null },
      traits
    )
  }

  getColorByType(type) {
    switch (type) {
      case TYPES.myParcels:
        return COLORS.myParcels
      case TYPES.myParcelsOnSale:
        return COLORS.myParcelsOnSale
      case TYPES.myEstates:
        return COLORS.myParcels
      case TYPES.myEstatesOnSale:
        return COLORS.myParcelsOnSale
      case TYPES.district:
        return COLORS.district
      case TYPES.contribution:
        return COLORS.contribution
      case TYPES.roads:
        return COLORS.roads
      case TYPES.plaza:
        return COLORS.plaza
      case TYPES.taken:
        return COLORS.taken
      case TYPES.onSale:
        return COLORS.onSale
      case TYPES.unowned:
        return COLORS.unowned
      case TYPES.background:
      default:
        return COLORS.background
    }
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

  getLabelByType(type) {
    switch (type) {
      case TYPES.district:
      case TYPES.contribution:
        return this.traits.district ? this.traits.district.name : 'District'
      case TYPES.plaza:
        return 'Genesis Plaza'
      case TYPES.roads:
        return 'Road'
      case TYPES.myParcels:
      case TYPES.myParcelsOnSale:
      case TYPES.myEstates:
      case TYPES.myEstatesOnSale:
      case TYPES.taken:
      case TYPES.onSale: {
        const asset = this.traits.estate || this.parcel
        return asset.data.name || ''
      }
      case TYPES.unowned:
      case TYPES.background:
      default:
        return null
    }
  }

  getForContribution() {
    const type = TYPES.contribution
    return {
      type,
      color: this.getColorByType(type)
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

    return {
      type: newType,
      color: this.getColorByType(newType),
      label: this.getLabelByType(newType)
    }
  }
}
