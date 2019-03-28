import { eth } from 'decentraland-eth'
import { Log, env } from 'decentraland-commons'

import { Doctor } from './Doctor'
import { Diagnosis } from './Diagnosis'
import { asyncBatch } from '../../src/lib'
import { Parcel, Estate } from '../../src/Asset'
import { BlockchainEvent } from '../../src/BlockchainEvent'
import { eventNames } from '../../src/ethereum'

const log = new Log('EstateDoctor')

export class EstateDoctor extends Doctor {
  async diagnose() {
    const estates = await Estate.findWithParcels()
    const faultyEstates = await this.filterInconsistentEstates(estates)

    return new EstateDiagnosis(faultyEstates)
  }

  async filterInconsistentEstates(allEstates) {
    const faultyEstates = []

    await asyncBatch({
      elements: allEstates,
      callback: async estatesBatch => {
        const promises = estatesBatch.map(async estate => {
          const error = await this.getEstateInconsistencies(estate)

          if (error) {
            log.error(error)
            faultyEstates.push({ ...estate, error })
          }
        })

        await Promise.all(promises)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })

    return faultyEstates
  }

  async getEstateInconsistencies(estate) {
    const {
      id,
      owner,
      data: { parcels }
    } = estate
    let error = ''

    const estateRegistry = eth.getContract('EstateRegistry')
    const currentOwner = await estateRegistry.ownerOf(estate.id)

    if (owner !== currentOwner) {
      error = `Mismatch: owner of '${id}' is '${owner}' on the DB and '${currentOwner}' in blockchain`
    } else {
      const estateSize = await estateRegistry.getEstateSize(estate.id)
      let currentParcels = []

      let index = 0
      await asyncBatch({
        elements: new Array(estateSize.toNumber()),
        callback: async sizeBatch => {
          const promises = []
          for (let i = 0; i < sizeBatch.length; i++) {
            promises.push(this.buildCurrentEstateParcel(estate.id, index++))
          }

          const parcels = await Promise.all(promises)
          currentParcels = [...currentParcels, ...parcels]
        },
        batchSize: env.get('BATCH_SIZE'),
        logFormat: '',
        retryAttempts: 20
      })
      if (!this.isEqualParcels(currentParcels, parcels)) {
        error = `Parcels: db parcels for estate ${id} are different from blockchain`
      }
    }

    return error
  }

  async buildCurrentEstateParcel(estateId, index) {
    const estateRegistry = eth.getContract('EstateRegistry')
    const tokenId = await estateRegistry.estateLandIds(estateId, index)
    const parcelId = await Parcel.decodeTokenId(tokenId.toString())
    const [x, y] = Parcel.splitId(parcelId)
    return { x, y }
  }

  isEqualParcels(left = [], right = []) {
    if (left.length !== right.length) {
      return false
    }

    const leftIds = left.map(({ x, y }) => Parcel.buildId(x, y)).sort()
    const rightIds = right.map(({ x, y }) => Parcel.buildId(x, y)).sort()

    return leftIds.every((parcelId, index) => parcelId === rightIds[index])
  }
}

export class EstateDiagnosis extends Diagnosis {
  constructor(faultyEstates) {
    super()
    this.faultyEstates = faultyEstates
  }

  getFaultyAssets() {
    return this.faultyEstates
  }

  hasProblems() {
    return this.faultyEstates.length > 0
  }

  async prepare() {
    await asyncBatch({
      elements: this.faultyEstates,
      callback: async estatesBatch => {
        const deletes = estatesBatch.map(estate =>
          Estate.deleteBlockchainEvents(estate.id)
        )
        await Promise.all(deletes)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })
  }

  async doTreatment() {
    await asyncBatch({
      elements: this.faultyEstates,
      callback: async estatesBatch => {
        const deletes = estatesBatch.map(estate =>
          Estate.delete({ id: estate.id })
        )
        await Promise.all(deletes)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })

    // Replay events for the estate and old parcels
    const total = this.faultyEstates.length
    for (const [index, estate] of this.faultyEstates.entries()) {
      log.info(`[${index + 1}/${total}]: Treatment for estate Id ${estate.id}`)
      const events = await Estate.findBlockchainEvents(estate.id)
      for (const event of events) {
        if (
          event.name === eventNames.AddLand ||
          event.name === eventNames.RemoveLand
        ) {
          // Replay parcels events based on AddLand and RemoveLand estate events
          const events = await BlockchainEvent.findByAnyArgs(
            ['_landId'],
            event.args._landId
          )
          await this.replayEvents(events)
        } else {
          // Replay estate events only for update or creation
          await this.replayEvents([event])
        }
      }
    }
  }
}
