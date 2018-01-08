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
    return await Promise.all(
      parcels.map(parcel =>
        Parcel.getPrice(parcel.x, parcel.y).then(
          price => (parcel.price = price)
        )
      )
    )
  }
}

function isDuplicatedError(error) {
  const duplicateErrorRegexp = /duplicate key value violates unique constraint ".+_pkey"/
  return error && error.search && error.search(duplicateErrorRegexp) !== -1
}

export default ParcelService
