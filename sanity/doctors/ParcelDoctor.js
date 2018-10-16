import { Log, env } from 'decentraland-commons'
import { Doctor } from './Doctor'
import { Diagnosis } from './Diagnosis'
import { asyncBatch } from '../../src/lib'
import { Parcel, ParcelService } from '../../src/Asset'
import { BlockchainEvent } from '../../src/BlockchainEvent'
import { parseCLICoords } from '../../scripts/utils'

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
    const service = new ParcelService()
    const faultyParcels = []

    await asyncBatch({
      elements: parcels,
      callback: async parcelsBatch => {
        let updatedParcels = []

        try {
          updatedParcels = await service.addOwners(parcelsBatch)
        } catch (error) {
          log.info(`Error processing ${parcelsBatch.length} parcels, skipping`)
          return
        }

        for (const [index, parcel] of parcelsBatch.entries()) {
          const currentOwner = updatedParcels[index].owner

          if (this.isOwnerMissmatch(currentOwner, parcel)) {
            const { id, owner } = parcel
            const error = `Mismatch: owner of '${id}' is '${owner}' on the DB and '${currentOwner}' in blockchain`
            log.error(error)
            faultyParcels.push({ ...parcel, error })
          }

          const currentUpdateOperator = updatedParcels[index].update_operator

          if (this.isUpdateOperatorMismatch(currentUpdateOperator, parcel)) {
            const { id, update_operator } = parcel
            const error = `Mismatch: operator of '${id}' is '${update_operator}' on the DB and '${currentUpdateOperator}' in blockchain`
            log.error(error)
            faultyParcels.push({ ...parcel, error })
          }
        }
      },
      batchSize: env.get('BATCH_SIZE'),
      retryAttempts: 20
    })

    return faultyParcels
  }

  isOwnerMissmatch(currentOwner, parcel) {
    return !!currentOwner && parcel.owner !== currentOwner
  }

  isUpdateOperatorMismatch(currentUpdateOperator, parcel) {
    return (
      !!currentUpdateOperator &&
      parcel.update_operator !== currentUpdateOperator
    )
  }
}

export class ParcelDiagnosis extends Diagnosis {
  constructor(faultyParcels) {
    super()
    this.faultyParcels = faultyParcels
  }

  hasProblems() {
    return this.faultyParcels.length > 0
  }

  async prepare() {
    let deletes = []
    for (const parcel of this.faultyParcels) {
      deletes = deletes.concat([
        BlockchainEvent.deleteByArgs('assetId', parcel.token_id),
        BlockchainEvent.deleteByArgs('_landId', parcel.token_id),
        Parcel.update({ estate_id: null }, { id: parcel.id })
      ])
    }
    return Promise.all(deletes)
  }

  async doTreatment() {
    for (const parcel of this.faultyParcels) {
      const events = await BlockchainEvent.findByAnyArgs(
        ['assetId', '_landId'],
        parcel.token_id
      )
      await this.replayEvents(events)
    }
  }
}
