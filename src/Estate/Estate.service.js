import { Estate } from './Estate.model'

export class EstateService {
  static getByParcels(parcels) {
    let ids = parcels
      .filter(parcel => parcel.in_estate)
      .map(parcel => parcel.owner)
    ids = [...new Set(ids)] // Remove duplicates
    return Estate.findByIds(ids)
  }
}
