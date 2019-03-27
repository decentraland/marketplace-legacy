import { Log, env } from 'decentraland-commons'
import { eth } from 'decentraland-eth'

import { Doctor } from './Doctor'
import { Diagnosis } from './Diagnosis'
import { asyncBatch } from '../../src/lib'
import { Parcel, Estate } from '../../src/Asset'
import { BlockchainEvent } from '../../src/BlockchainEvent'
import { parseCLICoords } from '../../scripts/utils'
import { eventNames } from '../../src/ethereum'

const log = new Log('ParcelDoctor')

export class ParcelDoctor extends Doctor {
  async diagnose(options) {
    let conditions = null

    if (options.checkParcel) {
      const [x, y] = parseCLICoords(options.checkParcel)
      conditions = { x, y }
    }

    const parcels = await Parcel.find(conditions)
    const faultyParcels = await this.filterInconsistentParcels(parcels)

    return new ParcelDiagnosis(faultyParcels)
  }

  async filterInconsistentParcels(parcels) {
    const faultyParcels = []
    const landRegistry = eth.getContract('LANDRegistry')
    const estateRegistry = eth.getContract('EstateRegistry')

    await asyncBatch({
      elements: parcels,
      callback: async parcelsBatch => {
        const promises = parcelsBatch.map(async parcel => {
          const [currentOwner, currentEstateId] = await Promise.all([
            landRegistry.ownerOf(parcel.token_id),
            estateRegistry.landIdEstate(parcel.token_id)
          ])

          if (this.isPartOfEstateMismatch(currentEstateId.toString(), parcel)) {
            const { id, estate_id } = parcel
            const error = `Mismatch: estate_id of '${id}' is '${estate_id}' on the DB and '${currentEstateId}' in blockchain`
            log.error(error)
            faultyParcels.push({ ...parcel, currentEstateId, error })
            return
          }

          if (this.isOwnerMismatch(currentOwner, parcel)) {
            const { id, owner } = parcel
            const error = `Mismatch: owner of '${id}' is '${owner}' on the DB and '${currentOwner}' in blockchain`
            log.error(error)
            faultyParcels.push({ ...parcel, error })
            return
          }

          const currentUpdateOperator = parcel.update_operator

          if (this.isUpdateOperatorMismatch(currentUpdateOperator, parcel)) {
            const { id, update_operator } = parcel
            const error = `Mismatch: operator of '${id}' is '${update_operator}' on the DB and '${currentUpdateOperator}' in blockchain`
            log.error(error)
            faultyParcels.push({ ...parcel, error })
            return
          }
        })
        await Promise.all(promises)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })

    return faultyParcels
  }

  isOwnerMismatch(currentOwner, parcel) {
    return !!currentOwner && parcel.owner !== currentOwner
  }

  isUpdateOperatorMismatch(currentUpdateOperator, parcel) {
    return (
      !!currentUpdateOperator &&
      parcel.update_operator !== currentUpdateOperator
    )
  }

  isPartOfEstateMismatch(currentEstateId, parcel) {
    return (
      (parcel.estate_id && parcel.estate_id !== currentEstateId) ||
      (!parcel.estate_id && currentEstateId > 0)
    )
  }
}

export class ParcelDiagnosis extends Diagnosis {
  constructor(faultyParcels) {
    super()
    this.faultyParcels = faultyParcels
  }

  getFaultyAssets() {
    return this.faultyParcels
  }

  hasProblems() {
    return this.faultyParcels.length > 0
  }

  async prepare() {
    await asyncBatch({
      elements: this.faultyParcels,
      callback: async parcelsBatch => {
        const promises = parcelsBatch.map(parcel =>
          Promise.all([
            BlockchainEvent.deleteByArgs('assetId', parcel.token_id),
            BlockchainEvent.deleteByArgs('_landId', parcel.token_id),
            Parcel.update(
              { estate_id: null, update_operator: null },
              { id: parcel.id }
            )
          ])
        )
        await Promise.all(promises)
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })
  }

  async doTreatment() {
    // Run events for Parcels with different estates
    const estateIds = new Set(
      this.faultyParcels
        .filter(({ currentEstateId }) => !!currentEstateId)
        .map(({ currentEstateId }) => parseInt(currentEstateId, 10))
    )

    let total = estateIds.size
    for (const [index, estateId] of [...estateIds].entries()) {
      log.info(`[${index + 1}/${total}]: Treatment for estate Id ${estateId}`)
      const events = await Estate.findBlockchainEvents(estateId)
      await this.replayEvents(events)

      // Replay events on old parcels for that estate
      for (const event of events) {
        if (
          event.name === eventNames.AddLand ||
          event.name === eventNames.RemoveLand
        ) {
          const events = await BlockchainEvent.findByAnyArgs(
            ['_landId'],
            event.args._landId
          )
          await this.replayEvents(events)
        }
      }
    }

    total = this.faultyParcels.length
    for (const [index, parcel] of this.faultyParcels.entries()) {
      log.info(`[${index + 1}/${total}]: Treatment for parcel Id ${parcel.id}`)
      const events = await BlockchainEvent.findByAnyArgs(
        ['assetId', '_landId', 'landId', 'tokenId', '_tokenId'],
        parcel.token_id
      )
      await this.replayEvents(events)
    }
  }
}
