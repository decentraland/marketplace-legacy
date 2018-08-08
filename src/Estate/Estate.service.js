import { Estate } from './Estate.model'

export class EstateService {
  static getByParcels(parcels) {
    let ids = parcels
      .filter(parcel => parcel.estate_id)
      .map(parcel => parcel.estate_id)
    ids = [...new Set(ids)] // Remove duplicates
    return Estate.findByAssetIds(ids)
  }
}
