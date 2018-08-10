import { Estate } from './Estate.model'

export class EstateService {
  static getByParcels(parcels) {
    let ids = new Set([])
    for (const parcel of parcels) {
      if (parcel.estate_id) {
        ids.add(parcel.estate_id)
      }
    }
    return Estate.findByAssetIds([...ids])
  }
}
