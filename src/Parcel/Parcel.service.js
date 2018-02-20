import { eth, Contract, Log, contracts } from 'decentraland-commons'

import { Parcel } from './Parcel'
import { coordinates } from './coordinates'

const log = new Log('ParcelService')
const { LANDRegistry } = contracts

export class ParcelService {
  static CURRENT_DATA_VERSION = 0

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

  async getLandOf(address) {
    let parcels = []

    try {
      const contract = this.getLANDRegistryContract()
      const [xCoords, yCoords] = await contract.landOf(address)

      for (let i = 0; i < xCoords.length; i++) {
        const x = xCoords[i].toNumber()
        const y = yCoords[i].toNumber()
        const id = this.Parcel.buildId(x, y)

        parcels.push({ id, x, y })
      }
    } catch (error) {
      log.warn(
        `An error occurred getting the land of ${address}.\nError: ${
          error.message
        }`
      )
      parcels = []
    }

    return parcels
  }

  async addLandData(parcels) {
    const contract = this.getLANDRegistryContract()

    const parcelPromises = parcels.map(async parcel => {
      let data

      try {
        const landData = await contract.landData(parcel.x, parcel.y)
        data = LANDRegistry.decodeLandData(landData)
      } catch (error) {
        log.debug(error.message)
        data = { version: ParcelService.CURRENT_DATA_VERSION }
      }

      return Object.assign({}, parcel, { data })
    })

    return await Promise.all(parcelPromises)
  }

  async isOwner(address, parcel) {
    let isOwner = false

    try {
      const contract = this.getLANDRegistryContract()
      const { x, y } = parcel

      const owner = await contract.ownerOfLand(x, y)
      isOwner = !Contract.isEmptyAddress(owner) && address === owner
    } catch (error) {
      log.warn(
        `An error occurred verifying if ${address} owns ${JSON.stringify(
          parcel
        )}.\nError: ${error.message}`
      )
      isOwner = false
    }

    return isOwner
  }

  async addOwners(parcels) {
    let newParcels = []

    try {
      const { x, y } = coordinates.splitPairs(parcels)
      const contract = this.getLANDRegistryContract()
      const addresses = await contract.ownerOfLandMany(x, y)

      for (const [index, parcel] of parcels.entries()) {
        const address = addresses[index]
        const owner = Contract.isEmptyAddress(address) ? null : address
        newParcels.push({ ...parcel, owner })
      }
    } catch (error) {
      log.warn(
        `An error occurred adding owners for ${
          parcels.length
        } parcels.\nError: ${error.message}`
      )
      newParcels = parcels.slice() // Copy
    }

    return newParcels
  }

  async addDbData(parcels) {
    const parcelIds = parcels.map(parcel => Parcel.buildId(parcel.x, parcel.y))

    const dbParcels = await Parcel.findInIds(parcelIds)
    const dbParcelsObj = this.toParcelObject(dbParcels)

    return parcels.map((parcel, index) => {
      const dbParcel = dbParcelsObj[Parcel.buildId(parcel.x, parcel.y)]
      if (!dbParcel) return parcel

      const { auctionPrice } = dbParcel
      return Object.assign({}, parcel, { auctionPrice })
    })
  }

  toParcelObject(parcelArray) {
    return parcelArray.reduce((map, parcel) => {
      map[parcel.id] = parcel
      return map
    }, {})
  }

  getLANDRegistryContract() {
    return eth.getContract('LANDRegistry')
  }
}

function skipDuplicateError(error) {
  if (!isDuplicatedError(error)) throw new Error(error)
}

function isDuplicatedError(error) {
  const duplicateErrorRegexp = /duplicate key value violates unique constraint ".+_pkey"/
  return error && error.search && error.search(duplicateErrorRegexp) !== -1
}
