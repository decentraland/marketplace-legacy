import { isDistrict, isPlaza, isRoad } from '../../shared/district'
import { TYPES, COLORS } from '../../shared/map'
import { PUBLICATION_STATUS } from '../shared/publication'
import { inEstate } from '../../shared/parcel'
import { ASSET_TYPES } from '../../shared/asset'

export class ParcelReference {
  constructor(parcel, publications = []) {
    this.parcel = parcel
    this.assetType =
      parcel.estate_id == null ? ASSET_TYPES.parcel : ASSET_TYPES.estate

    this.setPublications(publications)
  }

  setPublications(publications = []) {
    if (
      publications.length > 0 &&
      publications[0].asset_type !== this.assetType
    ) {
      throw new Error(
        `You must supply publications for the outer asset, "${this.assetType}"`
      )
    }
    this.publications = publications
  }

  getColor() {
    return this.getColorByType(this.getType())
  }

  getColorByType(type) {
    switch (type) {
      case TYPES.loading: {
        const isEven = (this.parcel.x + this.parcel.y) % 2 === 0
        return isEven ? COLORS.loadingEven : COLORS.loadingOdd
      }
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
    if (!this.parcel) {
      return TYPES.loading
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
        ? inEstate(this.parcel)
          ? TYPES.myEstatesOnSale
          : TYPES.myParcelsOnSale
        : TYPES.onSale
    } else {
      newType = isOwner
        ? inEstate(this.parcel)
          ? TYPES.myEstates
          : TYPES.myParcels
        : this.parcel.owner
          ? TYPES.taken
          : TYPES.unowned
    }

    return {
      type: newType,
      color: this.getColorByType(newType)
    }
  }

  isOnSale() {
    return this.publications.some(
      publication => publication.status === PUBLICATION_STATUS.open
    )
  }
}
