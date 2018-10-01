import { Estate } from './Estate.model'

export class EstateService {
  constructor() {
    this.Estate = Estate
  }

  getByParcels(parcels) {
    const ids = new Set([])

    for (const parcel of parcels) {
      if (parcel.estate_id) {
        ids.add(parcel.estate_id)
      }
    }

    return this.Estate.findByTokenIds([...ids])
  }
}
