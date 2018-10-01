import { eth, Contract, contracts } from 'decentraland-eth'
import { Log } from 'decentraland-commons'

import { Parcel } from './Parcel.model'
import { isDuplicatedConstraintError } from '../../database'
import { coordinates } from '../../lib'

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
      throw error
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
        if (error.name === 'DataError') {
          data = { version: ParcelService.CURRENT_DATA_VERSION }
        } else {
          throw error
        }
      }

      return Object.assign({}, parcel, { data })
    })

    return Promise.all(parcelPromises)
  }

  async isOwner(address, parcel) {
    let isOwner = false

    try {
      const owner = await this.getOwnerOfLand(parcel)
      isOwner = !Contract.isEmptyAddress(owner) && address === owner
    } catch (error) {
      log.warn(
        `An error occurred verifying if ${address} owns ${JSON.stringify(
          parcel
        )}.\nError: ${error.message}`
      )
      throw error
    }

    return isOwner
  }

  async addOwners(parcels) {
    let newParcels = []

    try {
      const addresses = await this.getOwnerOfLandMany(parcels)

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
      throw error
    }

    return newParcels
  }

  async addTokenIds(parcels) {
    let newParcels = []

    try {
      const tokenIdFetches = parcels.map(async parcel => {
        const tokenId = await this.getTokenId(parcel)
        return {
          ...parcel,
          token_id: tokenId.toString()
        }
      })

      newParcels = await Promise.all(tokenIdFetches)
    } catch (error) {
      log.warn(
        `An error occurred adding owners for ${
          parcels.length
        } parcels.\nError: ${error.message}`
      )
      throw error
    }

    return newParcels
  }

  async getOwnerOfLand(parcel) {
    const contract = this.getLANDRegistryContract()
    const { x, y } = parcel

    return contract.ownerOfLand(x, y)
  }

  async getOwnerOfLandMany(parcels) {
    const { x, y } = coordinates.splitPairs(parcels)
    const contract = this.getLANDRegistryContract()
    return contract.ownerOfLandMany(x, y)
  }

  async getTokenId(parcel) {
    const contract = this.getLANDRegistryContract()
    return contract.encodeTokenId(parcel.x, parcel.y)
  }

  getLANDRegistryContract() {
    return eth.getContract('LANDRegistry')
  }
}

function skipDuplicateError(error) {
  if (!isDuplicatedConstraintError(error)) throw new Error(error)
}
