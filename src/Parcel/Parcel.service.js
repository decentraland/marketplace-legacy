import Parcel from './Parcel'

class ParcelService {
  constructor() {
    this.Parcel = Parcel
  }

  async insertMatrix(minX, minY, maxX, maxY) {
    const skipDuplicates = error => {
      if (!isDuplicatedError(error)) throw new Error(error)
    }

    for (let x = minX; x <= maxX; x++) {
      const inserts = []

      for (let y = minY; y <= maxY; y++) {
        inserts.push(this.Parcel.insert({ x, y }).catch(skipDuplicates))
      }

      await Promise.all(inserts)
    }
  }

  async addPrice(parcels) {
    const priceAdditions = parcels.map(async parcel => {
      const price = await Parcel.getPrice(parcel.x, parcel.y)
      parcel.price = price
      return parcel
    })

    return await Promise.all(priceAdditions)
  }
}

function isDuplicatedError(error) {
  const duplicateErrorRegexp = /duplicate key value violates unique constraint ".+_pkey"/
  return error && error.search && error.search(duplicateErrorRegexp) !== -1
}

export default ParcelService
