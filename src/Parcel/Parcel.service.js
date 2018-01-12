import { LANDToken } from 'decentraland-contracts'

import Parcel from './Parcel'
import coordinates from './coordinates'

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

  async isOwner(address, parcel) {
    try {
      const contract = LANDToken.getInstance()
      const { x, y } = parcel

      const owner = await contract.ownerOfLand(x, y)
      return !!owner && address === owner
    } catch (error) {
      return false
    }
  }

  async addOwners(parcels) {
    let newParcels = []

    try {
      const { x, y } = coordinates.splitPairs(parcels)
      const contract = LANDToken.getInstance()
      const addresses = await contract.ownerOfLandMany(x, y)

      for (const [index, address] of addresses.entries()) {
        if (address) {
          const parcel = parcels[index]
          newParcels.push({ ...parcel, owner: address })
        }
      }
    } catch (error) {
      newParcels = parcels
    }

    return newParcels
  }

  getValuesFromSignedMessage(signedMessage) {
    const values = signedMessage.extract(Parcel.columnNames)
    const changes = {}

    for (const [index, columnName] of Parcel.columnNames.entries()) {
      const value = values[index]

      if (value) {
        changes[columnName] = value
      }
    }

    return changes
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
