import { LANDToken } from 'decentraland-contracts'

import Parcel from './Parcel'

class ParcelService {
  constructor() {
    this.Parcel = Parcel
  }

  async insertMatrix(minX, minY, maxX, maxY) {
    for (let x = minX; x <= maxX; x++) {
      const inserts = []

      for (let y = minY; y <= maxY; y++) {
        inserts.push(this.Parcel.insert({ x, y }).catch(skipDuplicateError))
      }

      await Promise.all(inserts)
    }
  }

  async addPrices(parcels) {
    const priceSetters = parcels.map(async parcel => {
      const price = await Parcel.getPrice(parcel.x, parcel.y)
      return Object.assign({}, parcel, { price })
    })

    return await Promise.all(priceSetters)
  }

  async addOwners(parcels) {
    const contract = LANDToken.getInstance()

    const ownerSetters = parcels.map(async parcel => {
      const owner = parcel.district_id
        ? null
        : await contract.getOwner(parcel.x, parcel.y)

      return Object.assign({}, parcel, { owner })
    })

    return await Promise.all(ownerSetters)
  }
}

function skipDuplicateError(error) {
  if (!isDuplicatedError(error)) throw new Error(error)
}

function isDuplicatedError(error) {
  const duplicateErrorRegexp = /duplicate key value violates unique constraint ".+_pkey"/
  return error && error.search && error.search(duplicateErrorRegexp) !== -1
}

export default ParcelService
