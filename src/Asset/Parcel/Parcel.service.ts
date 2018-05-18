import { Log } from 'decentraland-commons'
import { Contract, contracts, eth } from 'decentraland-eth'
import { isDuplicatedConstraintError } from '../../lib'
import { Parcel, ParcelAttributes } from './Parcel.model'
import { coordinates } from './coordinates'

const log = new Log('ParcelService')
const { LANDRegistry } = contracts

export class ParcelService {
  static CURRENT_DATA_VERSION = 0

  Parcel: typeof Parcel

  constructor() {
    this.Parcel = Parcel
  }

  async insertMatrix(
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
  ): Promise<void> {
    for (let x = minX; x <= maxX; x++) {
      const inserts = []

      for (let y = minY; y <= maxY; y++) {
        inserts.push(this.Parcel.insert({ x, y }).catch(skipDuplicateError))
      }

      await Promise.all(inserts)
    }
  }

  async addLandData(parcels: ParcelAttributes[]): Promise<ParcelAttributes[]> {
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

  async isOwner(address: string, parcel: ParcelAttributes): Promise<boolean> {
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

  async addOwners(parcels: ParcelAttributes[]): Promise<ParcelAttributes[]> {
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

  async addAssetIds(parcels: ParcelAttributes[]): Promise<ParcelAttributes[]> {
    let newParcels = []

    try {
      const assetIdFetches = parcels.map(async parcel => {
        const assetId = await this.getAssetId(parcel)
        return {
          ...parcel,
          asset_id: assetId.toString()
        }
      })

      newParcels = await Promise.all(assetIdFetches)
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

  async getOwnerOfLand(parcel: ParcelAttributes): Promise<string> {
    const contract = this.getLANDRegistryContract()
    const { x, y } = parcel

    return contract.ownerOfLand(x, y)
  }

  async getOwnerOfLandMany(parcels: ParcelAttributes[]): Promise<string[]> {
    const { x, y } = coordinates.splitPairs(parcels)
    const contract = this.getLANDRegistryContract()
    return contract.ownerOfLandMany(x, y)
  }

  async getAssetId(parcel: ParcelAttributes): Promise<string> {
    const contract = this.getLANDRegistryContract()
    return contract.encodeTokenId(parcel.x, parcel.y)
  }

  toParcelObject(
    parcelArray: ParcelAttributes[]
  ): { [id: string]: ParcelAttributes } {
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
  if (!isDuplicatedConstraintError(error)) throw new Error(error)
}
