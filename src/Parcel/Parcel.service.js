import { Log } from 'decentraland-commons'
import { LANDToken } from 'decentraland-contracts'

import Parcel from './Parcel'

const log = new Log('ParcelService')

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

      const owner = await contract.ownerOfLand(x, y) // TODO: check if it's 0
      return address === owner
    } catch (error) {
      return false
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
    try {
      const contract = LANDToken.getInstance()

      const ownerSetters = parcels.map(async parcel => {
        // TODO: check if it's 0
        // TODO: use contract's `ownerOfLandMany`
        const owner = parcel.district_id
          ? null
          : await contract.ownerOfLand(parcel.x, parcel.y)

        return Object.assign({}, parcel, { owner })
      })

      return await Promise.all(ownerSetters)
    } catch (error) {
      log.warn(
        '[WARN] Error trying to get owners from LANDToken contract',
        error
      )
      return parcels
    }
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
